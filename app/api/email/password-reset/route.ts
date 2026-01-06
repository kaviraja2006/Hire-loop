import { NextRequest, NextResponse } from "next/server";
import { sendPasswordResetEmail } from "@/lib/email";
import { handleError, ValidationError } from "@/lib/errorHandler";

/**
 * POST /api/email/password-reset
 * Send password reset email
 *
 * Request body:
 * {
 *   to: string,
 *   userName: string,
 *   resetToken: string
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, userName, resetToken } = body;

    if (!to || !userName || !resetToken) {
      throw new ValidationError(
        "Missing required fields: to, userName, and resetToken are required"
      );
    }

    const result = await sendPasswordResetEmail(to, userName, resetToken);

    if (!result.success) {
      throw new Error(result.error || "Failed to send password reset email");
    }

    return NextResponse.json({
      success: true,
      message: "Password reset email sent successfully",
      data: {
        messageId: result.messageId,
      },
    });
  } catch (error) {
    return handleError(error, "POST /api/email/password-reset");
  }
}
