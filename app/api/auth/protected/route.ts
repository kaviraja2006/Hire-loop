import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

/**
 * GET /api/auth/protected
 * Protected endpoint that requires valid JWT token
 * Demonstrates token validation
 */
export async function GET(req: Request) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Authorization header missing" },
        { status: 401 }
      );
    }

    // Extract Bearer token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token missing" },
        { status: 401 }
      );
    }

    // Verify JWT token
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
        email: string;
        role: string;
      };

      return NextResponse.json({
        success: true,
        message: "Access granted - Protected data",
        user: {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
        },
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Authentication failed",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
