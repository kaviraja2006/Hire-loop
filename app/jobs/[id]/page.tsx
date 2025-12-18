import { getSingleJob } from "@/actions/jobActions";
import JobDescription from "@/components/features/job/JobDescription";
import JobDetailsHeader from "@/components/features/job/JobDetailsHeader";
import Container from "@/components/ui/Container";

interface JobPageProps {
  params: Promise<{ id: string }>;
}

export default async function JobPage({ params }: JobPageProps) {
  const { id } = await params;
  const job = await getSingleJob(id);

  return (
    <Container>
      <JobDetailsHeader job={job} />
      <section className="px-4 py-12 lg:px-8">
        <div>
          <JobDescription job={job} />
        </div>
      </section>
    </Container>
  );
}
