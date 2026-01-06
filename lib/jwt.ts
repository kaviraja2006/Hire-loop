import * as jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * Verify JWT token from request headers
 * @param request - The request object
 * @returns Decoded token payload or null if invalid
 */
export function verifyToken(request: Request): JWTPayload | null {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return null;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

/**
 * Middleware-like function to protect routes
 * Returns an error response if token is invalid
 */
export function requireAuth(request: Request): NextResponse | JWTPayload {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json(
      { success: false, message: "Authorization header missing" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Token missing" },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid or expired token" },
      { status: 403 }
    );
  }
}

/**
 * Generate JWT token for user
 */
export function generateToken(payload: JWTPayload, expiresIn = "1h"): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
}
