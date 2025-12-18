import * as z from "zod";

export const jobFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  jobType: z.enum(["Full-time", "Part-time", "Contract", "Internship"]),
  location: z.string().min(2, "Location is required"),
  experienceLevel: z.enum(["Entry Level", "Mid-Level", "Senior", "Manager"]),
  salary: z.string().optional(),
  description: z.string().min(50, "Description must be at least 50 characters"),
  applicationUrl: z.string().url("Must be a valid url"),
});

export type JobFormValues = z.infer<typeof jobFormSchema>;
