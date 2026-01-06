import { NextResponse } from "next/server";
import { logger } from "./logger";

/**
 * Custom error types for better error categorization
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

/**
 * Centralized error handler for API routes
 * @param error - The error object
 * @param context - Where the error occurred (e.g., "GET /api/users")
 * @returns NextResponse with formatted error
 */
export function handleError(error: unknown, context: string): NextResponse {
  const isProd = process.env.NODE_ENV === "production";

  // Determine status code based on error type
  let statusCode = 500;
  let userMessage = "Something went wrong. Please try again later.";

  if (error instanceof ValidationError) {
    statusCode = 400;
    userMessage = isProd ? "Invalid request data" : error.message;
  } else if (error instanceof AuthenticationError) {
    statusCode = 401;
    userMessage = isProd ? "Authentication required" : error.message;
  } else if (error instanceof AuthorizationError) {
    statusCode = 403;
    userMessage = isProd ? "Access denied" : error.message;
  } else if (error instanceof DatabaseError) {
    statusCode = 500;
    userMessage = isProd
      ? "Database error occurred"
      : `Database error: ${error.message}`;
  }

  // Safely extract error details
  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  const errorName = error instanceof Error ? error.name : "Error";
  const errorStack = error instanceof Error ? error.stack : undefined;

  // Prepare error response
  const errorResponse: Record<string, unknown> = {
    success: false,
    message: isProd ? userMessage : errorMessage,
    errorType: errorName,
  };

  // Include stack trace only in development
  if (!isProd && errorStack) {
    errorResponse.stack = errorStack;
  }

  // Log error with full details
  logger.error(`Error in ${context}`, {
    errorType: errorName,
    message: errorMessage,
    stack: isProd ? "REDACTED" : errorStack,
    statusCode,
  });

  return NextResponse.json(errorResponse, { status: statusCode });
}

/**
 * Async wrapper to catch errors in route handlers
 * @param handler - The async route handler function
 * @param context - Route context for logging
 * @returns Wrapped handler with error catching
 */
export function withErrorHandler(
  handler: (req: Request, context?: unknown) => Promise<NextResponse>,
  routeContext: string
) {
  return async (req: Request, context?: unknown): Promise<NextResponse> => {
    try {
      return await handler(req, context);
    } catch (error) {
      return handleError(error, routeContext);
    }
  };
}
