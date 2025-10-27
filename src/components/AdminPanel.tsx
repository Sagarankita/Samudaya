import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Users,
  Calendar,
  MessageSquare,
  Bell,
  BarChart3,
  CheckCircle,
  XCircle,
  UserCheck,
  Pin,
  Trash2,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

export function AdminPanel() {
  const pendingEvents = [
    {
      id: "1",
      title: "Photography Walk",
      creator: "Jane Smith",
      date: "Nov 5, 2025",
      category: "Education",
      status: "pending",
    },
    {
      id: "2",
      title: "Cooking Class",
      creator: "Tom Brown",
      date: "Nov 10, 2025",
      category: "Education",
      status: "pending",
    },
  ];

  const users = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "member",
      joinDate: "Mar 15, 2025",
      eventsCreated: 3,
      status: "active",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "organizer",
      joinDate: "Jan 10, 2025",
      eventsCreated: 12,
      status: "active",
    },
    {
      id: "3",
      name: "Mike Chen",
      email: "mike@example.com",
      role: "member",
      joinDate: "Apr 22, 2025",
      eventsCreated: 1,
      status: "active",
    },
  ];

  const forumThreads = [
    {
      id: "1",
      title: "Ideas for Winter Festival Activities",
      author: "Sarah Johnson",
      replies: 12,
      isPinned: false,
      flags: 0,
    },
    {
      id: "2",
      title: "Inappropriate Content Example",
      author: "Unknown User",
      replies: 2,
      isPinned: false,
      flags: 3,
    },
  ];

  const analytics = [
    { label: "Total Users", value: "1,247", change: "+12%" },
    { label: "Active Events", value: "32", change: "+5%" },
    { label: "Total Volunteers", value: "456", change: "+18%" },
    { label: "Forum Posts", value: "892", change: "+23%" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Admin Panel</h1>
          <p className="text-muted-foreground mt-1">
            Manage users, events, and community content
          </p>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analytics.map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">{stat.label}</p>
              <div className="flex items-end justify-between mt-2">
                <h2>{stat.value}</h2>
                <span className="text-emerald-600">{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="events">
            <Calendar className="h-4 w-4 mr-2" />
            Events
          </TabsTrigger>
          <TabsTrigger value="forum">
            <MessageSquare className="h-4 w-4 mr-2" />
            Forum
          </TabsTrigger>
          <TabsTrigger value="announcements">
            <Bell className="h-4 w-4 mr-2" />
            Announcements
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* User Management */}
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <h3>User Management</h3>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Events Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-emerald-600 text-white">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span>{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={user.role === "organizer" ? "default" : "secondary"}
                          className={user.role === "organizer" ? "bg-blue-600" : ""}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.joinDate}</TableCell>
                      <TableCell>{user.eventsCreated}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <UserCheck className="h-4 w-4 mr-1" />
                            Promote
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            Deactivate
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

        {/* Event Approval */}
        <TabsContent value="events" className="mt-6">
          <Card>
            <CardHeader>
              <h3>Pending Event Approvals</h3>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>{event.title}</TableCell>
                      <TableCell>{event.creator}</TableCell>
                      <TableCell>{event.date}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{event.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button variant="destructive" size="sm">
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
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

        {/* Forum Moderation */}
        <TabsContent value="forum" className="mt-6">
          <Card>
            <CardHeader>
              <h3>Forum Moderation</h3>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Thread</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Replies</TableHead>
                    <TableHead>Flags</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forumThreads.map((thread) => (
                    <TableRow
                      key={thread.id}
                      className={thread.flags > 0 ? "bg-red-50" : ""}
                    >
                      <TableCell>{thread.title}</TableCell>
                      <TableCell>{thread.author}</TableCell>
                      <TableCell>{thread.replies}</TableCell>
                      <TableCell>
                        {thread.flags > 0 && (
                          <Badge variant="destructive">{thread.flags} flags</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Pin className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
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

        {/* Announcements */}
        <TabsContent value="announcements" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3>Send Announcement</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      <Bell className="h-4 w-4 mr-2" />
                      New Announcement
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Announcement</DialogTitle>
                      <DialogDescription>
                        Send a message to all community members
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="ann-title">Title</Label>
                        <Input id="ann-title" className="bg-input-background" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ann-content">Content</Label>
                        <Textarea id="ann-content" rows={5} className="bg-input-background" />
                      </div>
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                        Send to All Users
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Create and manage announcements for the community
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h3>Most Popular Events</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Summer Music Festival", attendees: 145 },
                    { name: "Community Cleanup", attendees: 89 },
                    { name: "Art Workshop", attendees: 67 },
                  ].map((event, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded">
                      <span>{event.name}</span>
                      <Badge>{event.attendees} attendees</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3>User Activity</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { metric: "New Users (30 days)", value: 87 },
                    { metric: "Active Users", value: 543 },
                    { metric: "Average Session", value: "12 min" },
                  ].map((stat, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded">
                      <span>{stat.metric}</span>
                      <span>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
