import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { Artwork } from '../models/Artwork.js';
import { Category } from '../models/Category.js';
import { authMiddleware } from '../middleware/auth.js';
import { multerUpload, compressToWebp } from '../middleware/upload.js';
import { DEFAULT_ARTWORKS, DEFAULT_CATEGORIES } from '../data/defaultArtworks.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, '../uploads');

// Local JSON fallback store in case MongoDB is temporarily disconnected or in setup
const FALLBACK_STORE_PATH = path.resolve(__dirname, '../data/artworks_store.json');

const getFallbackData = () => {
  try {
    if (fs.existsSync(FALLBACK_STORE_PATH)) {
      const data = JSON.parse(fs.readFileSync(FALLBACK_STORE_PATH, 'utf-8'));
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn('Fallback store read warning:', err.message);
  }
  return [...DEFAULT_ARTWORKS];
};

const saveFallbackData = (artworks) => {
  try {
    fs.mkdirSync(path.dirname(FALLBACK_STORE_PATH), { recursive: true });
    fs.writeFileSync(FALLBACK_STORE_PATH, JSON.stringify(artworks, null, 2), 'utf-8');
  } catch (err) {
    console.error('Fallback store save error:', err.message);
  }
};

const router = express.Router();

/**
 * Helper: Check if MongoDB connection is open
 */
const isMongoReady = () => mongoose.connection.readyState === 1;

/**
 * GET /api/artworks
 * Returns all artworks for public gallery and admin view
 */
router.get('/', async (req, res) => {
  try {
    if (isMongoReady()) {
      const dbArtworks = await Artwork.find().sort({ createdAt: -1 });
      if (dbArtworks.length > 0) {
        return res.json({ success: true, artworks: dbArtworks });
      }
      // If DB is empty, seed with initial portfolio
      try {
        await Artwork.insertMany(DEFAULT_ARTWORKS);
        const seeded = await Artwork.find().sort({ createdAt: -1 });
        return res.json({ success: true, artworks: seeded });
      } catch (seedErr) {
        // Fallback to defaults
      }
    }
    const fallbackList = getFallbackData();
    res.json({ success: true, artworks: fallbackList });
  } catch (error) {
    console.error('Error fetching artworks:', error);
    res.json({ success: true, artworks: getFallbackData() });
  }
});

/**
 * POST /api/artworks/upload
 * Protected: Uploads photo, compresses to WebP, limits dimensions to 1920px max for 4GB VPS conservation
 */
router.post('/upload', authMiddleware, multerUpload.single('photo'), compressToWebp, (req, res) => {
  try {
    if (!req.processedFile) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded or failed to process',
      });
    }

    res.json({
      success: true,
      file: {
        url: req.processedFile.url,
        filename: req.processedFile.filename,
        originalSize: req.processedFile.originalSize,
        compressedSize: req.processedFile.compressedSize,
        compressionRatio: req.processedFile.compressionRatio,
        width: req.processedFile.width,
        height: req.processedFile.height,
      },
      message: `Image converted to WebP successfully! Saved ${req.processedFile.compressionRatio}% disk space.`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/artworks
 * Protected: Adds a new artwork with all frontend details
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      title,
      category,
      image,
      medium,
      dimensions,
      description,
      highlights,
      featured,
      aspect,
      date,
      originalSize,
      compressedSize,
      compressionRatio,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Artwork title is required' });
    }
    if (!image || !image.trim()) {
      return res.status(400).json({ success: false, message: 'Artwork photo is required' });
    }

    const cleanTitle = title.trim();
    const cleanCategory = (category || 'Sacred Deities').trim();
    const cleanMedium = (medium || 'In-Situ Handcrafted Cement Relief').trim();
    const cleanDimensions = (dimensions || 'Custom Architectural Feature').trim();
    const cleanDescription = (description || '').trim();
    const cleanHighlights = Array.isArray(highlights)
      ? highlights.filter(h => typeof h === 'string' && h.trim().length > 0)
      : ['Direct wall relief carving', 'Master architectural craftsmanship'];
    const cleanDate = (date || '').trim() || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const cleanAspect = ['portrait', 'landscape', 'square'].includes(aspect) ? aspect : 'portrait';

    let savedArtwork;

    if (isMongoReady()) {
      const newArtwork = new Artwork({
        title: cleanTitle,
        category: cleanCategory,
        image: image.trim(),
        medium: cleanMedium,
        dimensions: cleanDimensions,
        description: cleanDescription,
        highlights: cleanHighlights,
        featured: featured !== undefined ? Boolean(featured) : true,
        aspect: cleanAspect,
        date: cleanDate,
        originalSize: Number(originalSize) || 0,
        compressedSize: Number(compressedSize) || 0,
        compressionRatio: Number(compressionRatio) || 0,
      });

      savedArtwork = await newArtwork.save();

      // Ensure category exists
      await Category.findOneAndUpdate(
        { name: cleanCategory },
        { name: cleanCategory },
        { upsert: true, new: true }
      ).catch(() => {});
    } else {
      // Local fallback store
      const items = getFallbackData();
      const newArtwork = {
        id: `art-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: cleanTitle,
        category: cleanCategory,
        image: image.trim(),
        medium: cleanMedium,
        dimensions: cleanDimensions,
        description: cleanDescription,
        highlights: cleanHighlights,
        featured: featured !== undefined ? Boolean(featured) : true,
        aspect: cleanAspect,
        date: cleanDate,
        originalSize: Number(originalSize) || 0,
        compressedSize: Number(compressedSize) || 0,
        compressionRatio: Number(compressionRatio) || 0,
        createdAt: new Date().toISOString(),
      };
      items.unshift(newArtwork);
      saveFallbackData(items);
      savedArtwork = newArtwork;
    }

    return res.status(201).json({
      success: true,
      artwork: savedArtwork,
      message: `Artwork "${cleanTitle}" successfully added!`,
    });
  } catch (error) {
    console.error('Error adding artwork:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * PUT /api/artworks/:id
 * Protected: Updates existing artwork
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (isMongoReady()) {
      const updated = await Artwork.findByIdAndUpdate(id, updateData, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Artwork not found' });
      }
      return res.json({ success: true, artwork: updated });
    } else {
      const items = getFallbackData();
      const idx = items.findIndex(a => a.id === id || a._id === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Artwork not found' });
      }
      items[idx] = { ...items[idx], ...updateData };
      saveFallbackData(items);
      return res.json({ success: true, artwork: items[idx] });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * DELETE /api/artworks/:id
 * Protected: Deletes artwork and unlinks its WebP file from disk to save VPS space
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    let artworkToDelete = null;

    if (isMongoReady()) {
      artworkToDelete = await Artwork.findByIdAndDelete(id);
    } else {
      const items = getFallbackData();
      const idx = items.findIndex(a => a.id === id || a._id === id);
      if (idx !== -1) {
        artworkToDelete = items[idx];
        items.splice(idx, 1);
        saveFallbackData(items);
      }
    }

    if (!artworkToDelete) {
      return res.status(404).json({ success: false, message: 'Artwork not found' });
    }

    // Clean up WebP image file if stored locally in /uploads
    if (artworkToDelete.image && artworkToDelete.image.startsWith('/uploads/')) {
      const filename = path.basename(artworkToDelete.image);
      const filePath = path.join(uploadsDir, filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (unlinkErr) {
          console.warn('Could not delete WebP file:', unlinkErr.message);
        }
      }
    }

    res.json({
      success: true,
      message: `Artwork "${artworkToDelete.title}" deleted and disk space reclaimed.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/artworks/reset
 * Protected: Restores defaults
 */
router.post('/reset', authMiddleware, async (req, res) => {
  try {
    if (isMongoReady()) {
      await Artwork.deleteMany({});
      await Artwork.insertMany(DEFAULT_ARTWORKS);
    }
    saveFallbackData([...DEFAULT_ARTWORKS]);
    res.json({
      success: true,
      artworks: DEFAULT_ARTWORKS,
      message: 'Portfolio restored to default collection',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
