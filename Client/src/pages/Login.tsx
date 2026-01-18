import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Box, Mail, Lock, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error || "Login failed");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="flex justify-center mb-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-foreground/10">
              <Box className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">
            AssetFlow
          </h1>
          <p className="text-lg text-primary-foreground/80">
            Enterprise Inventory & Asset Management System
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 text-primary-foreground/60">
            <div>
              <p className="text-3xl font-bold text-primary-foreground">500+</p>
              <p className="text-sm">Assets Tracked</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-foreground">5</p>
              <p className="text-sm">Locations</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-foreground">99%</p>
              <p className="text-sm">Accuracy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <div className="flex justify-center mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
                <Box className="h-7 w-7 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">AssetFlow</h1>
          </div>

          <div className="enterprise-card p-8">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Welcome back
            </h2>
            <p className="text-muted-foreground mb-6">
              Sign in to your account to continue
            </p>

            {error && (
              <div className="mb-6 flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center mb-3">
                Credentials
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                  <span className="text-muted-foreground">Admin:</span>
                  <span className="px-[22px] lg:px-0 font-mono text-foreground">
                    admin@matalogics.com / admin123
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                  <span className="text-muted-foreground">Manager:</span>
                  <span className="px-2 lg:px-0 font-mono text-foreground">
                    manager@matalogics.com / manager123
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                  <span className="text-muted-foreground">Viewer:</span>
                  <span className="px-5 lg:px-0 font-mono text-foreground">
                    viewer@matalogics.com / viewer123
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            © {new Date().getFullYear()} All rights reserved{" "}
            <a
              href="https://www.matalogics.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              MATalogics
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
