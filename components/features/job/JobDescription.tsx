import { Card, CardContent } from "@/components/ui/card";
import { Job } from "@/lib/schema";

interface JobDescriptionProps {
  job: Job | null;
}

export default function JobDescription({ job }: JobDescriptionProps) {
  return (
    <Card>
      <CardContent>
        <h2 className="mb-4 text-3xl font-semibold">About the Role</h2>
        <p className="text-muted-foreground">{job?.description}</p>
      </CardContent>
    </Card>
  );
}
