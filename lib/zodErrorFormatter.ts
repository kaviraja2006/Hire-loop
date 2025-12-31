import { ZodError } from "zod";
import { sendError } from "./responseHandler";
import { ERROR_CODES } from "./errorCodes";

/**
 * Formats Zod validation errors into a structured, client-friendly format
 * that integrates with our standardized API response handler.
 *
 * @param error - ZodError instance from schema.parse()
 * @returns NextResponse with formatted validation errors
 */
export function formatZodError(error: ZodError<unknown>) {
  const formattedErrors = error.issues.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));

  return sendError(
    "Validation failed",
    ERROR_CODES.VALIDATION_ERROR,
    400,
    formattedErrors
  );
}
