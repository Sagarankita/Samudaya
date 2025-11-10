import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Calendar, Edit, Award, Upload } from "lucide-react";
import { usersAPI, volunteersAPI, eventsAPI } from "../services/api";
import { Alert, AlertDescription } from "./ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Switch } from "./ui/switch";

interface UserProfileProps { user: any }

export function UserProfile({ user }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<any | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
  const [volunteerHistory, setVolunteerHistory] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editBio, setEditBio] = useState("");
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showEmailPrefsDialog, setShowEmailPrefsDialog] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  const loadProfile = async () => {
    try {
      if (user?.id) {
        const [u, vols] = await Promise.all([
          usersAPI.getById(user.id),
          volunteersAPI.getUserHistory(user.id),
        ]);
        setProfile(u);
        setEditName(u.name || "");
        setEditEmail(u.email || "");
        setEditBio(u.bio || "");
        setEmailNotifications(u.emailPreferences?.notifications !== false);
        setVolunteerHistory(vols);
        
        // Load registered events
        const allEvents = await eventsAPI.getAll(user.id);
        setRegisteredEvents(allEvents.filter((e: any) => e.isRegistered));
      }
    } catch (err: any) {
      setError(err.message || "Failed to load profile");
    }
  };

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
                    <h3>{profile?.name || user?.name || "User"}</h3>
                    <p className="text-muted-foreground mt-1">{profile?.email || user?.email}</p>
                    <p className="text-muted-foreground mt-3">
                      Active community member
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
                      <Input 
                        id="name" 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-input-background" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="bg-input-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself..."
                        rows={4}
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        className="bg-input-background"
                      />
                    </div>
                    <Button 
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      onClick={async () => {
                        try {
                          await usersAPI.update(user.id, {
                            name: editName,
                            email: editEmail,
                            bio: editBio,
                          });
                          setMessage("Profile updated successfully");
                          setIsEditing(false);
                          await loadProfile();
                        } catch (err: any) {
                          setError(err.message || "Failed to update profile");
                        }
                      }}
                    >
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setIsEditing(false);
                        setEditName(profile?.name || "");
                        setEditEmail(profile?.email || "");
                        setEditBio(profile?.bio || "");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-4">
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </div>
              )}
              {message && (
                <div className="mt-4">
                  <Alert>
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                </div>
              )}

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
                    {registeredEvents.map((event: any) => (
                      <div
                        key={event._id || event.id}
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
                          variant={"secondary"}
                          className={""}
                        >
                          registered: {event.registered}
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
                <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>Enter your current password and new password</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="old-password">Current Password</Label>
                        <Input
                          id="old-password"
                          type="password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="bg-input-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="bg-input-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="bg-input-background"
                        />
                      </div>
                      {error && (
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                      <Button
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        onClick={async () => {
                          if (newPassword !== confirmPassword) {
                            setError("Passwords do not match");
                            return;
                          }
                          if (newPassword.length < 6) {
                            setError("Password must be at least 6 characters");
                            return;
                          }
                          try {
                            await usersAPI.update(user.id, { password: newPassword });
                            setMessage("Password changed successfully");
                            setShowPasswordDialog(false);
                            setOldPassword("");
                            setNewPassword("");
                            setConfirmPassword("");
                            setError("");
                          } catch (err: any) {
                            setError(err.message || "Failed to change password");
                          }
                        }}
                      >
                        Change Password
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={showEmailPrefsDialog} onOpenChange={setShowEmailPrefsDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      Email Preferences
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Email Preferences</DialogTitle>
                      <DialogDescription>Manage your email notification settings</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive email updates about events and announcements</p>
                        </div>
                        <Switch
                          checked={emailNotifications}
                          onCheckedChange={setEmailNotifications}
                        />
                      </div>
                      <Button
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        onClick={async () => {
                          try {
                            await usersAPI.update(user.id, {
                              emailPreferences: { notifications: emailNotifications },
                            });
                            setMessage("Email preferences updated successfully");
                            setShowEmailPrefsDialog(false);
                          } catch (err: any) {
                            setError(err.message || "Failed to update preferences");
                          }
                        }}
                      >
                        Save Preferences
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full text-destructive hover:text-destructive">
                      Deactivate Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Deactivate Account</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to deactivate your account? This action can be reversed later.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <Alert variant="destructive">
                        <AlertDescription>
                          Deactivating your account will hide your profile and prevent you from accessing the platform.
                        </AlertDescription>
                      </Alert>
                      <div className="flex gap-2">
                        <Button
                          variant="destructive"
                          className="flex-1"
                          onClick={async () => {
                            try {
                              await usersAPI.update(user.id, { status: "inactive" });
                              setMessage("Account deactivated successfully");
                              setShowDeactivateDialog(false);
                            } catch (err: any) {
                              setError(err.message || "Failed to deactivate account");
                            }
                          }}
                        >
                          Deactivate Account
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowDeactivateDialog(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
