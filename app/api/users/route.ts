import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserCreateSchema } from "@/lib/validation";
import {
  getPaginationParams,
  createPaginatedResponse,
  handleError,
  successResponse,
  HttpStatus,
} from "@/lib/api-utils";

/**
 * GET /api/users
 * Get all users with pagination and optional role filtering
 * Query params: page, limit, role
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = getPaginationParams(searchParams);
    const role = searchParams.get("role");

    // Build where clause
    const where = role ? { role: role as "CANDIDATE" | "RECRUITER" } : {};

    // Get total count for pagination
    const total = await prisma.user.count({ where });

    // Get users
    const users = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
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

    const response = createPaginatedResponse(users, total, {
      page,
      limit,
      skip,
    });
    return successResponse(response);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/users
 * Create a new user
 * Body: { email, name?, role? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = UserCreateSchema.parse(body);

    const user = await prisma.user.create({
      data: validatedData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return successResponse(user, HttpStatus.CREATED);
  } catch (error) {
    return handleError(error);
  }
}
