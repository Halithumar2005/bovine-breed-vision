import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, Target, Layers } from "lucide-react";

const modelFeatures = [
  {
    icon: Brain,
    title: "YOLOv8 Architecture",
    description: "Latest version of the YOLO (You Only Look Once) family, optimized for real-time object detection with state-of-the-art accuracy.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Zap,
    title: "Fast Inference",
    description: "Optimized for quick predictions with minimal latency, suitable for real-time applications in agricultural settings.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Target,
    title: "High Precision",
    description: "Trained on carefully curated and balanced dataset with robust data augmentation for reliable breed identification.",
    color: "text-pasture",
    bgColor: "bg-pasture/10",
  },
  {
    icon: Layers,
    title: "Multi-class Output",
    description: "Simultaneous classification across 41 distinct cattle breeds with confidence scores for each prediction.",
    color: "text-earth",
    bgColor: "bg-earth/10",
  },
];

const technicalSpecs = [
  { label: "Model Type", value: "YOLOv8" },
  { label: "Framework", value: "PyTorch" },
  { label: "Input Size", value: "640x640" },
  { label: "Classes", value: "41" },
  { label: "Training Images", value: "5,181" },
  { label: "Model File", value: "bovine_modela.pt" },
];

export const ModelInfo = () => {
  return (
    <div className="space-y-6">
      {/* Model Overview */}
      <Card className="shadow-soft border-border/50 bg-gradient-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Model Architecture</CardTitle>
              <CardDescription className="mt-2">
                Advanced deep learning model for cattle breed classification
              </CardDescription>
            </div>
            <Badge className="bg-primary text-primary-foreground text-lg px-4 py-2">
              YOLOv8
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {technicalSpecs.map((spec) => (
              <div
                key={spec.label}
                className="flex justify-between items-center p-4 bg-card rounded-lg border border-border/50"
              >
                <span className="text-sm text-muted-foreground">{spec.label}</span>
                <span className="font-medium text-foreground">{spec.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Features */}
      <div className="grid md:grid-cols-2 gap-4">
        {modelFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card
              key={feature.title}
              className="shadow-soft hover:shadow-glow transition-all duration-300 border-border/50"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`${feature.bgColor} p-3 rounded-xl`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Training Details */}
      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <CardTitle>Training Details</CardTitle>
          <CardDescription>Dataset composition and model training information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-sm max-w-none text-muted-foreground">
            <h4 className="text-foreground font-semibold mb-2">Dataset Composition</h4>
            <ul className="space-y-1 text-sm">
              <li>
                <strong>Total Images:</strong> 5,181 high-quality photographs
              </li>
              <li>
                <strong>Breed Coverage:</strong> 41 distinct cattle breeds (35 Indian, 6 International)
              </li>
              <li>
                <strong>Category Balance:</strong> Includes Dairy, Draft, Dual Purpose, Buffalo, and Dwarf varieties
              </li>
              <li>
                <strong>Image Quality:</strong> Professional and field photographs with varied lighting and angles
              </li>
            </ul>

            <h4 className="text-foreground font-semibold mb-2 mt-6">Model Capabilities</h4>
            <ul className="space-y-1 text-sm">
              <li>Real-time breed identification from images</li>
              <li>Confidence scoring for prediction reliability</li>
              <li>Support for various image formats and resolutions</li>
              <li>Robust to different lighting conditions and angles</li>
              <li>Handles both close-up and full-body cattle images</li>
            </ul>

            <h4 className="text-foreground font-semibold mb-2 mt-6">Integration Requirements</h4>
            <p className="text-sm">
              The model file (<code className="text-accent">bovine_modela.pt</code>) requires a backend
              service with PyTorch runtime for inference. The current interface is ready for API
              integration to enable real-time predictions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
