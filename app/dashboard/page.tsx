import { auth } from "@clerk/nextjs/server";
import UserJobList from "@/components/features/dashboard/UserJobList";
import Container from "@/components/ui/Container";

// Force dynamic rendering - Server-Side Rendering on every request
export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const { userId } = await auth();

  // This data is fetched fresh on EVERY request (SSR)
  const currentTime = new Date().toLocaleString();

  // Placeholder stats - will be populated when DB is connected
  const userStats = {
    totalJobs: 0,
    activeJobs: 0,
    views: 0,
  };

  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>

      {/* Real-time stats - regenerated on every request */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Total Jobs Posted</p>
          <p className="text-2xl font-bold">{userStats.totalJobs}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600">Active Jobs</p>
          <p className="text-2xl font-bold">{userStats.activeJobs}</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-gray-600">Total Views</p>
          <p className="text-2xl font-bold">{userStats.views}</p>
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-500">
        Last updated: {currentTime} (Server-Side Rendered)
      </div>

      <UserJobList />
    </Container>
  );
}
