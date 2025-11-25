import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Image, Globe, Award } from "lucide-react";

const stats = [
  {
    icon: Database,
    label: "Total Breeds",
    value: "41",
    description: "Distinct cattle breeds classified",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Image,
    label: "Training Images",
    value: "5,181",
    description: "High-quality labeled images",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Globe,
    label: "Origins Covered",
    value: "2",
    description: "Indian & International breeds",
    color: "text-pasture",
    bgColor: "bg-pasture/10",
  },
  {
    icon: Award,
    label: "Model Type",
    value: "YOLOv8",
    description: "State-of-the-art detection",
    color: "text-earth",
    bgColor: "bg-earth/10",
  },
];

const breedsByType = [
  { type: "Dairy", count: 9, percentage: 22 },
  { type: "Draft", count: 16, percentage: 39 },
  { type: "Dual Purpose", count: 9, percentage: 22 },
  { type: "Buffalo", count: 6, percentage: 15 },
  { type: "Dwarf", count: 2, percentage: 5 },
];

const topBreeds = [
  { name: "Gir", count: 372, percentage: 7.2 },
  { name: "Sahiwal", count: 372, percentage: 7.2 },
  { name: "Holstein Friesian", count: 328, percentage: 6.3 },
  { name: "Ayrshire", count: 234, percentage: 4.5 },
  { name: "Brown Swiss", count: 225, percentage: 4.3 },
];

export const StatsOverview = () => {
  return (
    <div className="space-y-6">
      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-[1.02] border-border/50 bg-gradient-card"
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className={`${stat.bgColor} p-3 rounded-xl`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm font-medium text-foreground mt-1">{stat.label}</p>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-soft border-border/50">
          <CardHeader>
            <CardTitle>Breeds by Type</CardTitle>
            <CardDescription>Distribution across cattle categories</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {breedsByType.map((item) => (
              <div key={item.type} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{item.type}</span>
                  <span className="text-muted-foreground">
                    {item.count} breeds ({item.percentage}%)
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage * 2}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border/50">
          <CardHeader>
            <CardTitle>Top Training Datasets</CardTitle>
            <CardDescription>Breeds with most training images</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topBreeds.map((breed, index) => (
              <div key={breed.name} className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-foreground">{breed.name}</span>
                    <span className="text-muted-foreground">
                      {breed.count} ({breed.percentage}%)
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-500"
                      style={{ width: `${breed.percentage * 10}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      <Card className="shadow-soft border-border/50 bg-gradient-card">
        <CardHeader>
          <CardTitle>Dataset Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-card rounded-lg border border-border/50">
              <p className="text-sm text-muted-foreground mb-1">Average per Breed</p>
              <p className="text-2xl font-bold text-foreground">126 images</p>
            </div>
            <div className="p-4 bg-card rounded-lg border border-border/50">
              <p className="text-sm text-muted-foreground mb-1">Indian Breeds</p>
              <p className="text-2xl font-bold text-foreground">35 breeds</p>
            </div>
            <div className="p-4 bg-card rounded-lg border border-border/50">
              <p className="text-sm text-muted-foreground mb-1">International Breeds</p>
              <p className="text-2xl font-bold text-foreground">6 breeds</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
