import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { JobCreateSchema } from "@/lib/validation";
import { getPaginationParams, createPaginatedResponse } from "@/lib/api-utils";
import { JobType, ExperienceLevel } from "@prisma/client";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import { ZodError } from "zod";
import { formatZodError } from "@/lib/zodErrorFormatter";

/**
 * GET /api/jobs
 * Get all jobs with pagination and filtering
 * Query params: page, limit, jobType, experienceLevel, recruiterId
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = getPaginationParams(searchParams);

    const jobType = searchParams.get("jobType") as JobType | null;
    const experienceLevel = searchParams.get(
      "experienceLevel"
    ) as ExperienceLevel | null;
    const recruiterId = searchParams.get("recruiterId");

    // Build where clause
    const where: Record<string, unknown> = {};
    if (jobType) where.jobType = jobType;
    if (experienceLevel) where.experienceLevel = experienceLevel;
    if (recruiterId) where.recruiterId = recruiterId;

    // Get total count for pagination
    const total = await prisma.job.count({ where });

    // Get jobs
    const jobs = await prisma.job.findMany({
      where,
      skip,
      take: limit,
      orderBy: { postedAt: "desc" },
      select: {
        id: true,
        title: true,
        company: true,
        location: true,
        jobType: true,
        experienceLevel: true,
        salary: true,
        description: true,
        applicationUrl: true,
        postedAt: true,
        recruiter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    const response = createPaginatedResponse(jobs, total, {
      page,
      limit,
      skip,
    });
    return sendSuccess(response, "Jobs fetched successfully");
  } catch (error) {
    return sendError(
      "Failed to fetch jobs",
      ERROR_CODES.DATABASE_FAILURE,
      500,
      error
    );
  }
}

/**
 * POST /api/jobs
 * Create a new job posting
 * Body: { title, company, location, jobType, experienceLevel, salary?, description, applicationUrl?, recruiterId }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = JobCreateSchema.parse(body);

    const job = await prisma.job.create({
      data: validatedData,
      select: {
        id: true,
        title: true,
        company: true,
        location: true,
        jobType: true,
        experienceLevel: true,
        salary: true,
        description: true,
        applicationUrl: true,
        postedAt: true,
        recruiter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return sendSuccess(job, "Job created successfully", 201);
  } catch (error) {
    if (error instanceof ZodError) {
      return formatZodError(error);
    }
    return sendError(
      "Failed to create job",
      ERROR_CODES.DATABASE_FAILURE,
      500,
      error
    );
  }
}
