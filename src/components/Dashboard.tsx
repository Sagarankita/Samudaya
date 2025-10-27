import { StatsCard } from "./StatsCard";
import { EventCard } from "./EventCard";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, CalendarDays, Clock, Plus, Bell } from "lucide-react";

interface DashboardProps {
  onPageChange: (page: string) => void;
}

export function Dashboard({ onPageChange }: DashboardProps) {
  const upcomingEvents = [
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
      description: "Join us for a community cleanup drive to keep our parks beautiful and clean.",
      status: "registered" as const,
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
      description: "An evening of classical music, street food stalls, and festive celebrations.",
    },
  ];

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
        <h1 className="text-white">Welcome back, Rajesh!</h1>
        <p className="mt-2 opacity-90">
          You have 3 upcoming events this week. Stay active in your community!
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <div className="lg:col-span-2">
          <h2 className="mb-4">Your Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
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
    </div>
  );
}
