import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import { TaskCreateSchema } from "@/lib/validation";
import { ZodError } from "zod";
import { formatZodError } from "@/lib/zodErrorFormatter";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = TaskCreateSchema.parse(body);

    return sendSuccess(validatedData, "Task created successfully", 201);
  } catch (error) {
    if (error instanceof ZodError) {
      return formatZodError(error);
    }
    return sendError(
      "Task creation failed",
      ERROR_CODES.INTERNAL_ERROR,
      500,
      error
    );
  }
}
