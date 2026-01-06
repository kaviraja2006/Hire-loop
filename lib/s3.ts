import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { logger } from "./logger";

// Validate required environment variables
const AWS_REGION = process.env.AWS_REGION;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;

if (
  !AWS_REGION ||
  !AWS_ACCESS_KEY_ID ||
  !AWS_SECRET_ACCESS_KEY ||
  !AWS_BUCKET_NAME
) {
  logger.warn("AWS credentials not configured - file upload will not work");
}

// Initialize S3 client
export const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID || "",
    secretAccessKey: AWS_SECRET_ACCESS_KEY || "",
  },
});

/**
 * File validation configuration
 */
export const FILE_UPLOAD_CONFIG = {
  // Allowed MIME types
  allowedTypes: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/doc",
    "application/docx",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],

  // Maximum file size (10MB)
  maxSize: 10 * 1024 * 1024,

  // Pre-signed URL expiry (5 minutes)
  urlExpirySeconds: 300,
};

/**
 * Validate file type
 */
export function isValidFileType(mimeType: string): boolean {
  return FILE_UPLOAD_CONFIG.allowedTypes.includes(mimeType);
}

/**
 * Validate file size
 */
export function isValidFileSize(size: number): boolean {
  return size > 0 && size <= FILE_UPLOAD_CONFIG.maxSize;
}

/**
 * Generate a unique file key for S3
 */
export function generateFileKey(filename: string, userId?: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  const prefix = userId ? `user-${userId}` : "public";

  return `uploads/${prefix}/${timestamp}-${randomString}-${sanitizedFilename}`;
}

/**
 * Generate pre-signed URL for file upload
 */
export async function generatePresignedUploadUrl(
  key: string,
  mimeType: string,
  expiresIn = FILE_UPLOAD_CONFIG.urlExpirySeconds
): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: key,
      ContentType: mimeType,
      // Make file publicly readable
      ACL: "public-read",
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });
    logger.info("Generated pre-signed upload URL", { key, expiresIn });

    return url;
  } catch (error) {
    logger.error("Failed to generate pre-signed URL", { error });
    throw new Error("Could not generate upload URL");
  }
}

/**
 * Get public URL for uploaded file
 */
export function getPublicUrl(key: string): string {
  return `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;
}

/**
 * Format file size to human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
