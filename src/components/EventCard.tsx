import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  capacity: number;
  registered: number;
  imageUrl: string;
  description: string;
  status?: "registered" | "created" | "volunteering";
  onRegister?: () => void;
}

export function EventCard({ 
  id,
  title, 
  date, 
  time, 
  location, 
  category, 
  capacity, 
  registered, 
  imageUrl, 
  description,
  status,
  onRegister
}: EventCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "registered":
        return "bg-blue-500";
      case "created":
        return "bg-green-500";
      case "volunteering":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover"
        />
        {status && (
          <div className={`absolute top-3 left-3 h-3 w-3 rounded-full ${getStatusColor()}`} />
        )}
        <Badge className="absolute top-3 right-3 bg-white text-foreground">
          {category}
        </Badge>
      </div>
      <CardHeader>
        <h3>{title}</h3>
        <div className="flex flex-col gap-2 mt-2 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{date} at {time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-2">{description}</p>
        <div className="flex items-center gap-2 mt-3">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {registered}/{capacity} registered
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white" onClick={onRegister}>
          {status === "registered" ? "View Details" : "Register"}
        </Button>
      </CardFooter>
    </Card>
  );
}
