// app/jobs/page.jsx
export const revalidate = 60; // Regenerate every 60 seconds

export default async function Jobs() {
  // Simulate API fetch
  const jobs = [
    { id: 1, title: 'Frontend Developer', company: 'TechNova' },
    { id: 2, title: 'Backend Engineer', company: 'CodeWorks' },
    { id: 3, title: 'UI/UX Designer', company: 'Designify' },
  ];

  const generatedAt = new Date().toLocaleTimeString();

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Available Jobs</h1>
      <p className="text-sm text-gray-500 mb-4">
        (Page generated at: {generatedAt}, regenerates every 60s)
      </p>
      <ul className="space-y-2">
        {jobs.map((job) => (
          <li key={job.id} className="border p-3 rounded-md shadow-sm">
            <strong>{job.title}</strong> — {job.company}
          </li>
        ))}
      </ul>
    </main>
  );
}
