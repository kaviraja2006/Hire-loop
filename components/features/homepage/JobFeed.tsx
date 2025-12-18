import { Job } from "@/lib/schema";
import JobCard from "../job/JobCard";
import { getJobs } from "@/actions/jobActions";

export default async function JobFeed() {
  const jobs = await getJobs();

  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8 mb-16">
        <h2 className="text-2xl font-semibold">No Jobs Found</h2>
        <p>
          There are currently no job postings available. Please check back
          later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 mb-16">
      {jobs.map((job: Job) => (
        <JobCard job={job} key={job.id} />
      ))}
    </div>
  );
}
