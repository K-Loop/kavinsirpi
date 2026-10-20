import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import artworksRoutes from './routes/artworks.js';
import categoriesRoutes from './routes/categories.js';
import { User } from './models/User.js';

dotenv.config();

// Configure Google DNS (8.8.8.8, 8.8.4.4) for MongoDB Atlas SRV connection reliability
export const configureGoogleDns = () => {
  try {
    const rawDns = process.env.DNS_SERVERS || '8.8.8.8,8.8.4.4';
    const servers = rawDns.split(',').map((s) => s.trim()).filter(Boolean);
    dns.setServers(servers);
    console.log(`[DNS] Configured Google DNS servers: ${servers.join(', ')}`);
  } catch (err) {
    console.warn('[DNS] Warning setting DNS servers:', err.message);
  }
};
configureGoogleDns();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Ensure uploads folder exists
const uploadsDir = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(
  cors({
    origin: '*', // Allow Vite frontend in dev & VPS domain in production
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Serve compressed WebP uploaded photos statically
app.use('/uploads', express.static(uploadsDir));

// Serve root public folder if frontend images are requested through backend
const clientPublicDir = path.resolve(__dirname, '../public');
if (fs.existsSync(clientPublicDir)) {
  app.use('/images', express.static(path.join(clientPublicDir, 'images')));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'healthy',
    mongoStatus,
    timestamp: new Date().toISOString(),
    vpsStorageOptimized: true,
  });
});

// VPS 4GB Storage Monitor endpoint
app.get('/api/stats', (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    let totalSizeBytes = 0;
    let webpCount = 0;

    files.forEach((file) => {
      if (file.endsWith('.webp')) {
        webpCount++;
      }
      const stat = fs.statSync(path.join(uploadsDir, file));
      totalSizeBytes += stat.size;
    });

    const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(2);
    // 4GB VPS total capacity = 4096 MB
    const vpsTotalMB = 4096;
    const vpsPercentUsed = ((parseFloat(totalSizeMB) / vpsTotalMB) * 100).toFixed(3);

    res.json({
      success: true,
      storage: {
        webpPhotosCount: webpCount,
        usedBytes: totalSizeBytes,
        usedMB: totalSizeMB,
        vpsTotalMB,
        vpsPercentUsed: `${vpsPercentUsed}%`,
        status: parseFloat(totalSizeMB) < 2000 ? 'Optimal (Well within 4GB VPS)' : 'Attention',
        format: 'Google WebP (Quality 82)',
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/artworks', artworksRoutes);
app.use('/api/categories', categoriesRoutes);

// Seed admin credentials into MongoDB if connected
const seedAdminUser = async () => {
  try {
    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'kavinsirpi@2026';
    const existing = await User.findOne({ username: adminUser.toLowerCase() });
    if (!existing) {
      await User.create({
        username: adminUser.toLowerCase(),
        password: adminPass,
        role: 'admin',
      });
      console.log(`[Seed] Auto credentials seeded for admin: ${adminUser}`);
    }
  } catch (e) {
    console.warn('[Seed] Could not auto-seed admin:', e.message);
  }
};

import { autoSeedArtworksAndPhotos } from './services/seedService.js';

// Database Connection with graceful fallback and Google DNS resolution
const connectMongo = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kavinsirpi';
  try {
    configureGoogleDns();
    console.log(`Attempting connection to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected successfully!');
    await seedAdminUser();
    await autoSeedArtworksAndPhotos();
  } catch (error) {
    console.warn(
      `MongoDB connection note: ${error.message}. Running with robust fallback data store. (Will auto-connect once MongoDB is started).`
    );
    await autoSeedArtworksAndPhotos();
  }
};

// Start Server
app.listen(PORT, async () => {
  console.log(`===============================================`);
  console.log(`  Kavin Sirpi Atelier Backend Server`);
  console.log(`  PORT: ${PORT}`);
  console.log(`  Auto Credentials: ${process.env.ADMIN_USERNAME || 'admin'} / ${process.env.ADMIN_PASSWORD || 'kavinsirpi@2026'}`);
  console.log(`  WebP Compression Engine: Active (Sharp Quality 82)`);
  console.log(`  VPS 4GB Storage Mode: Enabled`);
  console.log(`===============================================`);
  await connectMongo();
});
