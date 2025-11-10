import { StatsCard } from "./StatsCard";
import { EventCard } from "./EventCard";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, CalendarDays, Clock, Plus, Bell } from "lucide-react";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { eventsAPI } from "../services/api";
import { Alert, AlertDescription } from "./ui/alert";

interface DashboardProps {
  onPageChange: (page: string) => void;
  user: any;
}

export function Dashboard({ onPageChange, user }: DashboardProps) {
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const events = await eventsAPI.getAll(user?.id);
        // Filter to show only published events, limit to 2 for dashboard
        const published = events.filter((e: any) => e.status === 'published').slice(0, 2);
        setUpcomingEvents(published.map((e: any) => ({
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
        })));
      } catch (err: any) {
        setError(err.message || "Failed to load events");
      }
    })();
  }, [user?.id]);

  const announcements = [
    { id: "1", title: "New Online Registration Portal Launched", type: "Info", date: "Oct 5, 2025" },
    { id: "2", title: "Volunteer Appreciation Day", type: "Event Update", date: "Oct 3, 2025" },
    { id: "3", title: "Community Feedback Survey", type: "Info", date: "Oct 1, 2025" },
  ];

  const getAnnouncementColor = (type: string) => {
    switch (type) {
      case "Emergency":
        return "bg-red-500";
      case "Event Update":
        return "bg-blue-500";
      default:
        return "bg-emerald-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-orange-600 rounded-lg p-6 text-white">
        <h1 className="text-white">Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h1>
        <p className="mt-2 opacity-90">
          You have {upcomingEvents.length} upcoming events. Stay active in your community!
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Upcoming Events"
          value="12"
          icon={Calendar}
          trend="+3 this week"
          color="bg-orange-600"
        />
        <StatsCard
          title="Registered Events"
          value="5"
          icon={CalendarDays}
          trend="2 this month"
          color="bg-blue-600"
        />
        <StatsCard
          title="Volunteer Hours"
          value="28"
          icon={Clock}
          trend="+4 this week"
          color="bg-green-600"
        />
        <StatsCard
          title="Forum Posts"
          value="42"
          icon={Bell}
          color="bg-purple-600"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h3>Quick Actions</h3>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button 
              className="bg-orange-600 hover:bg-orange-700 text-white"
              onClick={() => onPageChange("create-event")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
            <Button 
              variant="outline"
              onClick={() => onPageChange("calendar")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              View Calendar
            </Button>
            <Button 
              variant="outline"
              onClick={() => onPageChange("events")}
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              Browse Events
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <div className="lg:col-span-2">
          <h2 className="mb-4">Your Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingEvents.map((event) => (
              <EventCard 
                key={event.id} 
                {...event} 
                onRegister={async () => {
                  setSelectedEvent(event);
                  if (event.status === "registered") {
                    setShowEventDialog(true);
                  } else {
                    // Register for event
                    try {
                      await eventsAPI.register(event.id, user.id);
                      // Refresh events
                      const updatedEvents = await eventsAPI.getAll(user?.id);
                      const published = updatedEvents.filter((e: any) => e.status === 'published').slice(0, 2);
                      setUpcomingEvents(published.map((e: any) => ({
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
                      })));
                      // Update selected event with new status
                      const updated = updatedEvents.find((e: any) => e._id === event.id);
                      if (updated) {
                        setSelectedEvent({
                          ...event,
                          status: "registered" as const,
                          registered: updated.registered || event.registered + 1,
                        });
                      }
                      setShowEventDialog(true);
                    } catch (err: any) {
                      setError(err.message || "Registration failed");
                    }
                  }
                }}
              />
            ))}
          </div>
          {upcomingEvents.length === 0 && (
            <p className="text-muted-foreground">No upcoming events. Check out the Events page to discover more!</p>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Mini Calendar */}
          <Card>
            <CardHeader>
              <h3>This Week</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <div className="bg-orange-600 text-white rounded p-2 text-center min-w-[3rem]">
                    <div>15</div>
                    <div className="text-white/80">Oct</div>
                  </div>
                  <div>
                    <p>Swachh Bharat Drive</p>
                    <p className="text-muted-foreground">9:00 AM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <div className="bg-blue-600 text-white rounded p-2 text-center min-w-[3rem]">
                    <div>17</div>
                    <div className="text-white/80">Oct</div>
                  </div>
                  <div>
                    <p>Youth Sports Day</p>
                    <p className="text-muted-foreground">2:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <div className="bg-green-600 text-white rounded p-2 text-center min-w-[3rem]">
                    <div>20</div>
                    <div className="text-white/80">Oct</div>
                  </div>
                  <div>
                    <p>Diwali Mela</p>
                    <p className="text-muted-foreground">6:00 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Announcements */}
          <Card>
            <CardHeader>
              <h3>Recent Announcements</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="flex gap-3 pb-3 border-b last:border-0">
                    <div className={`h-2 w-2 rounded-full mt-2 ${getAnnouncementColor(announcement.type)}`} />
                    <div className="flex-1">
                      <p>{announcement.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{announcement.type}</Badge>
                        <span className="text-muted-foreground">{announcement.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                variant="link" 
                className="w-full mt-3 text-emerald-600"
                onClick={() => onPageChange("announcements")}
              >
                View All Announcements
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Details Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>Event Details</DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Date & Time</p>
                <p>{selectedEvent.date} at {selectedEvent.time}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p>{selectedEvent.location}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <Badge>{selectedEvent.category}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p>{selectedEvent.description}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Registration</p>
                <p>{selectedEvent.registered}/{selectedEvent.capacity} registered</p>
              </div>
              {selectedEvent.status === "registered" && (
                <Alert>
                  <AlertDescription>You are registered for this event!</AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
