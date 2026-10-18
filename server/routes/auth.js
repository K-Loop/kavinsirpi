import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const router = express.Router();

// Helper to get auto credentials from .env
const getEnvCredentials = () => {
  return {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'kavinsirpi@2026',
  };
};

/**
 * GET /api/auth/credentials-info
 * Returns the auto credentials configured in .env so the admin page can display them or provide auto-fill
 */
router.get('/credentials-info', (req, res) => {
  const envCreds = getEnvCredentials();
  res.json({
    success: true,
    autoCredentials: {
      username: envCreds.username,
      password: envCreds.password,
    },
    message: 'Auto credentials ready from backend environment',
  });
});

/**
 * POST /api/auth/login
 * Authenticates admin and returns JWT token
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      });
    }

    const cleanUser = username.trim().toLowerCase();
    const envCreds = getEnvCredentials();

    let isAuthenticated = false;
    let userRole = 'admin';

    // 1. Check against .env auto credentials
    if (cleanUser === envCreds.username.toLowerCase() && password === envCreds.password) {
      isAuthenticated = true;
    } else {
      // 2. Check against MongoDB User collection (if database is connected)
      try {
        const user = await User.findOne({ username: cleanUser });
        if (user) {
          const isMatch = await user.comparePassword(password);
          if (isMatch) {
            isAuthenticated = true;
            userRole = user.role || 'admin';
          }
        }
      } catch (dbErr) {
        // Fallback continues
      }
    }

    if (!isAuthenticated) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify username and password.',
      });
    }

    // Generate JWT token
    const secret = process.env.JWT_SECRET || 'kavin_sirpi_secret_key_2026_fallback';
    const token = jwt.sign(
      {
        username: cleanUser,
        role: userRole,
      },
      secret,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      user: {
        username: cleanUser,
        role: userRole,
      },
      message: 'Authentication successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication',
    });
  }
});

/**
 * GET /api/auth/verify
 * Validates existing JWT token
 */
router.get('/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, authenticated: false });
  }

  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET || 'kavin_sirpi_secret_key_2026_fallback';
    const decoded = jwt.verify(token, secret);
    return res.json({
      success: true,
      authenticated: true,
      user: {
        username: decoded.username,
        role: decoded.role,
      },
    });
  } catch (err) {
    return res.status(401).json({ success: false, authenticated: false });
  }
});

export default router;
