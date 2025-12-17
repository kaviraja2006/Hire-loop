// app/dashboard/page.jsx
export const dynamic = 'force-dynamic'; // Always render on request

export default async function Dashboard() {
  // Simulate live data with current time
  const data = { time: new Date().toLocaleTimeString(), usersOnline: Math.floor(Math.random() * 100) };

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Live Recruiter Dashboard</h1>
      <p className="mb-2 text-gray-700">Current Server Time: {data.time}</p>
      <p className="text-gray-700">Active Users: {data.usersOnline}</p>
    </main>
  );
}
