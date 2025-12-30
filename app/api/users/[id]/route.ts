import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserUpdateSchema } from "@/lib/validation";
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
 * GET /api/users/:id
 * Get a specific user by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            postedJobs: true,
            applications: true,
          },
        },
      },
    });

    if (!user) {
      return errorResponse("User not found", HttpStatus.NOT_FOUND);
    }

    return successResponse(user);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PUT /api/users/:id
 * Update a user
 * Body: { email?, name?, role? }
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = UserUpdateSchema.parse(body);

    const user = await prisma.user.update({
      where: { id },
      data: validatedData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return successResponse(user);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/users/:id
 * Delete a user (cascades to related jobs and applications)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: HttpStatus.OK }
    );
  } catch (error) {
    return handleError(error);
  }
}
