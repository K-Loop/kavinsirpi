import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Uploads directory: kavinsirpi/server/uploads
const uploadsDir = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Memory storage keeps original large files out of disk before compression
const storage = multer.memoryStorage();

// File filter accepting all common image types
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WEBP, etc.) are permitted'), false);
  }
};

export const multerUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024, // Allow up to 25MB initial upload, which will be compressed down to ~150-300KB
  },
});

/**
 * Intelligent Sharp WebP Compression Middleware
 * Tailored for 4GB VPS environments:
 * 1. Resizes large camera photos to max 1920px (full HD clarity without massive pixel bloat)
 * 2. Compresses using Google WebP format at quality 82 with effort 6
 * 3. Preserves fine chisel and cement texture details with zero noticeable loss in clarity
 * 4. Measures exact disk space saved
 */
export const compressToWebp = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const originalSize = req.file.size;
    const maxWidth = parseInt(process.env.MAX_IMAGE_WIDTH, 10) || 1920;
    const quality = parseInt(process.env.WEBP_QUALITY, 10) || 82;

    const uniqueId = `art-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const outputFileName = `${uniqueId}.webp`;
    const outputPath = path.join(uploadsDir, outputFileName);

    // Sharp processing pipeline
    const sharpInstance = sharp(req.file.buffer);
    const metadata = await sharpInstance.metadata();

    let transform = sharp(req.file.buffer).rotate(); // auto-orient based on EXIF

    // Resize only if larger than maxWidth or maxHeight, preserving aspect ratio without distortion
    if (metadata.width > maxWidth || metadata.height > maxWidth) {
      transform = transform.resize({
        width: maxWidth,
        height: maxWidth,
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Convert to high-clarity, ultra-compressed WebP
    await transform
      .webp({
        quality: quality,
        effort: 6, // Maximum compression effort
        smartSubsample: true,
      })
      .toFile(outputPath);

    // Get final compressed file size
    const stats = fs.statSync(outputPath);
    const compressedSize = stats.size;
    const savingsPercent = originalSize > 0
      ? (((originalSize - compressedSize) / originalSize) * 100).toFixed(1)
      : 0;

    // Relative web URL
    const webUrl = `/uploads/${outputFileName}`;

    req.processedFile = {
      filename: outputFileName,
      path: outputPath,
      url: webUrl,
      originalSize,
      compressedSize,
      compressionRatio: parseFloat(savingsPercent),
      width: metadata.width,
      height: metadata.height,
    };

    next();
  } catch (error) {
    console.error('Sharp WebP compression error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process and compress image to WebP format: ' + error.message,
    });
  }
};
