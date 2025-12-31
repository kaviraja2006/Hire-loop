import { z } from "zod";

// Enums matching Prisma schema
export const RoleEnum = z.enum(["CANDIDATE", "RECRUITER"]);
export const JobTypeEnum = z.enum([
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
]);
export const ExperienceLevelEnum = z.enum([
  "ENTRY_LEVEL",
  "MID_LEVEL",
  "SENIOR",
  "MANAGER",
]);
export const ApplicationStatusEnum = z.enum([
  "PENDING",
  "REVIEWED",
  "INTERVIEWING",
  "REJECTED",
  "OFFERED",
]);

// User schemas
export const UserCreateSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().min(1, "Name is required").optional(),
  role: RoleEnum.default("CANDIDATE"),
});

export const UserUpdateSchema = z
  .object({
    email: z.string().email("Invalid email format").optional(),
    name: z.string().min(1, "Name cannot be empty").optional(),
    role: RoleEnum.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

// Job schemas
export const JobCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().min(1, "Location is required"),
  jobType: JobTypeEnum,
  experienceLevel: ExperienceLevelEnum,
  salary: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  applicationUrl: z.string().url("Invalid URL format").optional(),
  recruiterId: z.string().uuid("Invalid recruiter ID"),
});

export const JobUpdateSchema = z
  .object({
    title: z.string().min(1, "Title cannot be empty").optional(),
    company: z.string().min(1, "Company cannot be empty").optional(),
    location: z.string().min(1, "Location cannot be empty").optional(),
    jobType: JobTypeEnum.optional(),
    experienceLevel: ExperienceLevelEnum.optional(),
    salary: z.string().optional(),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .optional(),
    applicationUrl: z.string().url("Invalid URL format").optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

// Application schemas
export const ApplicationCreateSchema = z.object({
  jobId: z.string().uuid("Invalid job ID"),
  candidateId: z.string().uuid("Invalid candidate ID"),
});

export const ApplicationUpdateSchema = z.object({
  status: ApplicationStatusEnum,
});

// Task schemas
export const TaskCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .optional(),
});

// Type exports for TypeScript inference
export type UserCreateInput = z.infer<typeof UserCreateSchema>;
export type UserUpdateInput = z.infer<typeof UserUpdateSchema>;
export type JobCreateInput = z.infer<typeof JobCreateSchema>;
export type JobUpdateInput = z.infer<typeof JobUpdateSchema>;
export type ApplicationCreateInput = z.infer<typeof ApplicationCreateSchema>;
export type ApplicationUpdateInput = z.infer<typeof ApplicationUpdateSchema>;
export type TaskCreateInput = z.infer<typeof TaskCreateSchema>;
