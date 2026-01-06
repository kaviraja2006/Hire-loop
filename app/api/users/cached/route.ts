import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cache } from "@/lib/redis";
import { logger } from "@/lib/logger";
import { handleError } from "@/lib/errorHandler";

/**
 * GET /api/users/cached
 * Get all users with Redis caching
 * Demonstrates cache-aside pattern with TTL
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get("role");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Generate cache key based on query parameters
    const cacheKey = `users:list:${role || "all"}:page:${page}:limit:${limit}`;

    // Try to get from cache first
    const cached = await cache.get<{
      users: unknown[];
      total: number;
      page: number;
      limit: number;
    }>(cacheKey);

    if (cached) {
      const responseTime = Date.now() - startTime;
      logger.info("Cache HIT", {
        key: cacheKey,
        responseTime: `${responseTime}ms`,
      });

      return NextResponse.json({
        success: true,
        message: "Users fetched from cache",
        data: cached,
        meta: {
          cached: true,
          responseTime: `${responseTime}ms`,
        },
      });
    }

    // Cache MISS - Fetch from database
    logger.info("Cache MISS - Fetching from database", { key: cacheKey });

    const where = role ? { role: role as "CANDIDATE" | "RECRUITER" } : {};
    const skip = (page - 1) * limit;

    // Get total count
    const total = await prisma.user.count({ where });

    // Get users
    const users = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            postedJobs: true,
            applications: true,
          },
        },
      },
    });

    const responseData = {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    // Cache the result with 60 second TTL
    await cache.set(cacheKey, responseData, 60);

    const responseTime = Date.now() - startTime;
    logger.info("Database query completed", {
      responseTime: `${responseTime}ms`,
      cached: false,
    });

    return NextResponse.json({
      success: true,
      message: "Users fetched from database",
      data: responseData,
      meta: {
        cached: false,
        responseTime: `${responseTime}ms`,
        ttl: "60s",
      },
    });
  } catch (error) {
    return handleError(error, "GET /api/users/cached");
  }
}

/**
 * DELETE /api/users/cached/cache
 * Invalidate users cache
 * Used when user data is updated
 */
export async function DELETE() {
  try {
    // Delete all cache entries matching the pattern
    const deleted = await cache.delPattern("users:list:*");

    logger.info("Cache invalidated", { deletedKeys: deleted });

    return NextResponse.json({
      success: true,
      message: `Cache invalidated successfully`,
      deletedKeys: deleted,
    });
  } catch (error) {
    return handleError(error, "DELETE /api/users/cached/cache");
  }
}
