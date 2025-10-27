import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Heart, Download, UserCheck, Clock } from "lucide-react";

export function VolunteerManagement() {
  const volunteerOpportunities = [
    {
      id: "1",
      event: "Swachh Bharat Cleanup Drive",
      date: "Oct 15, 2025",
      role: "Cleanup Crew",
      needed: 10,
      filled: 7,
      status: "open",
    },
    {
      id: "2",
      event: "Diwali Mela & Cultural Night",
      date: "Oct 20, 2025",
      role: "Event Setup Team",
      needed: 8,
      filled: 8,
      status: "filled",
    },
    {
      id: "3",
      event: "Food Distribution Drive",
      date: "Oct 25, 2025",
      role: "Food Distribution",
      needed: 12,
      filled: 5,
      status: "open",
    },
    {
      id: "4",
      event: "Traditional Art Workshop",
      date: "Oct 22, 2025",
      role: "Assistant Instructor",
      needed: 3,
      filled: 2,
      status: "open",
    },
  ];

  const myVolunteerHistory = [
    {
      id: "1",
      event: "Tree Planting Drive",
      date: "Sep 10, 2025",
      hours: 4,
      status: "completed",
    },
    {
      id: "2",
      event: "Summer Reading Program",
      date: "Aug 20, 2025",
      hours: 6,
      status: "completed",
    },
    {
      id: "3",
      event: "Beach Cleanup at Juhu",
      date: "Jul 15, 2025",
      hours: 3,
      status: "completed",
    },
    {
      id: "4",
      event: "Swachh Bharat Cleanup Drive",
      date: "Oct 15, 2025",
      hours: 4,
      status: "upcoming",
    },
    {
      id: "5",
      event: "Food Distribution Drive",
      date: "Oct 25, 2025",
      hours: 5,
      status: "upcoming",
    },
  ];

  const assignedVolunteers = [
    { id: "1", name: "Priya Sharma", role: "Cleanup Crew", hours: 4 },
    { id: "2", name: "Amit Patel", role: "Setup Team", hours: 3 },
    { id: "3", name: "Sneha Reddy", role: "Registration", hours: 5 },
    { id: "4", name: "Vikram Singh", role: "Cleanup Crew", hours: 4 },
  ];

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
              <div className="space-y-4">
                {volunteerOpportunities.map((opp) => (
                  <div
                    key={opp.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4>{opp.event}</h4>
                          <p className="text-muted-foreground mt-1">Role: {opp.role}</p>
                          <p className="text-muted-foreground">{opp.date}</p>
                        </div>
                        <Badge
                          variant={opp.status === "open" ? "default" : "secondary"}
                          className={opp.status === "open" ? "bg-emerald-600" : ""}
                        >
                          {opp.status === "open" ? "Open" : "Filled"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className="bg-emerald-600 h-2 rounded-full"
                            style={{ width: `${(opp.filled / opp.needed) * 100}%` }}
                          />
                        </div>
                        <span className="text-muted-foreground">
                          {opp.filled}/{opp.needed} volunteers
                        </span>
                      </div>
                    </div>
                    <Button
                      className="ml-4 bg-emerald-600 hover:bg-emerald-700"
                      disabled={opp.status === "filled"}
                    >
                      {opp.status === "open" ? "Register" : "Full"}
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
                  {myVolunteerHistory.map((history) => (
                    <TableRow key={history.id}>
                      <TableCell>{history.event}</TableCell>
                      <TableCell>{history.date}</TableCell>
                      <TableCell>{history.hours} hrs</TableCell>
                      <TableCell>
                        <Badge
                          variant={history.status === "completed" ? "default" : "secondary"}
                          className={
                            history.status === "completed" ? "bg-emerald-600" : "bg-blue-500"
                          }
                        >
                          {history.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="mt-6">
          <Card>
            <CardHeader>
              <h3>Assigned Volunteers</h3>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Volunteer</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignedVolunteers.map((volunteer) => (
                    <TableRow key={volunteer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-emerald-600 text-white">
                              {volunteer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span>{volunteer.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{volunteer.role}</TableCell>
                      <TableCell>{volunteer.hours} hrs</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
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
