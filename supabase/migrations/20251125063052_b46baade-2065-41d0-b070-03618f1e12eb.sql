-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Function to handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

-- Trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create classifications table
CREATE TABLE public.classifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  breed_prediction TEXT NOT NULL,
  confidence DECIMAL(5,2) NOT NULL,
  top_predictions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.classifications ENABLE ROW LEVEL SECURITY;

-- Classifications policies
CREATE POLICY "Users can view their own classifications"
  ON public.classifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own classifications"
  ON public.classifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own classifications"
  ON public.classifications FOR DELETE
  USING (auth.uid() = user_id);

-- Create surveys table
CREATE TABLE public.surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  classification_id UUID REFERENCES public.classifications(id) ON DELETE CASCADE,
  accuracy_rating INTEGER CHECK (accuracy_rating >= 1 AND accuracy_rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;

-- Surveys policies
CREATE POLICY "Users can view their own surveys"
  ON public.surveys FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own surveys"
  ON public.surveys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create storage bucket for cattle images
INSERT INTO storage.buckets (id, name, public)
VALUES ('cattle-images', 'cattle-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for cattle images
CREATE POLICY "Users can upload their own images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'cattle-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view cattle images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'cattle-images');

CREATE POLICY "Users can delete their own images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'cattle-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );