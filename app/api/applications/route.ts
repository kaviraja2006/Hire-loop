import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApplicationCreateSchema } from "@/lib/validation";
import { getPaginationParams, createPaginatedResponse } from "@/lib/api-utils";
import { ApplicationStatus } from "@prisma/client";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import { ZodError } from "zod";
import { formatZodError } from "@/lib/zodErrorFormatter";

/**
 * GET /api/applications
 * Get all applications with pagination and filtering
 * Query params: page, limit, status, jobId, candidateId
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = getPaginationParams(searchParams);

    const status = searchParams.get("status") as ApplicationStatus | null;
    const jobId = searchParams.get("jobId");
    const candidateId = searchParams.get("candidateId");

    // Build where clause
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (jobId) where.jobId = jobId;
    if (candidateId) where.candidateId = candidateId;

    // Get total count for pagination
    const total = await prisma.application.count({ where });

    // Get applications
    const applications = await prisma.application.findMany({
      where,
      skip,
      take: limit,
      orderBy: { appliedAt: "desc" },
      select: {
        id: true,
        status: true,
        appliedAt: true,
        job: {
          select: {
            id: true,
            title: true,
            company: true,
            location: true,
            jobType: true,
            experienceLevel: true,
          },
        },
        candidate: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const response = createPaginatedResponse(applications, total, {
      page,
      limit,
      skip,
    });
    return sendSuccess(response, "Applications fetched successfully");
  } catch (error) {
    return sendError(
      "Failed to fetch applications",
      ERROR_CODES.DATABASE_FAILURE,
      500,
      error
    );
  }
}

/**
 * POST /api/applications
 * Create a new job application
 * Body: { jobId, candidateId }
 * Note: Unique constraint prevents duplicate applications
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = ApplicationCreateSchema.parse(body);

    const application = await prisma.application.create({
      data: validatedData,
      select: {
        id: true,
        status: true,
        appliedAt: true,
        job: {
          select: {
            id: true,
            title: true,
            company: true,
            location: true,
          },
        },
        candidate: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return sendSuccess(application, "Application created successfully", 201);
  } catch (error) {
    if (error instanceof ZodError) {
      return formatZodError(error);
    }
    return sendError(
      "Failed to create application",
      ERROR_CODES.DATABASE_FAILURE,
      500,
      error
    );
  }
}
