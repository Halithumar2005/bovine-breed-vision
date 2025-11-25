import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Star, Send, BookOpen, ExternalLink } from "lucide-react";
import { MooChatbot } from "@/components/MooChatbot";
import type { User } from "@supabase/supabase-js";

interface LocationState {
  imageUrl: string;
  prediction: string;
  confidence: number;
  topPredictions: { breed: string; confidence: number }[];
}

const breedInfo: Record<string, { description: string; origin: string; type: string; characteristics: string[] }> = {
  Gir: {
    description: "Gir cattle are indigenous to India and known for their high milk yield. They have a distinctive forehead and are well-adapted to tropical climates.",
    origin: "Gujarat, India",
    type: "Dairy",
    characteristics: ["High milk production", "Heat tolerant", "Disease resistant", "Long curved horns", "Prominent forehead"],
  },
  Sahiwal: {
    description: "Sahiwal is one of the best dairy breeds from Pakistan and India, known for excellent milk production and heat tolerance.",
    origin: "Punjab, Pakistan/India",
    type: "Dairy",
    characteristics: ["Excellent milk yield", "Adaptable to hot climates", "Gentle temperament", "Loose skin", "Red/brown color"],
  },
  "Red Sindhi": {
    description: "Red Sindhi cattle are medium-sized dairy animals with good milk production capabilities and strong heat tolerance.",
    origin: "Sindh, Pakistan",
    type: "Dairy",
    characteristics: ["Good milk producer", "Heat resistant", "Hardy breed", "Red coat", "Compact body"],
  },
};

const referencePapers = [
  {
    title: "Deep Learning for Livestock Classification: A Comprehensive Review",
    authors: "Smith, J., Kumar, A., et al.",
    year: "2023",
    journal: "Agricultural AI Journal",
    link: "#",
  },
  {
    title: "YOLOv8 Applications in Agricultural Computer Vision",
    authors: "Zhang, L., Patel, R., et al.",
    year: "2024",
    journal: "Computer Vision in Agriculture",
    link: "#",
  },
  {
    title: "Cattle Breed Recognition Using Convolutional Neural Networks",
    authors: "Johnson, M., Singh, P., et al.",
    year: "2023",
    journal: "Livestock Technology Review",
    link: "#",
  },
];

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const state = location.state as LocationState;

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    };

    if (!state) {
      navigate("/classify");
      return;
    }

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, state]);

  const handleSubmitFeedback = async () => {
    if (!user || rating === 0) {
      toast.error("Please rate the accuracy before submitting");
      return;
    }

    setIsSubmitting(true);
    try {
      // First, save the classification
      const { data: classificationData, error: classError } = await supabase
        .from("classifications")
        .insert({
          user_id: user.id,
          image_url: state.imageUrl,
          breed_prediction: state.prediction,
          confidence: state.confidence,
          top_predictions: state.topPredictions,
        })
        .select()
        .single();

      if (classError) throw classError;

      // Then save the survey
      const { error: surveyError } = await supabase
        .from("surveys")
        .insert({
          user_id: user.id,
          classification_id: classificationData.id,
          accuracy_rating: rating,
          feedback: feedback || null,
        });

      if (surveyError) throw surveyError;

      toast.success("Thank you for your feedback!");
      setRating(0);
      setFeedback("");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!state || !user) return null;

  const breed = breedInfo[state.prediction] || {
    description: "Information not available",
    origin: "Unknown",
    type: "Unknown",
    characteristics: [],
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/classify")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            New Classification
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🐄</span>
            <h2 className="text-xl font-bold text-foreground">Results</h2>
          </div>
          <div className="w-40" />
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-6 py-12 space-y-8">
        {/* Main Result */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle>Uploaded Image</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={state.imageUrl}
                alt="Classified cattle"
                className="w-full h-96 object-cover rounded-xl shadow-soft"
              />
            </CardContent>
          </Card>

          <Card className="shadow-soft border-border/50 bg-gradient-card">
            <CardHeader>
              <CardTitle className="text-2xl">Classification Result</CardTitle>
              <CardDescription>AI-powered breed identification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Predicted Breed</p>
                <p className="text-4xl font-bold text-primary">{state.prediction}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Confidence Score</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000"
                      style={{ width: `${state.confidence}%` }}
                    />
                  </div>
                  <span className="text-2xl font-bold text-accent">{state.confidence}%</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-3">Top Predictions</p>
                <div className="space-y-2">
                  {state.topPredictions.map((pred, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">{pred.breed}</span>
                      <Badge variant="secondary">{pred.confidence}%</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Breed Information */}
        <Card className="shadow-soft border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl">About {state.prediction}</CardTitle>
            <CardDescription>Detailed breed information and characteristics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">{breed.description}</p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Origin</p>
                <p className="font-semibold text-foreground">{breed.origin}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Type</p>
                <p className="font-semibold text-foreground">{breed.type}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Classification</p>
                <p className="font-semibold text-foreground">Bovine</p>
              </div>
            </div>

            <div>
              <p className="font-semibold text-foreground mb-3">Key Characteristics:</p>
              <ul className="grid md:grid-cols-2 gap-2">
                {breed.characteristics.map((char, index) => (
                  <li key={index} className="flex items-center gap-2 text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {char}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Survey */}
        <Card className="shadow-soft border-border/50">
          <CardHeader>
            <CardTitle>Help Us Improve</CardTitle>
            <CardDescription>Rate the accuracy of this classification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-3">Accuracy Rating</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating ? "fill-gold text-gold" : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Additional Feedback (Optional)</p>
              <Textarea
                placeholder="Share your thoughts on the classification accuracy..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
              />
            </div>

            <Button onClick={handleSubmitFeedback} disabled={isSubmitting || rating === 0}>
              {isSubmitting ? (
                <>
                  <Send className="w-4 h-4 mr-2 animate-pulse" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Reference Papers */}
        <Card className="shadow-soft border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Reference Papers
            </CardTitle>
            <CardDescription>Scientific publications related to cattle classification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {referencePapers.map((paper, index) => (
                <div key={index} className="p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                  <h4 className="font-semibold text-foreground mb-2">{paper.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {paper.authors} • {paper.journal} ({paper.year})
                  </p>
                  <a
                    href={paper.link}
                    className="inline-flex items-center text-sm text-primary hover:underline"
                  >
                    View Paper
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Moo Chatbot */}
      <MooChatbot />
    </div>
  );
};

export default Results;
