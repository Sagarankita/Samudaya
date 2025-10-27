import { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Calendar, MapPin, Users, Upload, Trash2, Edit } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export function EventCreation() {
  const [eventStatus, setEventStatus] = useState("draft");
  const [activeTab, setActiveTab] = useState("create");

  const myEvents = [
    {
      id: "1",
      title: "Youth Sports Day",
      date: "Oct 17, 2025",
      status: "published",
      registered: 67,
      capacity: 100,
    },
    {
      id: "2",
      title: "Community Garden Workshop",
      date: "Nov 5, 2025",
      status: "draft",
      registered: 0,
      capacity: 25,
    },
    {
      id: "3",
      title: "Holiday Food Drive",
      date: "Dec 15, 2025",
      status: "published",
      registered: 42,
      capacity: 50,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1>Event Management</h1>
        <p className="text-muted-foreground mt-1">
          Create and manage your community events
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="create">Create New Event</TabsTrigger>
          <TabsTrigger value="manage">My Events</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-6">
          <Card>
            <CardHeader>
              <h3>Create New Event</h3>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="event-name">Event Name *</Label>
                    <Input
                      id="event-name"
                      placeholder="Enter event name"
                      className="bg-input-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select>
                      <SelectTrigger id="category" className="bg-input-background">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="volunteer">Volunteer</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      className="bg-input-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      className="bg-input-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      placeholder="Enter location"
                      className="bg-input-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity *</Label>
                    <Input
                      id="capacity"
                      type="number"
                      placeholder="Max attendees"
                      className="bg-input-background"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your event..."
                    rows={5}
                    className="bg-input-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    placeholder="community, outdoor, family-friendly"
                    className="bg-input-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Event Image</Label>
                  <div className="flex items-center gap-4">
                    <Button type="button" variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                    <span className="text-muted-foreground">No file chosen</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <Label htmlFor="status-toggle">Event Status</Label>
                    <p className="text-muted-foreground">
                      {eventStatus === "draft" ? "Save as draft" : "Publish event"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">Draft</span>
                    <Switch
                      id="status-toggle"
                      checked={eventStatus === "published"}
                      onCheckedChange={(checked) =>
                        setEventStatus(checked ? "published" : "draft")
                      }
                    />
                    <span>Published</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                    {eventStatus === "draft" ? "Save Draft" : "Publish Event"}
                  </Button>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="mt-6">
          <Card>
            <CardHeader>
              <h3>My Events</h3>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>{event.title}</TableCell>
                      <TableCell>{event.date}</TableCell>
                      <TableCell>
                        <Badge
                          variant={event.status === "published" ? "default" : "secondary"}
                          className={event.status === "published" ? "bg-emerald-600" : ""}
                        >
                          {event.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {event.registered}/{event.capacity}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
