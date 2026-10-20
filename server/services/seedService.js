import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import mongoose from 'mongoose';
import { Artwork } from '../models/Artwork.js';
import { Category } from '../models/Category.js';
import { DEFAULT_ARTWORKS, DEFAULT_CATEGORIES } from '../data/defaultArtworks.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.resolve(__dirname, '../uploads');
const fallbackStorePath = path.resolve(__dirname, '../data/artworks_store.json');
const publicDir = path.resolve(__dirname, '../../public');

/**
 * Automatically compress all craft photos to WebP into /uploads
 * and seed MongoDB + fallback JSON store on server startup
 */
export const autoSeedArtworksAndPhotos = async () => {
  console.log('[Auto-Seed] Starting automated photo processing & portfolio seeding...');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const maxWidth = parseInt(process.env.MAX_IMAGE_WIDTH, 10) || 1920;
  const quality = parseInt(process.env.WEBP_QUALITY, 10) || 82;

  let convertedCount = 0;
  let alreadyWebpCount = 0;
  const processedArtworks = [];

  for (const item of DEFAULT_ARTWORKS) {
    const artwork = { ...item };
    let finalImagePath = artwork.image;
    let originalSize = 0;
    let compressedSize = 0;
    let compressionRatio = 0;

    // Resolve source image in public directory
    const cleanRelPath = artwork.image.startsWith('/') ? artwork.image.slice(1) : artwork.image;
    const sourceFilePath = path.join(publicDir, cleanRelPath);

    if (fs.existsSync(sourceFilePath)) {
      try {
        const fileExt = path.extname(sourceFilePath);
        const baseName = path.basename(sourceFilePath, fileExt);
        const webpFilename = `${baseName}.webp`;
        const webpOutputPath = path.join(uploadsDir, webpFilename);

        const origStat = fs.statSync(sourceFilePath);
        originalSize = origStat.size;

        if (fs.existsSync(webpOutputPath)) {
          // Already converted
          const webpStat = fs.statSync(webpOutputPath);
          compressedSize = webpStat.size;
          alreadyWebpCount++;
        } else {
          // Convert using Sharp with high clarity WebP quality
          await sharp(sourceFilePath)
            .rotate()
            .resize({
              width: maxWidth,
              height: maxWidth,
              fit: 'inside',
              withoutEnlargement: true,
            })
            .webp({
              quality,
              effort: 6,
              smartSubsample: true,
            })
            .toFile(webpOutputPath);

          const webpStat = fs.statSync(webpOutputPath);
          compressedSize = webpStat.size;
          convertedCount++;
        }

        if (originalSize > 0 && compressedSize > 0) {
          compressionRatio = parseFloat((((originalSize - compressedSize) / originalSize) * 100).toFixed(1));
        }

        finalImagePath = `/uploads/${webpFilename}`;
      } catch (err) {
        console.warn(`[Auto-Seed] Sharp conversion warning for ${artwork.title}:`, err.message);
      }
    } else {
      // If source image is already in /uploads
      const uploadCheck = path.join(uploadsDir, path.basename(artwork.image));
      if (fs.existsSync(uploadCheck)) {
        finalImagePath = `/uploads/${path.basename(artwork.image)}`;
      }
    }

    artwork.image = finalImagePath;
    artwork.originalSize = originalSize;
    artwork.compressedSize = compressedSize;
    artwork.compressionRatio = compressionRatio;
    processedArtworks.push(artwork);
  }

  console.log(`[Auto-Seed] WebP Photos ready in /uploads: ${alreadyWebpCount} cached, ${convertedCount} newly compressed.`);

  // 1. Always update local fallback JSON store
  try {
    fs.mkdirSync(path.dirname(fallbackStorePath), { recursive: true });
    fs.writeFileSync(fallbackStorePath, JSON.stringify(processedArtworks, null, 2), 'utf-8');
    console.log(`[Auto-Seed] Fallback store synced with ${processedArtworks.length} artworks at artworks_store.json`);
  } catch (err) {
    console.error('[Auto-Seed] Error saving fallback store:', err.message);
  }

  // 2. Sync to MongoDB if connected
  if (mongoose.connection.readyState === 1) {
    try {
      // Sync Categories
      for (let i = 0; i < DEFAULT_CATEGORIES.length; i++) {
        const catName = DEFAULT_CATEGORIES[i];
        await Category.findOneAndUpdate(
          { name: catName },
          { $set: { name: catName, order: i } },
          { upsert: true }
        );
      }
      console.log(`[Auto-Seed] Categories synced to MongoDB (${DEFAULT_CATEGORIES.length} categories)`);

      // Sync Artworks
      let upsertedCount = 0;
      for (const art of processedArtworks) {
        await Artwork.findOneAndUpdate(
          { title: art.title },
          {
            $set: {
              title: art.title,
              category: art.category,
              image: art.image,
              medium: art.medium,
              dimensions: art.dimensions,
              description: art.description,
              highlights: art.highlights,
              featured: art.featured ?? true,
              aspect: art.aspect || 'portrait',
              date: art.date,
              originalSize: art.originalSize || 0,
              compressedSize: art.compressedSize || 0,
              compressionRatio: art.compressionRatio || 0,
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        upsertedCount++;
      }
      console.log(`[Auto-Seed] Artworks synced to MongoDB (${upsertedCount} items). Portfolio fully active!`);
    } catch (dbErr) {
      console.error('[Auto-Seed] MongoDB sync error:', dbErr.message);
    }
  }

  return processedArtworks;
};
