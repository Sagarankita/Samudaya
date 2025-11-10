import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { authAPI } from "../services/api"; 
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Shield, AlertCircle, ArrowLeft } from "lucide-react";

interface AdminLoginPageProps {
  onLogin: (user: any) => void;
  onBackToUserLogin: () => void;
}

export function AdminLoginPage({
  onLogin,
  onBackToUserLogin,
}: AdminLoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    // Real backend login
    try {
      const response = await authAPI.login(email, password);
      if (response.success && response.user.role === "admin") {
        setError("");
        onLogin(response.user);
        return;
      } else {
        setError("Admin access required");
        return;
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
      return;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-700 rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-slate-700 text-2xl font-bold">Admin Portal</h1>
          <p className="text-muted-foreground mt-2">
            Restricted access for administrators only
          </p>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Admin Sign In</h2>
            <CardDescription>
              Enter your admin credentials to access the admin panel
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
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@samudaya.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-input-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-input-background"
                  />
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-amber-800 text-sm">
                    <strong>Demo Credentials:</strong>
                    <br />
                    Email: admin@samudaya.com
                    <br />
                    Password: admin123
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-slate-700 hover:bg-slate-800"
                >
                  Sign In as Admin
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="link"
              onClick={onBackToUserLogin}
              className="text-slate-600"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to User Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
