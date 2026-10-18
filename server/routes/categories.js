import express from 'express';
import mongoose from 'mongoose';
import { Category } from '../models/Category.js';
import { authMiddleware } from '../middleware/auth.js';
import { DEFAULT_CATEGORIES } from '../data/defaultArtworks.js';

const router = express.Router();
const isMongoReady = () => mongoose.connection.readyState === 1;

/**
 * GET /api/categories
 * Returns all artwork categories
 */
router.get('/', async (req, res) => {
  try {
    if (isMongoReady()) {
      const dbCategories = await Category.find().sort({ order: 1, createdAt: 1 });
      if (dbCategories.length > 0) {
        const names = dbCategories.map(c => c.name);
        // Ensure "All Works" is first
        const allNames = Array.from(new Set(['All Works', ...names]));
        return res.json({ success: true, categories: allNames });
      }
      // Seed default categories
      try {
        const docs = DEFAULT_CATEGORIES.map((name, index) => ({ name, order: index }));
        await Category.insertMany(docs);
        return res.json({ success: true, categories: DEFAULT_CATEGORIES });
      } catch (e) {}
    }
    res.json({ success: true, categories: DEFAULT_CATEGORIES });
  } catch (error) {
    res.json({ success: true, categories: DEFAULT_CATEGORIES });
  }
});

/**
 * POST /api/categories
 * Protected: Adds a new category
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }
    const cleanName = name.trim();

    if (isMongoReady()) {
      const existing = await Category.findOne({ name: cleanName });
      if (existing) {
        return res.json({ success: true, category: existing.name });
      }
      const newCat = new Category({ name: cleanName });
      await newCat.save();
      return res.status(201).json({ success: true, category: cleanName });
    }

    res.status(201).json({ success: true, category: cleanName });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
