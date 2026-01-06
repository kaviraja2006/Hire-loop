"use client";

import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";
      const body = isSignup
        ? {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }
        : { email: formData.email, password: formData.password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);

        if (!isSignup && data.token) {
          // Store token in localStorage
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          // Redirect to dashboard
          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);
        } else if (isSignup) {
          // Switch to login after successful signup
          toast.info("Please login with your credentials");
          setIsSignup(false);
          setFormData({ ...formData, password: "" });
        }
      } else {
        toast.error(data.message || "Authentication failed");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="my-16 flex justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-lg border shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold">
            {isSignup ? "Create Account" : "Sign In"}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {isSignup
              ? "Sign up to get started"
              : "Welcome back! Please login to your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignup && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required={isSignup}
                disabled={isLoading}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              disabled={isLoading}
              minLength={6}
            />
            {isSignup && (
              <p className="text-xs text-muted-foreground">
                Password must be at least 6 characters
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? "Processing..."
              : isSignup
                ? "Create Account"
                : "Sign In"}
          </Button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setFormData({ name: "", email: "", password: "" });
            }}
            className="text-sm text-primary hover:underline"
            disabled={isLoading}
          >
            {isSignup
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign up"}
          </button>
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-center text-muted-foreground">
            🔒 Secured with JWT authentication and bcrypt password hashing
          </p>
        </div>
      </div>
    </Container>
  );
}
