import { useState } from "react";
import { EventCard } from "./EventCard";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search, SlidersHorizontal } from "lucide-react";

export function EventListing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  const events = [
    {
      id: "1",
      title: "Swachh Bharat Cleanup Drive",
      date: "Oct 15, 2025",
      time: "9:00 AM",
      location: "Cubbon Park, Bengaluru",
      category: "Volunteer",
      capacity: 50,
      registered: 32,
      imageUrl: "https://images.unsplash.com/photo-1758599668125-e154250f24bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2x1bnRlZXIlMjBoZWxwaW5nJTIwY29tbXVuaXR5fGVufDF8fHx8MTc1OTY2MzE5NXww&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Join us for a community cleanup drive to keep our parks beautiful.",
    },
    {
      id: "2",
      title: "Diwali Mela & Cultural Night",
      date: "Oct 20, 2025",
      time: "6:00 PM",
      location: "India Gate, Delhi",
      category: "Entertainment",
      capacity: 200,
      registered: 145,
      imageUrl: "https://images.unsplash.com/photo-1759306221569-028a35bc8c66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwZmVzdGl2YWwlMjBldmVudHxlbnwxfHx8fDE3NTk2NzA4MTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "An evening of classical music, street food, and festive celebrations.",
    },
    {
      id: "3",
      title: "Youth Sports Day",
      date: "Oct 17, 2025",
      time: "2:00 PM",
      location: "Nehru Stadium, Mumbai",
      category: "Sports",
      capacity: 100,
      registered: 67,
      imageUrl: "https://images.unsplash.com/photo-1632580254134-94c4a73dab76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBnYXRoZXJpbmclMjBwZW9wbGV8ZW58MXx8fHwxNzU5NzAxMjcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Traditional and modern sports activities for youth aged 10-18.",
    },
    {
      id: "4",
      title: "Traditional Art Workshop",
      date: "Oct 22, 2025",
      time: "10:00 AM",
      location: "Lalit Kala Akademi, Delhi",
      category: "Education",
      capacity: 30,
      registered: 18,
      imageUrl: "https://images.unsplash.com/photo-1585984968562-1443b72fb0dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBtZWV0aW5nJTIwdGVhbXdvcmt8ZW58MXx8fHwxNzU5NzU1NDA3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Learn Madhubani, Warli, and contemporary art from local artists.",
    },
    {
      id: "5",
      title: "Food Distribution Drive",
      date: "Oct 25, 2025",
      time: "8:00 AM",
      location: "Connaught Place, Delhi",
      category: "Volunteer",
      capacity: 40,
      registered: 28,
      imageUrl: "https://images.unsplash.com/photo-1758599668125-e154250f24bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2x1bnRlZXIlMjBoZWxwaW5nJTIwY29tbXVuaXR5fGVufDF8fHx8MTc1OTY2MzE5NXww&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Help collect and distribute food to families in need.",
    },
    {
      id: "6",
      title: "Bollywood Cinema Under the Stars",
      date: "Oct 28, 2025",
      time: "7:00 PM",
      location: "Marine Drive, Mumbai",
      category: "Entertainment",
      capacity: 150,
      registered: 89,
      imageUrl: "https://images.unsplash.com/photo-1632580254134-94c4a73dab76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBnYXRoZXJpbmclMjBwZW9wbGV8ZW58MXx8fHwxNzU5NzAxMjcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Outdoor screening of classic Bollywood films with chai and samosas.",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1>Browse Events</h1>
        <p className="text-muted-foreground mt-1">
          Discover and register for community events
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input-background"
            />
          </div>
          <Button variant="outline">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="flex flex-wrap gap-4">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="volunteer">Volunteer</SelectItem>
              <SelectItem value="entertainment">Entertainment</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="education">Education</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>

          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="central-park">Central Park</SelectItem>
              <SelectItem value="town-square">Town Square</SelectItem>
              <SelectItem value="sports-complex">Sports Complex</SelectItem>
              <SelectItem value="community-center">Community Center</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Event Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-muted-foreground">
            Showing {events.length} events
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </div>
    </div>
  );
}
