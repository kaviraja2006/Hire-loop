import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { handleError, ValidationError } from "@/lib/errorHandler";
import { logger } from "@/lib/logger";

/**
 * POST /api/email/send
 * Send a custom email
 *
 * Request body:
 * {
 *   to: string | string[],
 *   subject: string,
 *   html: string,
 *   from?: string,
 *   replyTo?: string
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, subject, html, from, replyTo } = body;

    // Validate required fields
    if (!to || !subject || !html) {
      throw new ValidationError(
        "Missing required fields: to, subject, and html are required"
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const recipients = Array.isArray(to) ? to : [to];

    for (const email of recipients) {
      if (!emailRegex.test(email)) {
        throw new ValidationError(`Invalid email format: ${email}`);
      }
    }

    // Send email
    const result = await sendEmail(to, subject, html, { from, replyTo });

    if (!result.success) {
      throw new Error(result.error || "Failed to send email");
    }

    logger.info("Email sent via API", {
      to,
      subject,
      messageId: result.messageId,
    });

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      data: {
        messageId: result.messageId,
        recipients: recipients.length,
      },
    });
  } catch (error) {
    return handleError(error, "POST /api/email/send");
  }
}
