import { NextRequest, NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email";
import { handleError, ValidationError } from "@/lib/errorHandler";

/**
 * POST /api/email/welcome
 * Send welcome email to new user
 *
 * Request body:
 * {
 *   to: string,
 *   userName: string
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, userName } = body;

    if (!to || !userName) {
      throw new ValidationError(
        "Missing required fields: to and userName are required"
      );
    }

    const result = await sendWelcomeEmail(to, userName);

    if (!result.success) {
      throw new Error(result.error || "Failed to send welcome email");
    }

    return NextResponse.json({
      success: true,
      message: "Welcome email sent successfully",
      data: {
        messageId: result.messageId,
      },
    });
  } catch (error) {
    return handleError(error, "POST /api/email/welcome");
  }
}
