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
import { useEffect, useState } from "react";
import { adminAPI, usersAPI, forumAPI } from "../services/api";
import { Alert, AlertDescription } from "./ui/alert";

interface AdminPanelProps { user: any }

export function AdminPanel({ user }: AdminPanelProps) {
  const [pendingEvents, setPendingEvents] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [threads, setThreads] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ totalUsers: 0, activeEvents: 0, totalVolunteers: 0, forumPosts: 0 });
  const [error, setError] = useState("");

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const [s, pe, u, ft] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getPendingEvents(),
        usersAPI.getAll(),
        forumAPI.getThreads(),
      ]);
      setStats(s);
      setPendingEvents(pe);
      setUsersList(u);
      setThreads(ft);
    } catch (err: any) {
      setError(err.message || "Failed to load admin data");
    }
  };

  const analytics = [
    { label: "Total Users", value: String(stats.totalUsers || 0), change: "" },
    { label: "Active Events", value: String(stats.activeEvents || 0), change: "" },
    { label: "Total Volunteers", value: String(stats.totalVolunteers || 0), change: "" },
    { label: "Forum Posts", value: String(stats.forumPosts || 0), change: "" },
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
              {usersList.map((user) => (
                  <TableRow key={user._id}>
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
                      <Badge variant={user.role === "organizer" ? "default" : "secondary"} className={user.role === "organizer" ? "bg-blue-600" : ""}>{user.role}</Badge>
                      </TableCell>
                    <TableCell>{user.joinDate}</TableCell>
                    <TableCell>{user.eventsCreated}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={async () => {
                            try {
                              await usersAPI.promoteToOrganizer(user._id);
                              await loadAdminData();
                            } catch (err: any) {
                              setError(err.message || "Promote failed");
                            }
                          }}>
                            <UserCheck className="h-4 w-4 mr-1" />
                            Promote
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={async () => {
                            try {
                              await usersAPI.deactivate(user._id);
                              await loadAdminData();
                            } catch (err: any) {
                              setError(err.message || "Deactivate failed");
                            }
                          }}>
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
                    <TableRow key={event._id}>
                      <TableCell>{event.title}</TableCell>
                      <TableCell>{event.creator}</TableCell>
                      <TableCell>{event.date}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{event.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={async () => {
                            try {
                              await adminAPI.approveEvent(event._id);
                              await loadAdminData(); // Refresh all data including stats
                            } catch (err: any) {
                              setError(err.message || "Approve failed");
                            }
                          }}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button variant="destructive" size="sm" onClick={async () => {
                            try {
                              await adminAPI.rejectEvent(event._id);
                              await loadAdminData(); // Refresh all data
                            } catch (err: any) {
                              setError(err.message || "Reject failed");
                            }
                          }}>
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
                  {threads.map((thread) => (
                    <TableRow
                      key={thread._id || thread.id}
                      className={thread.flags > 0 ? "bg-red-50" : ""}
                    >
                      <TableCell>{thread.title}</TableCell>
                      <TableCell>{thread.author?.name || thread.author}</TableCell>
                      <TableCell>{thread.replies || 0}</TableCell>
                      <TableCell>
                        {thread.flags > 0 && (
                          <Badge variant="destructive">{thread.flags} flags</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={async () => {
                            try {
                              await forumAPI.pinThread(thread._id || thread.id);
                              const refreshed = await forumAPI.getThreads();
                              setThreads(refreshed);
                            } catch (err: any) {
                              setError(err.message || "Pin failed");
                            }
                          }}>
                            <Pin className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={async () => {
                            try {
                              await forumAPI.deleteThread(thread._id || thread.id);
                              const refreshed = await forumAPI.getThreads();
                              setThreads(refreshed);
                            } catch (err: any) {
                              setError(err.message || "Delete failed");
                            }
                          }}>
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
                {stats.popularEvents && stats.popularEvents.length > 0 ? (
                  <div className="space-y-3">
                    {stats.popularEvents.map((event: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded">
                        <span>{event.name}</span>
                        <Badge>{event.attendees} attendees</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No popular events data available yet.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3>User Activity</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded">
                    <span>New Users (30 days)</span>
                    <span>{stats.newUsers30Days || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded">
                    <span>Total Active Users</span>
                    <span>{stats.totalUsers || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded">
                    <span>Active Events</span>
                    <span>{stats.activeEvents || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      {error && (
        <div className="mt-4">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
