"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setUsers(data.data.users || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Container>
        <div className="py-12">
          <p>Loading users...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="mt-2 text-gray-600">
            Browse all registered users in the system
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <Link
              key={user.id}
              href={`/users/${user.id}`}
              className="block rounded-lg border border-gray-200 bg-white p-6 shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{user.name || "Anonymous"}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                  {user.role}
                </span>
              </div>
              <p className="mt-4 text-xs text-gray-500">
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>
    </Container>
  );
}
