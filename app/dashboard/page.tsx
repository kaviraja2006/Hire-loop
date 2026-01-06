"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = Cookies.get("auth-token");

    if (!token) {
      router.push("/login");
      return;
    }

    // Decode token to get user info (in real app, verify on server)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({ name: payload.name, email: payload.email });
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    Cookies.remove("auth-token");
    router.push("/login");
  };

  if (loading) {
    return (
      <Container>
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
          <p>Loading...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome back, {user?.name || "User"}!
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Stats Cards */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500">
              Total Applications
            </h3>
            <p className="mt-2 text-3xl font-bold">24</p>
            <p className="mt-1 text-sm text-green-600">+12% from last month</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500">Active Jobs</h3>
            <p className="mt-2 text-3xl font-bold">8</p>
            <p className="mt-1 text-sm text-blue-600">2 closing soon</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500">Messages</h3>
            <p className="mt-2 text-3xl font-bold">5</p>
            <p className="mt-1 text-sm text-orange-600">3 unread</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <div className="mt-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-0"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <span className="text-blue-600">📝</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">New application received</p>
                  <p className="text-sm text-gray-500">
                    Software Engineer position
                  </p>
                </div>
                <span className="text-sm text-gray-400">{i}h ago</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
