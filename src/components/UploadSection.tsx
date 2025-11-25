import { useState, useCallback } from "react";
import { Upload, ImageIcon, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const UploadSection = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

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

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      simulateAnalysis();
    };
    reader.readAsDataURL(file);
  };

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      toast.success("Model integration coming soon! Upload interface ready for backend connection.");
    }, 2000);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="shadow-soft hover:shadow-glow transition-all duration-300 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Upload Cattle Image
          </CardTitle>
          <CardDescription>
            Upload an image to identify the cattle breed using our AI model
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
                  or click to browse files
                </p>
              </div>

              <Button variant="outline" className="pointer-events-none">
                <Upload className="w-4 h-4 mr-2" />
                Select Image
              </Button>
            </div>
          </div>

          {selectedImage && (
            <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full h-64 object-cover rounded-xl shadow-soft"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className={`w-5 h-5 ${isAnalyzing ? "animate-spin text-primary" : "text-muted-foreground"}`} />
            Analysis Results
          </CardTitle>
          <CardDescription>
            AI-powered breed identification results will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isAnalyzing ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          ) : selectedImage ? (
            <div className="space-y-4">
              <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Top Prediction</p>
                <p className="text-2xl font-bold text-accent">Model Ready</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Backend integration needed for live predictions
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">How it works:</p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Image preprocessing and normalization</li>
                  <li>YOLOv8 model inference</li>
                  <li>Confidence scoring across 41 breeds</li>
                  <li>Top-K predictions with probabilities</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                Upload an image to see results
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
