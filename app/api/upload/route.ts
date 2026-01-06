import { NextRequest, NextResponse } from "next/server";
import {
  generatePresignedUploadUrl,
  generateFileKey,
  isValidFileType,
  isValidFileSize,
  getPublicUrl,
  FILE_UPLOAD_CONFIG,
  formatFileSize,
} from "@/lib/s3";
import { handleError, ValidationError } from "@/lib/errorHandler";
import { logger } from "@/lib/logger";

/**
 * POST /api/upload
 * Generate pre-signed URL for file upload
 *
 * Request body:
 * {
 *   filename: string,
 *   fileType: string (MIME type),
 *   fileSize: number (bytes),
 *   userId?: string
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { filename, fileType, fileSize, userId } = body;

    // Validate required fields
    if (!filename || !fileType || !fileSize) {
      throw new ValidationError(
        "Missing required fields: filename, fileType, and fileSize are required"
      );
    }

    // Validate file type
    if (!isValidFileType(fileType)) {
      throw new ValidationError(
        `Unsupported file type: ${fileType}. Allowed types: ${FILE_UPLOAD_CONFIG.allowedTypes.join(", ")}`
      );
    }

    // Validate file size
    if (!isValidFileSize(fileSize)) {
      throw new ValidationError(
        `File size ${formatFileSize(fileSize)} exceeds maximum allowed size of ${formatFileSize(FILE_UPLOAD_CONFIG.maxSize)}`
      );
    }

    // Generate unique file key
    const key = generateFileKey(filename, userId);

    // Generate pre-signed upload URL
    const uploadURL = await generatePresignedUploadUrl(key, fileType);

    // Generate public URL for the file (after upload)
    const publicURL = getPublicUrl(key);

    logger.info("Pre-signed upload URL generated", {
      filename,
      fileType,
      key,
      userId,
    });

    return NextResponse.json({
      success: true,
      message: "Pre-signed upload URL generated successfully",
      data: {
        uploadURL,
        publicURL,
        key,
        expiresIn: FILE_UPLOAD_CONFIG.urlExpirySeconds,
        instructions: {
          method: "PUT",
          headers: {
            "Content-Type": fileType,
          },
          note: "Upload your file directly to the uploadURL using a PUT request",
        },
      },
    });
  } catch (error) {
    return handleError(error, "POST /api/upload");
  }
}

/**
 * GET /api/upload/config
 * Get upload configuration and limits
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    config: {
      allowedTypes: FILE_UPLOAD_CONFIG.allowedTypes,
      maxSize: FILE_UPLOAD_CONFIG.maxSize,
      maxSizeFormatted: formatFileSize(FILE_UPLOAD_CONFIG.maxSize),
      urlExpirySeconds: FILE_UPLOAD_CONFIG.urlExpirySeconds,
    },
  });
}
