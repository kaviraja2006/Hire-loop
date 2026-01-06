"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Container from "@/components/ui/Container";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
  _count?: {
    postedJobs: number;
    applications: number;
  };
}

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    fetch(`/api/users?id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.users?.[0]) {
          setUser(data.data.users[0]);
        } else {
          setError("User not found");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load user");
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
      <Container>
        <div className="py-12">
          <p>Loading...</p>
        </div>
      </Container>
    );
  }

  if (error || !user) {
    return (
      <Container>
        <div className="py-12">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <h2 className="text-xl font-semibold text-red-800">
              User Not Found
            </h2>
            <p className="mt-2 text-red-600">
              {error || "This user does not exist."}
            </p>
            <Link
              href="/users"
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              ← Back to Users
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-12">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          {" / "}
          <Link href="/users" className="hover:text-blue-600">
            Users
          </Link>
          {" / "}
          <span className="text-gray-900">{user.name || user.email}</span>
        </nav>

        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                {user.name || "Anonymous User"}
              </h1>
              <p className="mt-2 text-gray-600">{user.email}</p>
            </div>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
              {user.role}
            </span>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-600">User ID</p>
              <p className="mt-1 font-mono text-sm">{user.id}</p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-600">Joined</p>
              <p className="mt-1 font-medium">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-600">Role</p>
              <p className="mt-1 font-medium capitalize">
                {user.role.toLowerCase()}
              </p>
            </div>
          </div>

          {user._count && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold">Activity</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="text-sm text-gray-600">Posted Jobs</p>
                  <p className="mt-2 text-2xl font-bold">
                    {user._count.postedJobs}
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="text-sm text-gray-600">Applications</p>
                  <p className="mt-2 text-2xl font-bold">
                    {user._count.applications}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8">
            <Link href="/users" className="text-blue-600 hover:underline">
              ← Back to all users
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
