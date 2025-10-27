import { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar } from "./ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface CalendarPageProps {
  onPageChange: (page: string) => void;
}

export function CalendarPage({ onPageChange }: CalendarPageProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");

  const events = [
    {
      id: "1",
      title: "Swachh Bharat Cleanup Drive",
      date: "2025-10-15",
      time: "9:00 AM - 12:00 PM",
      status: "registered" as const,
      location: "Cubbon Park, Bengaluru",
    },
    {
      id: "2",
      title: "Youth Sports Day",
      date: "2025-10-17",
      time: "2:00 PM - 5:00 PM",
      status: "created" as const,
      location: "Nehru Stadium, Mumbai",
    },
    {
      id: "3",
      title: "Diwali Mela & Cultural Night",
      date: "2025-10-20",
      time: "6:00 PM - 10:00 PM",
      status: "volunteering" as const,
      location: "India Gate, Delhi",
    },
    {
      id: "4",
      title: "Traditional Art Workshop",
      date: "2025-10-22",
      time: "10:00 AM - 2:00 PM",
      status: "registered" as const,
      location: "Lalit Kala Akademi, Delhi",
    },
  ];

  const getStatusColor = (status: string) => {
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "registered":
        return "Registered";
      case "created":
        return "Created by Me";
      case "volunteering":
        return "Volunteering";
      default:
        return "Event";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Calendar & Booking</h1>
          <p className="text-muted-foreground mt-1">
            Manage your events and schedule
          </p>
        </div>
        <Button 
          className="bg-orange-600 hover:bg-orange-700 text-white"
          onClick={() => onPageChange("create-event")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Color Legend */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-muted-foreground">Registered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-muted-foreground">Created by Me</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-orange-500" />
              <span className="text-muted-foreground">Volunteering</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={view} onValueChange={(v) => setView(v as "month" | "week" | "day")}>
        <TabsList>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="day">Day</TabsTrigger>
        </TabsList>

        <TabsContent value="month" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3>October 2025</h3>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3>Upcoming Events</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="p-3 border rounded-lg hover:bg-muted cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p>{event.title}</p>
                        <div className={`h-2 w-2 rounded-full mt-1 ${getStatusColor(event.status)}`} />
                      </div>
                      <p className="text-muted-foreground">{event.time}</p>
                      <p className="text-muted-foreground">{event.location}</p>
                      <Badge variant="secondary" className="mt-2">
                        {getStatusLabel(event.status)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="week" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3>Week of October 13 - 19, 2025</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted cursor-pointer transition-colors"
                  >
                    <div className={`h-full w-1 rounded-full ${getStatusColor(event.status)}`} />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <p>{event.title}</p>
                        <Badge variant="secondary">{getStatusLabel(event.status)}</Badge>
                      </div>
                      <p className="text-muted-foreground">{event.date}</p>
                      <p className="text-muted-foreground">{event.time}</p>
                      <p className="text-muted-foreground">{event.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="day" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3>Monday, October 15, 2025</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.slice(0, 1).map((event) => (
                  <div
                    key={event.id}
                    className="p-6 border rounded-lg hover:bg-muted cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3>{event.title}</h3>
                        <Badge variant="secondary" className="mt-2">
                          {getStatusLabel(event.status)}
                        </Badge>
                      </div>
                      <div className={`h-3 w-3 rounded-full ${getStatusColor(event.status)}`} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground">Time: {event.time}</p>
                      <p className="text-muted-foreground">Location: {event.location}</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline">View Details</Button>
                      <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                        Manage Event
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
