// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Temporarily disable Clerk middleware to test manual JWT authentication
// Uncomment the Clerk middleware below when you want to use Clerk instead

/*
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/",
  "/jobs/(.*)",
  "/api/(.*)", // Allow public access to API routes for testing
]);
export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});
*/

// Simple passthrough middleware for manual JWT authentication
export default function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
