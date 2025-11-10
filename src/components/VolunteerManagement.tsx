import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Heart, Download, UserCheck, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { volunteersAPI, eventsAPI } from "../services/api";
import { Alert, AlertDescription } from "./ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface VolunteerManagementProps { user: any }

export function VolunteerManagement({ user }: VolunteerManagementProps) {
  const [opps, setOpps] = useState<any[]>([]);
  const [myVolunteerHistory, setMyVolunteerHistory] = useState<any[]>([]);
  const [assignedVolunteers, setAssignedVolunteers] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [volunteerRole, setVolunteerRole] = useState("");
  const [volunteerHours, setVolunteerHours] = useState("");
  const [loadingVolunteers, setLoadingVolunteers] = useState(false);

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const loadData = async () => {
    try {
      const [events, history] = await Promise.all([
        eventsAPI.getAll(user?.id),
        user?.id ? volunteersAPI.getUserHistory(user.id) : Promise.resolve([]),
      ]);
      setOpps(events.filter((e: any) => e.status === 'published'));
      setMyVolunteerHistory(history);
    } catch (err: any) {
      setError(err.message || "Failed to load volunteer data");
    }
  };

  const loadManageVolunteers = async () => {
    if (!user?.id) return;
    setLoadingVolunteers(true);
    try {
      const myEvents = await eventsAPI.getUserEvents(user.id);
      const allVolunteers: any[] = [];
      for (const event of myEvents) {
        try {
          const eventVols = await volunteersAPI.getEventVolunteers(event._id);
          allVolunteers.push(...eventVols.map((v: any) => ({ ...v, eventTitle: event.title })));
        } catch (e) {
          // Ignore errors for individual events
        }
      }
      setAssignedVolunteers(allVolunteers);
    } catch (err: any) {
      setError(err.message || "Failed to load volunteers");
    } finally {
      setLoadingVolunteers(false);
    }
  };

  useEffect(() => {
    // Load volunteers when manage tab might be viewed
    if (user?.id) {
      loadManageVolunteers();
    }
  }, [user?.id]);

  const totalHours = myVolunteerHistory
    .filter((v) => v.status === "completed")
    .reduce((sum, v) => sum + v.hours, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Volunteer Management</h1>
          <p className="text-muted-foreground mt-1">
            Find opportunities and track your volunteer contributions
          </p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700 text-white">
          <Heart className="h-4 w-4 mr-2" />
          Find Opportunities
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-orange-600 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-muted-foreground">Total Hours</p>
                <h2>{totalHours} hrs</h2>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-3 rounded-lg">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-muted-foreground">Events Volunteered</p>
                <h2>
                  {myVolunteerHistory.filter((v) => v.status === "completed").length}
                </h2>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-600 p-3 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-muted-foreground">Upcoming</p>
                <h2>
                  {myVolunteerHistory.filter((v) => v.status === "upcoming").length}
                </h2>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="opportunities">
        <TabsList>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="my-volunteering">My Volunteering</TabsTrigger>
          <TabsTrigger value="manage">Manage Volunteers</TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="mt-6">
          <Card>
            <CardHeader>
              <h3>Volunteer Opportunities</h3>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-4">
                {opps.map((opp) => (
                  <div
                    key={opp._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4>{opp.title}</h4>
                          <p className="text-muted-foreground mt-1">Category: {opp.category}</p>
                          <p className="text-muted-foreground">{opp.date}</p>
                        </div>
                        <Badge variant="secondary" className={""}>
                          Capacity
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className="bg-emerald-600 h-2 rounded-full"
                            style={{ width: `${Math.min(100, (opp.registered / Math.max(1, opp.capacity)) * 100)}%` }}
                          />
                        </div>
                        <span className="text-muted-foreground">
                          {opp.registered}/{opp.capacity} registered
                        </span>
                      </div>
                    </div>
                    <Button
                      className="ml-4 bg-emerald-600 hover:bg-emerald-700"
                      disabled={!user?.id || opp.registered >= opp.capacity}
                      onClick={() => {
                        setSelectedEvent(opp);
                        setShowRegisterDialog(true);
                      }}
                    >
                      {opp.registered >= opp.capacity ? "Full" : "Register"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-volunteering" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3>My Volunteer History</h3>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Summary
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myVolunteerHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No volunteer history yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    myVolunteerHistory.map((history: any) => (
                      <TableRow key={history._id}>
                        <TableCell>{history.event || history.eventId}</TableCell>
                        <TableCell>{history.date || "N/A"}</TableCell>
                        <TableCell>{history.hours || 0} hrs</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{history.status || "upcoming"}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="mt-6">
          <Card>
            <CardHeader>
              <h3>Manage Volunteers</h3>
              <p className="text-muted-foreground text-sm mt-2">
                View volunteers for events you've created
              </p>
            </CardHeader>
            <CardContent>
              {loadingVolunteers ? (
                <p className="text-muted-foreground">Loading volunteers...</p>
              ) : assignedVolunteers.length === 0 ? (
                <p className="text-muted-foreground">No volunteers registered for your events yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Volunteer</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignedVolunteers.map((volunteer: any) => (
                      <TableRow key={volunteer._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-emerald-600 text-white">
                                {(volunteer.name || "U")
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{volunteer.name || "Unknown"}</span>
                          </div>
                        </TableCell>
                        <TableCell>{volunteer.eventTitle || "Unknown Event"}</TableCell>
                        <TableCell>{volunteer.role || "volunteer"}</TableCell>
                        <TableCell>{volunteer.hours || 0} hrs</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{volunteer.status || "upcoming"}</Badge>
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

      {/* Volunteer Registration Dialog */}
      <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register as Volunteer</DialogTitle>
            <DialogDescription>
              Fill in your volunteer details for {selectedEvent?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="volunteer-role">Role</Label>
              <Input
                id="volunteer-role"
                placeholder="e.g., Event Coordinator, Setup Helper"
                value={volunteerRole}
                onChange={(e) => setVolunteerRole(e.target.value)}
                className="bg-input-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="volunteer-hours">Estimated Hours</Label>
              <Input
                id="volunteer-hours"
                type="number"
                placeholder="Hours you plan to volunteer"
                value={volunteerHours}
                onChange={(e) => setVolunteerHours(e.target.value)}
                className="bg-input-background"
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={async () => {
                  if (!user?.id || !selectedEvent) return;
                  if (!volunteerRole.trim()) {
                    setError("Please enter a role");
                    return;
                  }
                  setError("");
                  try {
                    await volunteersAPI.register({
                      userId: user.id,
                      eventId: selectedEvent._id || selectedEvent.id,
                      role: volunteerRole,
                      hours: Number(volunteerHours) || 0,
                      status: "upcoming",
                    });
                    setShowRegisterDialog(false);
                    setVolunteerRole("");
                    setVolunteerHours("");
                    await loadData();
                  } catch (err: any) {
                    setError(err.message || "Registration failed");
                  }
                }}
              >
                Register
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowRegisterDialog(false);
                  setVolunteerRole("");
                  setVolunteerHours("");
                  setError("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
