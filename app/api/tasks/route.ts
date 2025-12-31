import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.title) {
      return sendError(
        "Missing required field: title",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    return sendSuccess(body, "Task created successfully", 201);
  } catch (err) {
    return sendError(
      "Task creation failed",
      ERROR_CODES.INTERNAL_ERROR,
      500,
      err
    );
  }
}
