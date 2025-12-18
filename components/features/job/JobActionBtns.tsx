"use client";

import { deleteJob } from "@/actions/jobActions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@clerk/nextjs";
import { Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function JobActionBtns({
  jobId,
  ownerId,
}: {
  jobId: string;
  ownerId: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { isSignedIn, userId } = useAuth();
  const [open, setOpen] = useState(false);

  if (!isSignedIn || userId !== ownerId) {
    return null;
  }

  async function onDelete() {
    try {
      setIsDeleting(true);
      const response = await deleteJob(jobId);

      if (response.success) {
        toast.success("Job deleted successfully.");
        setOpen(false);
      } else {
        toast.error(response.error || "Failed to delete job.");
      }
    } catch (error) {
      console.log("Delete failed: ", error);
      toast.error("Unexpected error. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="absolute z-10 right-2 top-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="cursor-pointer" size={"icon"}>
            <Trash className="w-5 h-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete this
              job posting.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              disabled={isDeleting}
              variant={"destructive"}
              onClick={onDelete}
            >
              {isDeleting ? "Deleting..." : "Yes, Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
