import { useState } from "react";
import { Upload, Database, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadSection } from "@/components/UploadSection";
import { BreedGallery } from "@/components/BreedGallery";
import { StatsOverview } from "@/components/StatsOverview";
import { ModelInfo } from "@/components/ModelInfo";

const Index = () => {
  const [activeTab, setActiveTab] = useState("upload");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-hero py-20 px-6">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center text-primary-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Bovine Recognition</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Bovine Breed
              <br />
              <span className="text-accent">Classification</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
              Advanced AI model trained on 5,181 images to identify 41 distinct cattle breeds with precision
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => setActiveTab("upload")}
                className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Upload className="w-5 h-5 mr-2" />
                Try Recognition
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setActiveTab("breeds")}
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 backdrop-blur-sm"
              >
                <Database className="w-5 h-5 mr-2" />
                Browse Breeds
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-6xl px-6 py-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 h-14 bg-card shadow-soft rounded-xl">
            <TabsTrigger value="upload" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="breeds" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all">
              <Database className="w-4 h-4 mr-2" />
              Breeds
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all">
              <TrendingUp className="w-4 h-4 mr-2" />
              Stats
            </TabsTrigger>
            <TabsTrigger value="model" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all">
              <Sparkles className="w-4 h-4 mr-2" />
              Model
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <UploadSection />
          </TabsContent>

          <TabsContent value="breeds" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <BreedGallery />
          </TabsContent>

          <TabsContent value="stats" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <StatsOverview />
          </TabsContent>

          <TabsContent value="model" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ModelInfo />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm py-12 mt-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">
              Powered by YOLOv8 • Trained on 5,181 high-quality images • 41 breed classes
            </p>
            <p className="text-xs mt-2 text-muted-foreground/70">
              Supporting agricultural innovation through AI technology
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
