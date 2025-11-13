import { useState, useEffect } from "react";
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
import { eventsAPI } from "../services/api";
import { Alert, AlertDescription } from "./ui/alert";

interface EventCreationProps {
  user: any;
}

export function EventCreation({ user }: EventCreationProps) {
  const [eventStatus, setEventStatus] = useState("draft");
  const [activeTab, setActiveTab] = useState("create");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "manage" && user?.id) {
      loadMyEvents();
    }
  }, [activeTab, user?.id]);

  const loadMyEvents = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const events = await eventsAPI.getUserEvents(user.id);
      setMyEvents(events.map((e: any) => ({
        id: e._id,
        title: e.title,
        date: e.date,
        status: e.status,
        registered: e.registered || 0,
        capacity: e.capacity,
      })));
    } catch (err: any) {
      setError(err.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    setTitle(event.title);
    setCategory(event.category || "");
    setDate(event.date);
    setTime(event.time);
    setLocation(event.location);
    setCapacity(String(event.capacity));
    setDescription(event.description);
    setTags(event.tags?.join(", ") || "");
    setEventStatus(event.status);
    setActiveTab("create");
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await eventsAPI.delete(eventId);
      await loadMyEvents();
      setMessage("Event deleted successfully");
    } catch (err: any) {
      setError(err.message || "Failed to delete event");
    }
  };

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
              <h3>{editingEvent ? "Edit Event" : "Create New Event"}</h3>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-6"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!user?.id) {
                    setError("Please sign in to create events");
                    return;
                  }
                  setError("");
                  setMessage("");
                  setSubmitting(true);
                  try {
                    if (editingEvent) {
                      // Update existing event
                      await eventsAPI.update(editingEvent.id, {
                        title,
                        description,
                        date,
                        time,
                        location,
                        category,
                        capacity: Number(capacity),
                        imageUrl,
                        status: eventStatus,
                        tags: tags
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean),
                      });
                      setMessage("Event updated successfully");
                    } else {
                      // Create new event
                      await eventsAPI.create({
                        title,
                        description,
                        date,
                        time,
                        location,
                        category,
                        capacity: Number(capacity),
                        imageUrl,
                        creator: user.id,
                        status: eventStatus,
                        tags: tags
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean),
                      });
                      setMessage("Event saved successfully");
                    }
                    setTitle("");
                    setCategory("");
                    setDate("");
                    setTime("");
                    setLocation("");
                    setCapacity("");
                    setDescription("");
                    setTags("");
                    setImageUrl("");
                    setEditingEvent(null);
                    setEventStatus("draft");
                    if (editingEvent) {
                      await loadMyEvents();
                    }
                  } catch (err: any) {
                    setError(err.message || "Failed to save event");
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {message && (
                  <Alert>
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="event-name">Event Name *</Label>
                    <Input
                      id="event-name"
                      placeholder="Enter event name"
                      className="bg-input-background"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={category} onValueChange={setCategory}>
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
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      className="bg-input-background"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      placeholder="Enter location"
                      className="bg-input-background"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity *</Label>
                    <Input
                      id="capacity"
                      type="number"
                      placeholder="Max attendees"
                      className="bg-input-background"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    placeholder="community, outdoor, family-friendly"
                    className="bg-input-background"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Event Image</Label>
                  <div className="flex items-center gap-4">
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                          const result = reader.result as string;
                          setImageUrl(result);
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                    <Button type="button" variant="outline" onClick={() => {
                      (document.getElementById("image") as HTMLInputElement)?.click();
                    }}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                    <span className="text-muted-foreground">
                      {imageUrl ? "Image selected" : "No file chosen"}
                    </span>
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
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={submitting}>
                    {submitting ? "Saving..." : eventStatus === "draft" ? "Save Draft" : "Publish Event"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setTitle("");
                    setCategory("");
                    setDate("");
                    setTime("");
                    setLocation("");
                    setCapacity("");
                    setDescription("");
                    setTags("");
                    setEventStatus("draft");
                    setMessage("");
                    setError("");
                    setEditingEvent(null);
                  }}>
                    {editingEvent ? "Cancel Edit" : "Cancel"}
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
              {loading ? (
                <p className="text-muted-foreground">Loading your events...</p>
              ) : myEvents.length === 0 ? (
                <p className="text-muted-foreground">You haven't created any events yet.</p>
              ) : (
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
                            <Button variant="ghost" size="icon" onClick={() => {
                              eventsAPI.getById(event.id).then((e: any) => {
                                handleEdit({ ...event, ...e });
                              });
                            }}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(event.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
