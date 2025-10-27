import { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Calendar, Edit, Award, Upload } from "lucide-react";

export function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);

  const registeredEvents = [
    {
      id: "1",
      title: "Community Cleanup Day",
      date: "Oct 15, 2025",
      status: "upcoming",
    },
    {
      id: "2",
      title: "Summer Music Festival",
      date: "Oct 20, 2025",
      status: "upcoming",
    },
    {
      id: "3",
      title: "Art Workshop",
      date: "Oct 22, 2025",
      status: "upcoming",
    },
    {
      id: "4",
      title: "Spring Garden Planting",
      date: "Sep 10, 2025",
      status: "completed",
    },
    {
      id: "5",
      title: "Beach Cleanup",
      date: "Jul 15, 2025",
      status: "completed",
    },
  ];

  const volunteerHistory = [
    { id: "1", event: "Spring Garden Planting", date: "Sep 10, 2025", hours: 4 },
    { id: "2", event: "Summer Reading Program", date: "Aug 20, 2025", hours: 6 },
    { id: "3", event: "Beach Cleanup", date: "Jul 15, 2025", hours: 3 },
  ];

  const badges = [
    { id: "1", name: "Early Adopter", description: "Joined in the first month", icon: "🚀" },
    { id: "2", name: "Volunteer Hero", description: "10+ volunteer hours", icon: "⭐" },
    { id: "3", name: "Event Creator", description: "Created 5+ events", icon: "🎉" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>My Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and view your activity
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3>Profile</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarFallback className="bg-emerald-600 text-white">
                    JD
                  </AvatarFallback>
                </Avatar>
                {!isEditing ? (
                  <>
                    <h3>John Doe</h3>
                    <p className="text-muted-foreground mt-1">john.doe@example.com</p>
                    <p className="text-muted-foreground mt-3">
                      Active community member since March 2025
                    </p>
                  </>
                ) : (
                  <div className="w-full space-y-4 mt-4">
                    <Button variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" defaultValue="John Doe" className="bg-input-background" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue="john.doe@example.com"
                        className="bg-input-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself..."
                        rows={4}
                        className="bg-input-background"
                      />
                    </div>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>

              {!isEditing && (
                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member Since</span>
                    <span>Mar 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Events Attended</span>
                    <span>8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Volunteer Hours</span>
                    <span>28</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Badges */}
          <Card className="mt-6">
            <CardHeader>
              <h3>Achievements</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                  >
                    <div className="text-2xl">{badge.icon}</div>
                    <div>
                      <p>{badge.name}</p>
                      <p className="text-muted-foreground">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="events">
            <TabsList>
              <TabsTrigger value="events">Registered Events</TabsTrigger>
              <TabsTrigger value="volunteer">Volunteer History</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            </TabsList>

            <TabsContent value="events" className="mt-6">
              <Card>
                <CardHeader>
                  <h3>My Events</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {registeredEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-emerald-600" />
                          <div>
                            <p>{event.title}</p>
                            <p className="text-muted-foreground">{event.date}</p>
                          </div>
                        </div>
                        <Badge
                          variant={event.status === "upcoming" ? "default" : "secondary"}
                          className={event.status === "upcoming" ? "bg-emerald-600" : ""}
                        >
                          {event.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="volunteer" className="mt-6">
              <Card>
                <CardHeader>
                  <h3>Volunteer Activity</h3>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground">Total Volunteer Hours</p>
                        <h2 className="text-emerald-700">
                          {volunteerHistory.reduce((sum, v) => sum + v.hours, 0)} hours
                        </h2>
                      </div>
                      <Award className="h-10 w-10 text-emerald-600" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {volunteerHistory.map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <p>{record.event}</p>
                          <p className="text-muted-foreground">{record.date}</p>
                        </div>
                        <Badge variant="secondary">{record.hours} hrs</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calendar" className="mt-6">
              <Card>
                <CardHeader>
                  <h3>Calendar View</h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-center p-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 35 }, (_, i) => (
                      <div
                        key={i}
                        className="aspect-square border rounded p-2 hover:bg-muted cursor-pointer transition-colors"
                      >
                        <span className="text-muted-foreground">
                          {i < 31 ? i + 1 : ""}
                        </span>
                        {(i === 14 || i === 19 || i === 21) && (
                          <div className="mt-1 h-1 w-full bg-emerald-600 rounded" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Account Settings */}
          <Card className="mt-6">
            <CardHeader>
              <h3>Account Settings</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full">
                  Email Preferences
                </Button>
                <Button variant="outline" className="w-full text-destructive hover:text-destructive">
                  Deactivate Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
