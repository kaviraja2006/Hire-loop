import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleError, ValidationError } from "@/lib/errorHandler";
import { logger } from "@/lib/logger";

/**
 * POST /api/files
 * Store file metadata in database after successful upload
 *
 * Request body:
 * {
 *   name: string,
 *   url: string,
 *   key: string,
 *   size: number,
 *   mimeType: string,
 *   uploadedBy?: string
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, url, key, size, mimeType, uploadedBy } = body;

    // Validate required fields
    if (!name || !url || !key || !size || !mimeType) {
      throw new ValidationError(
        "Missing required fields: name, url, key, size, and mimeType are required"
      );
    }

    // Create file record
    const file = await prisma.file.create({
      data: {
        name,
        url,
        key,
        size,
        mimeType,
        uploadedBy: uploadedBy || null,
      },
      select: {
        id: true,
        name: true,
        url: true,
        key: true,
        size: true,
        mimeType: true,
        uploadedBy: true,
        createdAt: true,
      },
    });

    logger.info("File metadata stored in database", {
      fileId: file.id,
      name: file.name,
      size: file.size,
    });

    return NextResponse.json(
      {
        success: true,
        message: "File metadata stored successfully",
        data: file,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "POST /api/files");
  }
}

/**
 * GET /api/files
 * Get all uploaded files with optional filtering
 * Query params: userId, limit, page
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "20");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const where = userId ? { uploadedBy: userId } : {};

    // Get total count
    const total = await prisma.file.count({ where });

    // Get files
    const files = await prisma.file.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        url: true,
        key: true,
        size: true,
        mimeType: true,
        uploadedBy: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Files retrieved successfully",
      data: {
        files,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    return handleError(error, "GET /api/files");
  }
}

/**
 * DELETE /api/files/:id
 * Delete file metadata from database
 * Note: This does not delete the file from S3
 */
export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      throw new ValidationError("File ID is required");
    }

    // Delete file record
    await prisma.file.delete({
      where: { id },
    });

    logger.info("File metadata deleted", { fileId: id });

    return NextResponse.json({
      success: true,
      message: "File metadata deleted successfully",
    });
  } catch (error) {
    return handleError(error, "DELETE /api/files");
  }
}
