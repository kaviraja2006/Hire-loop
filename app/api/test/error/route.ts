import { NextResponse } from "next/server";
import {
  handleError,
  ValidationError,
  DatabaseError,
} from "@/lib/errorHandler";
import { logger } from "@/lib/logger";

/**
 * GET /api/test/error
 * Test endpoint to demonstrate error handling
 * Query params:
 *   - type: validation|database|generic
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const errorType = searchParams.get("type") || "generic";

    logger.info(`Testing error handler with type: ${errorType}`);

    // Simulate different types of errors
    switch (errorType) {
      case "validation":
        throw new ValidationError("Invalid input: email format is incorrect");

      case "database":
        throw new DatabaseError("Connection to database failed");

      case "generic":
        throw new Error("Something unexpected happened");

      default:
        return NextResponse.json({
          success: true,
          message: "No error triggered. Use ?type=validation|database|generic",
        });
    }
  } catch (error) {
    return handleError(error, "GET /api/test/error");
  }
}
