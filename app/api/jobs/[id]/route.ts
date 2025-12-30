import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { JobUpdateSchema } from "@/lib/validation";
import {
  handleError,
  successResponse,
  errorResponse,
  HttpStatus,
} from "@/lib/api-utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/jobs/:id
 * Get a specific job by ID with recruiter and application details
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const job = await prisma.job.findUnique({
      where: { id },
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
        applications: {
          select: {
            id: true,
            status: true,
            appliedAt: true,
            candidate: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { appliedAt: "desc" },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!job) {
      return errorResponse("Job not found", HttpStatus.NOT_FOUND);
    }

    return successResponse(job);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PUT /api/jobs/:id
 * Update a job posting
 * Body: { title?, company?, location?, jobType?, experienceLevel?, salary?, description?, applicationUrl? }
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = JobUpdateSchema.parse(body);

    const job = await prisma.job.update({
      where: { id },
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

    return successResponse(job);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/jobs/:id
 * Delete a job posting (cascades to related applications)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    await prisma.job.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Job deleted successfully" },
      { status: HttpStatus.OK }
    );
  } catch (error) {
    return handleError(error);
  }
}
