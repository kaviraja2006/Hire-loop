import { NextResponse } from "next/server";
import { ZodError } from "zod";

// HTTP Status Codes
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Pagination configuration
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Parse and validate pagination parameters from URL search params
 */
export function getPaginationParams(
  searchParams: URLSearchParams
): PaginationParams {
  const page = Math.max(1, Number(searchParams.get("page")) || DEFAULT_PAGE);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number(searchParams.get("limit")) || DEFAULT_LIMIT)
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

/**
 * Create a paginated response
 */
export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  params: PaginationParams
): PaginatedResponse<T> {
  return {
    data,
    pagination: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages: Math.ceil(total / params.limit),
    },
  };
}

/**
 * Error response helper
 */
export function errorResponse(
  message: string,
  status: number = HttpStatus.INTERNAL_SERVER_ERROR
) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Success response helper
 */
export function successResponse<T>(data: T, status: number = HttpStatus.OK) {
  return NextResponse.json(data, { status });
}

/**
 * Handle Zod validation errors
 */
export function handleValidationError(error: ZodError<unknown>) {
  const formattedErrors = error.errors.map(
    (err: { path: (string | number)[]; message: string }) => ({
      field: err.path.join("."),
      message: err.message,
    })
  );

  return NextResponse.json(
    {
      error: "Validation failed",
      details: formattedErrors,
    },
    { status: HttpStatus.BAD_REQUEST }
  );
}

/**
 * Handle Prisma errors
 */
export function handlePrismaError(error: {
  code?: string;
  meta?: { target?: string[] };
}) {
  // Unique constraint violation
  if (error.code === "P2002") {
    return errorResponse(
      `A record with this ${error.meta?.target?.join(", ")} already exists`,
      HttpStatus.CONFLICT
    );
  }

  // Record not found
  if (error.code === "P2025") {
    return errorResponse("Record not found", HttpStatus.NOT_FOUND);
  }

  // Foreign key constraint failed
  if (error.code === "P2003") {
    return errorResponse("Related record not found", HttpStatus.BAD_REQUEST);
  }

  // Default error
  console.error("Prisma error:", error);
  return errorResponse(
    "Database error occurred",
    HttpStatus.INTERNAL_SERVER_ERROR
  );
}

/**
 * Generic error handler
 */
export function handleError(error: unknown) {
  if (error instanceof ZodError) {
    return handleValidationError(error);
  }

  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return handlePrismaError(
      error as { code?: string; meta?: { target?: string[] } }
    );
  }

  console.error("Unexpected error:", error);
  return errorResponse(
    error instanceof Error ? error.message : "An unexpected error occurred",
    HttpStatus.INTERNAL_SERVER_ERROR
  );
}
