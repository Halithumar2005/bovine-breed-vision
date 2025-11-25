import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

const breeds = [
  { name: "Alambadi", count: 99, origin: "Indian", type: "Draft" },
  { name: "Amritmahal", count: 94, origin: "Indian", type: "Draft" },
  { name: "Ayrshire", count: 234, origin: "International", type: "Dairy" },
  { name: "Banni", count: 108, origin: "Indian", type: "Dual Purpose" },
  { name: "Bargur", count: 93, origin: "Indian", type: "Draft" },
  { name: "Bhadawari", count: 86, origin: "Indian", type: "Buffalo" },
  { name: "Brown Swiss", count: 225, origin: "International", type: "Dairy" },
  { name: "Dangi", count: 82, origin: "Indian", type: "Draft" },
  { name: "Deoni", count: 99, origin: "Indian", type: "Dual Purpose" },
  { name: "Gir", count: 372, origin: "Indian", type: "Dairy" },
  { name: "Guernsey", count: 119, origin: "International", type: "Dairy" },
  { name: "Hallikar", count: 186, origin: "Indian", type: "Draft" },
  { name: "Hariana", count: 87, origin: "Indian", type: "Dual Purpose" },
  { name: "Holstein Friesian", count: 328, origin: "International", type: "Dairy" },
  { name: "Jaffrabadi", count: 59, origin: "Indian", type: "Buffalo" },
  { name: "Jersey", count: 203, origin: "International", type: "Dairy" },
  { name: "Kangayam", count: 78, origin: "Indian", type: "Draft" },
  { name: "Kankrej", count: 178, origin: "Indian", type: "Dual Purpose" },
  { name: "Kasargod", count: 68, origin: "Indian", type: "Draft" },
  { name: "Kenkatha", count: 55, origin: "Indian", type: "Draft" },
  { name: "Kherigarh", count: 27, origin: "Indian", type: "Dual Purpose" },
  { name: "Khillari", count: 84, origin: "Indian", type: "Draft" },
  { name: "Krishna Valley", count: 136, origin: "Indian", type: "Dual Purpose" },
  { name: "Malnad Gidda", count: 50, origin: "Indian", type: "Dwarf" },
  { name: "Mehsana", count: 48, origin: "Indian", type: "Buffalo" },
  { name: "Murrah", count: 158, origin: "Indian", type: "Buffalo" },
  { name: "Nagori", count: 44, origin: "Indian", type: "Draft" },
  { name: "Nagpuri", count: 179, origin: "Indian", type: "Draft" },
  { name: "Nili Ravi", count: 86, origin: "Indian", type: "Buffalo" },
  { name: "Nimari", count: 49, origin: "Indian", type: "Dual Purpose" },
  { name: "Ongole", count: 118, origin: "Indian", type: "Draft" },
  { name: "Pulikulam", count: 108, origin: "Indian", type: "Draft" },
  { name: "Rathi", count: 113, origin: "Indian", type: "Dual Purpose" },
  { name: "Red Dane", count: 167, origin: "International", type: "Dairy" },
  { name: "Red Sindhi", count: 112, origin: "Indian", type: "Dairy" },
  { name: "Sahiwal", count: 372, origin: "Indian", type: "Dairy" },
  { name: "Surti", count: 50, origin: "Indian", type: "Buffalo" },
  { name: "Tharparkar", count: 164, origin: "Indian", type: "Dual Purpose" },
  { name: "Toda", count: 124, origin: "Indian", type: "Buffalo" },
  { name: "Umblachery", count: 41, origin: "Indian", type: "Draft" },
  { name: "Vechur", count: 98, origin: "Indian", type: "Dwarf" },
];

export const BreedGallery = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBreeds = breeds.filter((breed) =>
    breed.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Dairy":
        return "bg-primary/10 text-primary border-primary/20";
      case "Draft":
        return "bg-earth/10 text-earth border-earth/20";
      case "Dual Purpose":
        return "bg-accent/10 text-accent border-accent/20";
      case "Buffalo":
        return "bg-pasture/10 text-pasture border-pasture/20";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <CardTitle>Breed Database</CardTitle>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search breeds..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBreeds.map((breed) => (
          <Card
            key={breed.name}
            className="shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-[1.02] border-border/50 bg-gradient-card"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>{breed.name}</span>
                <Badge variant="outline" className="ml-2">
                  {breed.count}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-xs">
                  {breed.origin}
                </Badge>
                <Badge className={`text-xs border ${getTypeColor(breed.type)}`}>
                  {breed.type}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {breed.count} training images
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBreeds.length === 0 && (
        <Card className="shadow-soft border-border/50">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No breeds found matching your search.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
