import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Bell, Plus, AlertTriangle, Info, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { announcementsAPI } from "../services/api";
import { Alert, AlertDescription } from "./ui/alert";

interface AnnouncementsProps {
  user: any;
}

export function Announcements({ user }: AnnouncementsProps) {
  const [filterType, setFilterType] = useState("all");
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [content, setContent] = useState("");
  const [expiresOn, setExpiresOn] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await announcementsAPI.getAll();
        if (!mounted) return;
        setAnnouncements(data);
      } catch (err: any) {
        setError(err.message || "Failed to load announcements");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

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
                <Input id="ann-title" placeholder="Announcement title" className="bg-input-background" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ann-type">Type *</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="ann-type" className="bg-input-background">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Info">Info</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                    <SelectItem value="Event Update">Event Update</SelectItem>
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
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ann-expires">Expires On</Label>
                <Input id="ann-expires" type="date" className="bg-input-background" value={expiresOn} onChange={(e) => setExpiresOn(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={async () => {
                    try {
                      setError("");
                      await announcementsAPI.create({
                        title,
                        content,
                        type,
                        author: user?.name || "Admin",
                        expiresOn,
                      });
                      const data = await announcementsAPI.getAll();
                      setAnnouncements(data);
                      setTitle("");
                      setType("");
                      setContent("");
                      setExpiresOn("");
                    } catch (err: any) {
                      setError(err.message || "Failed to publish");
                    }
                  }}
                >
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
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {loading && <p className="text-muted-foreground">Loading announcements...</p>}
          <div className="flex items-center gap-4">
            <Label>Filter by type:</Label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Info">Info</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
                <SelectItem value="Event Update">Event Update</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements
          .filter((a) => (filterType === "all" ? true : a.type === filterType))
          .map((announcement) => (
          <Card
            key={announcement._id || announcement.id}
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
