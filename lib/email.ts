import sgMail from "@sendgrid/mail";
import { logger } from "./logger";

// Initialize SendGrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_SENDER = process.env.SENDGRID_SENDER || "noreply@example.com";

if (!SENDGRID_API_KEY) {
  logger.warn("SendGrid API key not configured - email sending will not work");
} else {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

/**
 * Email configuration
 */
export const EMAIL_CONFIG = {
  sender: SENDGRID_SENDER,
  replyTo: process.env.SENDGRID_REPLY_TO || SENDGRID_SENDER,
  supportEmail: process.env.SUPPORT_EMAIL || "support@example.com",
};

/**
 * Email templates
 */
export const emailTemplates = {
  /**
   * Welcome email template
   */
  welcome: (userName: string, loginUrl: string) => ({
    subject: "Welcome to Hire-Loop! 🎉",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Hire-Loop!</h1>
            </div>
            <div class="content">
              <h2>Hi ${userName},</h2>
              <p>We're thrilled to have you join our platform! 🎉</p>
              <p>Hire-Loop connects talented candidates with amazing opportunities. Whether you're looking for your dream job or the perfect candidate, we've got you covered.</p>
              <p>Get started by exploring available positions or posting your first job!</p>
              <div style="text-align: center;">
                <a href="${loginUrl}" class="button">Get Started</a>
              </div>
              <p>If you have any questions, feel free to reach out to our support team.</p>
              <p>Best regards,<br>The Hire-Loop Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply directly to this message.</p>
              <p>© 2026 Hire-Loop. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  /**
   * Password reset email template
   */
  passwordReset: (userName: string, resetUrl: string, expiryMinutes = 30) => ({
    subject: "Reset Your Password - Hire-Loop",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f44336; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #f44336; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Hi ${userName},</h2>
              <p>We received a request to reset your password for your Hire-Loop account.</p>
              <p>Click the button below to reset your password:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              <div class="warning">
                <strong>⏰ This link will expire in ${expiryMinutes} minutes.</strong>
              </div>
              <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
              <p>For security reasons, this link can only be used once.</p>
              <p>Best regards,<br>The Hire-Loop Security Team</p>
            </div>
            <div class="footer">
              <p>This is an automated security email. Please do not reply.</p>
              <p>© 2026 Hire-Loop. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  /**
   * Application confirmation email
   */
  applicationConfirmation: (
    userName: string,
    jobTitle: string,
    company: string
  ) => ({
    subject: `Application Received: ${jobTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4caf50; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .job-details { background: white; padding: 20px; border-left: 4px solid #4caf50; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Application Received!</h1>
            </div>
            <div class="content">
              <h2>Hi ${userName},</h2>
              <p>Great news! We've successfully received your application.</p>
              <div class="job-details">
                <h3>${jobTitle}</h3>
                <p><strong>Company:</strong> ${company}</p>
                <p><strong>Status:</strong> Under Review</p>
              </div>
              <p>Our team will review your application and get back to you soon. We typically respond within 3-5 business days.</p>
              <p>You can track your application status by logging into your Hire-Loop dashboard.</p>
              <p>Good luck! 🍀</p>
              <p>Best regards,<br>The Hire-Loop Team</p>
            </div>
            <div class="footer">
              <p>This is an automated confirmation email.</p>
              <p>© 2026 Hire-Loop. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
};

/**
 * Send email using SendGrid
 */
export async function sendEmail(
  to: string | string[],
  subject: string,
  html: string,
  options?: {
    from?: string;
    replyTo?: string;
    attachments?: Array<{
      content: string;
      filename: string;
      type: string;
      disposition: string;
    }>;
  }
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!SENDGRID_API_KEY) {
      throw new Error("SendGrid API key not configured");
    }

    const msg = {
      to,
      from: options?.from || EMAIL_CONFIG.sender,
      replyTo: options?.replyTo || EMAIL_CONFIG.replyTo,
      subject,
      html,
      attachments: options?.attachments,
    };

    const [response] = await sgMail.send(msg);

    logger.info("Email sent successfully", {
      to: Array.isArray(to) ? to.join(", ") : to,
      subject,
      messageId: response.headers["x-message-id"],
      statusCode: response.statusCode,
    });

    return {
      success: true,
      messageId: response.headers["x-message-id"],
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorResponse =
      error instanceof Error && "response" in error
        ? (error as { response?: { body?: unknown } }).response?.body
        : undefined;

    logger.error("Failed to send email", {
      to,
      subject,
      error: errorMessage,
      response: errorResponse,
    });

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(
  to: string,
  userName: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/sign-in`;
  const template = emailTemplates.welcome(userName, loginUrl);

  return sendEmail(to, template.subject, template.html);
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  to: string,
  userName: string,
  resetToken: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;
  const template = emailTemplates.passwordReset(userName, resetUrl);

  return sendEmail(to, template.subject, template.html);
}

/**
 * Send application confirmation email
 */
export async function sendApplicationConfirmation(
  to: string,
  userName: string,
  jobTitle: string,
  company: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const template = emailTemplates.applicationConfirmation(
    userName,
    jobTitle,
    company
  );

  return sendEmail(to, template.subject, template.html);
}
