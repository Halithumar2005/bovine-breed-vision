import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, Camera, TrendingUp, Shield, Zap, Users, LogOut } from "lucide-react";
import type { User } from "@supabase/supabase-js";

const Start = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  const features = [
    {
      icon: Camera,
      title: "AI-Powered Recognition",
      description: "Upload cattle images and get instant breed identification using advanced YOLOv8 technology trained on 5,181 images.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: TrendingUp,
      title: "41 Breed Database",
      description: "Comprehensive coverage of Indian and international cattle breeds with detailed characteristics and information.",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Shield,
      title: "High Accuracy",
      description: "State-of-the-art deep learning model provides reliable predictions with confidence scores for each classification.",
      color: "text-pasture",
      bgColor: "bg-pasture/10",
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get breed predictions in seconds with detailed descriptions, characteristics, and agricultural insights.",
      color: "text-earth",
      bgColor: "bg-earth/10",
    },
    {
      icon: Users,
      title: "Community Feedback",
      description: "Help improve the model by rating accuracy and providing feedback on classification results.",
      color: "text-gold",
      bgColor: "bg-gold/10",
    },
    {
      icon: Sparkles,
      title: "Moo Chatbot",
      description: "Get instant answers to your cattle-related questions from our friendly AI assistant, Moo!",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🐄</span>
            <div>
              <h2 className="text-xl font-bold text-foreground">Bovine AI</h2>
              <p className="text-xs text-muted-foreground">Cattle Recognition Platform</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 px-6">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        
        <div className="container mx-auto max-w-4xl relative z-10 text-center text-primary-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Welcome, {user.user_metadata?.full_name || user.email}!</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Advanced Cattle Breed
            <br />
            <span className="text-accent">Recognition System</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Harness the power of AI to identify cattle breeds with precision. Our YOLOv8 model recognizes 41 distinct breeds from a single image.
          </p>
          
          <Button 
            size="lg"
            onClick={() => navigate("/classify")}
            className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg px-8 py-6"
          >
            <Camera className="w-6 h-6 mr-2" />
            Start Classification
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto max-w-6xl px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Platform Features</h2>
          <p className="text-muted-foreground text-lg">Everything you need for cattle breed identification</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-[1.02] border-border/50 bg-gradient-card animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`${feature.bgColor} p-3 rounded-xl`}>
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* About Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto max-w-4xl px-6">
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl">About the Project</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Our Bovine Breed Classification system represents a breakthrough in agricultural technology, 
                combining computer vision and deep learning to provide instant, accurate cattle breed identification.
              </p>
              <p>
                Built on the YOLOv8 architecture and trained on over 5,000 carefully curated images, our model 
                achieves exceptional accuracy across 41 different cattle breeds, including both Indian heritage 
                breeds and international varieties.
              </p>
              <p>
                Whether you're a farmer, veterinarian, researcher, or agricultural enthusiast, this platform 
                empowers you with instant breed identification, detailed breed information, and AI-powered insights 
                to support better livestock management decisions.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm py-8 mt-16">
        <div className="container mx-auto max-w-6xl px-6 text-center text-muted-foreground">
          <p className="text-sm">
            Powered by YOLOv8 • 5,181 training images • 41 breed classes
          </p>
          <p className="text-xs mt-2 text-muted-foreground/70">
            Supporting agricultural innovation through AI technology
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Start;
