import { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Bell, Plus, AlertTriangle, Info, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

export function Announcements() {
  const [filterType, setFilterType] = useState("all");

  const announcements = [
    {
      id: "1",
      title: "New Online Registration Portal Launched",
      content:
        "We've launched our new online registration system to make it easier for you to sign up for community events. New features include waiting lists, recurring events, and mobile notifications.",
      type: "Info",
      author: "Admin Team",
      date: "Oct 5, 2025",
      expiresOn: "Nov 5, 2025",
    },
    {
      id: "2",
      title: "Weather Alert: Cleanup Drive Postponed",
      content:
        "Due to heavy monsoon rains, the Swachh Bharat Cleanup Drive scheduled for Oct 10 has been postponed to Oct 15. All registered participants will be notified via SMS and email.",
      type: "Emergency",
      author: "Priya Sharma, Event Coordinator",
      date: "Oct 8, 2025",
      expiresOn: "Oct 16, 2025",
    },
    {
      id: "3",
      title: "Volunteer Appreciation Day Celebration",
      content:
        "Join us on November 1st for our annual Volunteer Appreciation Day! Celebrating our amazing volunteers with traditional Indian food, cultural performances, and awards ceremony.",
      type: "Event Update",
      author: "Amit Patel, Community Manager",
      date: "Oct 3, 2025",
      expiresOn: "Nov 2, 2025",
    },
    {
      id: "4",
      title: "Community Survey: Your Voice Matters",
      content:
        "Please take 5 minutes to complete our community survey to help us plan better events for 2026. All participants are eligible for prizes!",
      type: "Info",
      author: "Admin Team",
      date: "Oct 1, 2025",
      expiresOn: "Oct 31, 2025",
    },
    {
      id: "5",
      title: "Community Center New Timings",
      content:
        "Starting October 15, the Community Center will be open from 7 AM to 9 PM on weekdays with extended hours for Diwali preparations. Weekend hours remain unchanged.",
      type: "Event Update",
      author: "Vikram Singh, Facility Manager",
      date: "Sep 28, 2025",
      expiresOn: "Oct 20, 2025",
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Emergency":
        return "bg-red-500";
      case "Event Update":
        return "bg-blue-500";
      case "Info":
        return "bg-emerald-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Emergency":
        return <AlertTriangle className="h-5 w-5" />;
      case "Event Update":
        return <Calendar className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Announcements</h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with community news and alerts
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Announcement</DialogTitle>
              <DialogDescription>
                Share important updates with the community
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="ann-title">Title *</Label>
                <Input id="ann-title" placeholder="Announcement title" className="bg-input-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ann-type">Type *</Label>
                <Select>
                  <SelectTrigger id="ann-type" className="bg-input-background">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="event-update">Event Update</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ann-content">Content *</Label>
                <Textarea
                  id="ann-content"
                  placeholder="Write your announcement..."
                  rows={5}
                  className="bg-input-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ann-expires">Expires On</Label>
                <Input id="ann-expires" type="date" className="bg-input-background" />
              </div>
              <div className="flex gap-2">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Publish
                </Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Label>Filter by type:</Label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="event-update">Event Update</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card
            key={announcement.id}
            className={
              announcement.type === "Emergency"
                ? "border-red-500 border-2"
                : ""
            }
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`${getTypeColor(announcement.type)} p-2 rounded-lg text-white`}>
                    {getTypeIcon(announcement.type)}
                  </div>
                  <div>
                    <h3>{announcement.title}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge
                        variant="secondary"
                        className={`${getTypeColor(announcement.type)} text-white`}
                      >
                        {announcement.type}
                      </Badge>
                      <span className="text-muted-foreground">
                        by {announcement.author}
                      </span>
                      <span className="text-muted-foreground">
                        {announcement.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-3">{announcement.content}</p>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Expires: {announcement.expiresOn}</span>
                <Button variant="link" className="text-emerald-600">
                  Read More
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
