import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Job } from "@/lib/schema";
import { Briefcase, ExternalLink, MapPin } from "lucide-react";
import Link from "next/link";

interface JobDetailsHeaderProps {
  job: Job | null;
}

export default function JobDetailsHeader({ job }: JobDetailsHeaderProps) {
  return (
    <div className="border-b bg-muted/30 py-12">
      <div className="flex justify-between">
        <div className="space-y-4">
          <div>
            <h1 className="mb-2 text-4xl lg:text-5xl font-bold">
              {job?.title}
            </h1>
            <p className="text-xl text-muted-foreground">{job?.company}</p>
          </div>

          <div className="text-muted-foreground flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>{job?.location}</span>
            </div>

            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              <span>{job?.jobType}</span>
            </div>

            {job?.salary && (
              <span className="font-semibold text-foreground">
                {job.salary}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={"secondary"}>{job?.experienceLevel}</Badge>
            <span className="text-sm text-muted-foreground">
              {job &&
                new Date(job.postedAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
            </span>
          </div>
        </div>

        <div>
          <Button asChild>
            <Link href={job?.applicationUrl || ""}>
              Apply Now
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
