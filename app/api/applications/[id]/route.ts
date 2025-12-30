import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApplicationUpdateSchema } from "@/lib/validation";
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
 * GET /api/applications/:id
 * Get a specific application by ID with job and candidate details
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const application = await prisma.application.findUnique({
      where: { id },
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
            salary: true,
            description: true,
            applicationUrl: true,
            recruiter: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        candidate: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!application) {
      return errorResponse("Application not found", HttpStatus.NOT_FOUND);
    }

    return successResponse(application);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PATCH /api/applications/:id
 * Update application status
 * Body: { status }
 * Valid transitions: PENDING → REVIEWED → INTERVIEWING → OFFERED/REJECTED
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = ApplicationUpdateSchema.parse(body);

    const application = await prisma.application.update({
      where: { id },
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

    return successResponse(application);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/applications/:id
 * Delete an application
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    await prisma.application.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Application deleted successfully" },
      { status: HttpStatus.OK }
    );
  } catch (error) {
    return handleError(error);
  }
}
