import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Job } from "@/lib/schema";
import { Briefcase, MapPin } from "lucide-react";
import Link from "next/link";
import JobActionBtns from "./JobActionBtns";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Card className="relative">
      <CardContent>
        <div className="flex gap-4 flex-col">
          <div>
            <Link href={`/jobs/${job.id}`}>
              <h3 className="font-semibold text-lg leading-tight">
                {job.title}
              </h3>
            </Link>

            <p className="text-sm text-muted-foreground mt-1">{job.company}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" />
              <span>{job.jobType}</span>
            </div>

            {job.salary && (
              <span className="text-foreground font-medium">{job.salary}</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Badge variant={"secondary"} className="font-normal">
              {job.experienceLevel}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {new Date(job.postedAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
        <JobActionBtns jobId={job.id} ownerId={job.userId} />
      </CardContent>
    </Card>
  );
}
