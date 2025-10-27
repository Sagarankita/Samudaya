import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Users, AlertCircle } from "lucide-react";

interface LoginPageProps {
  onLogin: () => void;
  onAdminLoginClick: () => void;
}

export function LoginPage({ onLogin, onAdminLoginClick }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    
    // Mock successful login
    setError("");
    onLogin();
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
                  />
                </div>

                <div className="flex items-center justify-between">
                  <a href="#" className="text-orange-600 hover:underline">
                    Forgot password?
                  </a>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  Sign In
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <p className="text-muted-foreground text-center">
              Don't have an account?{" "}
              <a href="#" className="text-orange-600 hover:underline">
                Register here
              </a>
            </p>
            <div className="w-full border-t pt-3">
              <button
                onClick={onAdminLoginClick}
                className="text-slate-600 hover:text-slate-800 hover:underline w-full text-center"
              >
                Admin Login →
              </button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
