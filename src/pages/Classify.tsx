import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, ImageIcon, Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { MooChatbot } from "@/components/MooChatbot";
import type { User } from "@supabase/supabase-js";

const Classify = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedImage || !user) {
      toast.error("Please select an image first");
      return;
    }

    setIsAnalyzing(true);
    try {
      // Upload image to storage
      const fileExt = selectedImage.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("cattle-images")
        .upload(fileName, selectedImage);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("cattle-images")
        .getPublicUrl(fileName);

      // For now, simulate classification (backend model integration needed)
      setTimeout(() => {
        navigate("/results", {
          state: {
            imageUrl: publicUrl,
            prediction: "Gir",
            confidence: 94.5,
            topPredictions: [
              { breed: "Gir", confidence: 94.5 },
              { breed: "Sahiwal", confidence: 3.2 },
              { breed: "Red Sindhi", confidence: 1.8 },
            ],
          },
        });
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || "Classification failed");
      setIsAnalyzing(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background relative">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🐄</span>
            <h2 className="text-xl font-bold text-foreground">Classify Cattle</h2>
          </div>
          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="shadow-soft hover:shadow-glow transition-all duration-300 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Upload Image
              </CardTitle>
              <CardDescription>
                Upload a clear image of cattle for breed identification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300
                  ${isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover:border-primary/50 hover:bg-primary/5"}
                `}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-primary" />
                  </div>
                  
                  <div>
                    <p className="text-lg font-medium text-foreground mb-2">
                      Drop your image here
                    </p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse
                    </p>
                  </div>

                  <Button variant="outline" className="pointer-events-none">
                    <Upload className="w-4 h-4 mr-2" />
                    Select Image
                  </Button>
                </div>
              </div>

              {previewUrl && (
                <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-xl shadow-soft"
                  />
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full mt-4 bg-primary hover:bg-primary/90"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Analyze Breed
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle>Upload Guidelines</CardTitle>
              <CardDescription>
                Follow these tips for best results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-xs">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Clear Image</p>
                    <p className="text-muted-foreground">Use high-quality, well-lit photographs</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-xs">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Full View</p>
                    <p className="text-muted-foreground">Show the entire cattle or a clear side profile</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-xs">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Single Subject</p>
                    <p className="text-muted-foreground">Focus on one cattle at a time for accurate results</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-xs">4</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Good Lighting</p>
                    <p className="text-muted-foreground">Natural daylight works best for identification</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg mt-6">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Supported formats:</strong> JPG, PNG, WEBP
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong className="text-foreground">Max file size:</strong> 10MB
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Moo Chatbot */}
      <MooChatbot />
    </div>
  );
};

export default Classify;
