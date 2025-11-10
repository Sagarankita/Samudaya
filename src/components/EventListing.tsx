import { useEffect, useState } from "react";
import { EventCard } from "./EventCard";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { eventsAPI } from "../services/api";
import { Alert, AlertDescription } from "./ui/alert";

interface EventListingProps {
  user: any;
}

export function EventListing({ user }: EventListingProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [events, setEvents] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await eventsAPI.getAll(user?.id);
        if (!mounted) return;
        setEvents(
          data.map((e: any) => ({
            id: e._id,
            title: e.title,
            date: e.date,
            time: e.time,
            location: e.location,
            category: e.category,
            capacity: e.capacity,
            registered: e.registered || 0,
            imageUrl: e.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
            description: e.description,
            status: e.isRegistered ? "registered" as const : undefined,
          }))
        );
      } catch (err: any) {
        setError(err.message || "Failed to load events");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user?.id]);

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
        {(() => {
          // Apply filters
          let filteredEvents = events;
          
          // Search filter
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredEvents = filteredEvents.filter((e) =>
              e.title.toLowerCase().includes(query) ||
              e.description.toLowerCase().includes(query) ||
              e.location.toLowerCase().includes(query)
            );
          }
          
          // Category filter
          if (categoryFilter !== "all") {
            filteredEvents = filteredEvents.filter((e) => e.category.toLowerCase() === categoryFilter.toLowerCase());
          }
          
          // Date filter
          if (dateFilter !== "all") {
            const now = new Date();
            filteredEvents = filteredEvents.filter((e) => {
              const eventDate = new Date(e.date);
              switch (dateFilter) {
                case "today":
                  return eventDate.toDateString() === now.toDateString();
                case "week":
                  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                  return eventDate >= now && eventDate <= weekFromNow;
                case "month":
                  const monthFromNow = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
                  return eventDate >= now && eventDate <= monthFromNow;
                default:
                  return true;
              }
            });
          }
          
          // Location filter
          if (locationFilter !== "all") {
            filteredEvents = filteredEvents.filter((e) =>
              e.location.toLowerCase().includes(locationFilter.toLowerCase())
            );
          }
          
          return (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-muted-foreground">Showing {filteredEvents.length} of {events.length} events</p>
              </div>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {loading && <p className="text-muted-foreground">Loading events...</p>}
              {!loading && filteredEvents.length === 0 && (
                <p className="text-muted-foreground">No events found matching your filters.</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    {...event}
                    onRegister={async () => {
                      if (!user?.id) return;
                      try {
                        await eventsAPI.register(event.id, user.id);
                        // Refresh events
                        const updatedEvents = await eventsAPI.getAll(user.id);
                        setEvents(
                          updatedEvents.map((e: any) => ({
                            id: e._id,
                            title: e.title,
                            date: e.date,
                            time: e.time,
                            location: e.location,
                            category: e.category,
                            capacity: e.capacity,
                            registered: e.registered || 0,
                            imageUrl: e.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
                            description: e.description,
                            status: e.isRegistered ? "registered" as const : undefined,
                          }))
                        );
                      } catch (err: any) {
                        setError(err.message || "Registration failed");
                      }
                    }}
                  />
                ))}
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}
