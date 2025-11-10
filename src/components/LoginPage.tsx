import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Users, AlertCircle } from "lucide-react";
import { authAPI } from "../services/api";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

interface LoginPageProps {
  onLogin: (user: any) => void;
  onAdminLoginClick: () => void;
}

export function LoginPage({ onLogin, onAdminLoginClick }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        onLogin(response.user);
      } else {
        setError("Invalid credentials");
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-full mb-4">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-orange-700">Samudaya Events</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Please sign in to continue
          </p>
        </div>

        <Card>
          <CardHeader>
            <h2>Sign In</h2>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-input-background"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-input-background"
                    disabled={loading}
                  />
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                  <p className="text-emerald-800 text-sm">
                    <strong>Demo User:</strong><br />
                    Email: rajesh@example.com<br />
                    Password: password123
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <div className="w-full border-t pt-3">
              <button
                onClick={onAdminLoginClick}
                className="text-slate-600 hover:text-slate-800 hover:underline w-full text-center"
              >
                Admin Login →
              </button>
            </div>
            <div className="w-full flex items-center justify-between text-sm">
              <Dialog open={showForgot} onOpenChange={setShowForgot}>
                <DialogTrigger asChild>
                  <button className="text-slate-600 hover:text-slate-800 hover:underline">
                    Forgot password?
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reset your password</DialogTitle>
                    <DialogDescription>
                      Enter your email and we will send a reset link.
                    </DialogDescription>
                  </DialogHeader>
                  {forgotError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{forgotError}</AlertDescription>
                    </Alert>
                  )}
                  {forgotMessage && (
                    <Alert>
                      <AlertDescription>{forgotMessage}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2 mt-2">
                    <Label htmlFor="forgot-email">Email</Label>
                    <Input
                      id="forgot-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="bg-input-background"
                      disabled={forgotLoading}
                    />
                  </div>
                  <Button
                    className="w-full bg-orange-600 hover:bg-orange-700 mt-4"
                    disabled={forgotLoading || !forgotEmail}
                    onClick={async () => {
                      setForgotError("");
                      setForgotMessage("");
                      try {
                        setForgotLoading(true);
                        await authAPI.forgotPassword(forgotEmail);
                        setForgotMessage("If an account exists, a reset link has been sent.");
                      } catch (err: any) {
                        setForgotError(err.message || "Request failed");
                      } finally {
                        setForgotLoading(false);
                      }
                    }}
                  >
                    {forgotLoading ? "Sending..." : "Send reset link"}
                  </Button>
                </DialogContent>
              </Dialog>

              <Dialog open={showRegister} onOpenChange={setShowRegister}>
                <DialogTrigger asChild>
                  <button className="text-slate-600 hover:text-slate-800 hover:underline">
                    Create account
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create a new account</DialogTitle>
                    <DialogDescription>
                      Join Samudaya Events to participate and organize.
                    </DialogDescription>
                  </DialogHeader>
                  {registerError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{registerError}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-4 mt-2">
                    <div className="space-y-2">
                      <Label htmlFor="reg-name">Full Name</Label>
                      <Input
                        id="reg-name"
                        placeholder="Your name"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        className="bg-input-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        className="bg-input-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <Input
                        id="reg-password"
                        type="password"
                        placeholder="Create a password"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="bg-input-background"
                      />
                    </div>
                  </div>
                  <Button
                    className="w-full bg-orange-600 hover:bg-orange-700 mt-2"
                    onClick={async () => {
                      setRegisterError("");
                      if (!registerName || !registerEmail || !registerPassword) {
                        setRegisterError("Please fill all fields");
                        return;
                      }
                      try {
                        setRegisterLoading(true);
                        const resp = await authAPI.register(registerName, registerEmail, registerPassword);
                        if (resp?.success) {
                          setShowRegister(false);
                          setEmail(registerEmail);
                          setPassword("");
                        } else {
                          setRegisterError(resp?.message || "Registration failed");
                        }
                      } catch (err: any) {
                        setRegisterError(err.message || "Registration failed");
                      } finally {
                        setRegisterLoading(false);
                      }
                    }}
                    disabled={registerLoading}
                  >
                    {registerLoading ? "Creating..." : "Create Account"}
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}