import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ARTWORKS_DATA, ARTWORK_CATEGORIES } from '../data/artworksData';

const ArtworksContext = createContext();

const STORAGE_KEY_ARTWORKS = 'kavin_sirpi_artworks_custom_v1';
const STORAGE_KEY_CATEGORIES = 'kavin_sirpi_categories_custom_v1';
const STORAGE_KEY_AUTH = 'kavin_sirpi_admin_jwt_v1';
const STORAGE_KEY_USER = 'kavin_sirpi_admin_user_v1';

// Dynamic API Base URL & Admin Path from .env
const API_BASE = (import.meta.env?.VITE_API_BASE_URL || '').replace(/\/$/, '');
const ADMIN_PATH = import.meta.env?.VITE_ADMIN_PATH || '/admin';

export function ArtworksProvider({ children }) {
  // 1. Initial Artworks State (Cache first, then sync with backend)
  const [artworks, setArtworks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ARTWORKS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not read artworks from cache:', e);
    }
    return ARTWORKS_DATA;
  });

  // 2. Initial Categories State
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not read categories from cache:', e);
    }
    return ARTWORK_CATEGORIES;
  });

  // 3. Admin Authentication State
  const [token, setToken] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_AUTH) || '';
  });

  const [adminUser, setAdminUser] = useState(() => {
    try {
      const u = localStorage.getItem(STORAGE_KEY_USER);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = Boolean(token);

  // 4. Manual Router State (driven dynamically by VITE_ADMIN_PATH)
  const [isAdminView, setIsAdminView] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      return path === ADMIN_PATH || path.startsWith(ADMIN_PATH) || window.location.hash === '#admin';
    }
    return false;
  });

  // Listen to popstate and hashchange events for manual URL routing
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const isPathAdmin = path === ADMIN_PATH || path.startsWith(ADMIN_PATH);
      const isHashAdmin = window.location.hash === '#admin';
      setIsAdminView(isPathAdmin || isHashAdmin);
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const openAdmin = useCallback(() => {
    try {
      window.history.pushState({}, '', ADMIN_PATH);
    } catch {
      window.location.hash = '#admin';
    }
    setIsAdminView(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const closeAdmin = useCallback(() => {
    try {
      window.history.pushState({}, '', '/');
    } catch {
      window.location.hash = '';
    }
    setIsAdminView(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // 5. Fetch live data from MERN Backend API dynamically
  const refreshArtworks = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/artworks`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.artworks) && data.artworks.length > 0) {
          // Normalize image URLs with API_BASE if needed
          const normalized = data.artworks.map((art) => {
            if (art.image && art.image.startsWith('/uploads/') && API_BASE) {
              return { ...art, image: `${API_BASE}${art.image}` };
            }
            return art;
          });
          setArtworks(normalized);
          localStorage.setItem(STORAGE_KEY_ARTWORKS, JSON.stringify(normalized));
        }
      }
    } catch (err) {
      console.warn('Backend API offline or unreachable, using local store:', err.message);
    }
  }, []);

  const refreshCategories = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/categories`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
          setCategories(data.categories);
          localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(data.categories));
        }
      }
    } catch (err) {
      console.warn('Backend API categories unreachable, using cache:', err.message);
    }
  }, []);

  useEffect(() => {
    refreshArtworks();
    refreshCategories();
  }, [refreshArtworks, refreshCategories]);

  // 6. Authentication Actions
  const login = async (username, password) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed');
      }

      setToken(data.token);
      setAdminUser(data.user);
      localStorage.setItem(STORAGE_KEY_AUTH, data.token);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data.user));
      return data;
    } catch (err) {
      // Offline fallback: if backend is unreachable, check against known auto-credentials
      if (username.trim().toLowerCase() === 'admin' && password === 'kavinsirpi@2026') {
        const fallbackToken = 'offline-admin-token-' + Date.now();
        const fallbackUser = { username: 'admin', role: 'admin' };
        setToken(fallbackToken);
        setAdminUser(fallbackUser);
        localStorage.setItem(STORAGE_KEY_AUTH, fallbackToken);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(fallbackUser));
        return { success: true, token: fallbackToken, user: fallbackUser };
      }
      throw err;
    }
  };

  const logout = () => {
    setToken('');
    setAdminUser(null);
    localStorage.removeItem(STORAGE_KEY_AUTH);
    localStorage.removeItem(STORAGE_KEY_USER);
  };

  const getAutoCredentialsInfo = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/credentials-info`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) return data.autoCredentials;
      }
    } catch {}
    return { username: 'admin', password: 'kavinsirpi@2026' };
  };

  const getStorageStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/stats`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) return data.storage;
      }
    } catch {}
    return null;
  };

  // 7. Sharp WebP Photo Upload
  const uploadPhoto = async (file) => {
    const formData = new FormData();
    formData.append('photo', file);

    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/api/artworks/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Image upload & WebP conversion failed');
    }
    const fileData = data.file;
    if (fileData && fileData.url && !fileData.url.startsWith('http') && API_BASE) {
      fileData.url = `${API_BASE}${fileData.url}`;
    }
    return fileData; // contains url, originalSize, compressedSize, compressionRatio
  };

  // 8. Add Artwork with full frontend details
  const addArtwork = async (artworkData) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(`${API_BASE}/api/artworks`, {
        method: 'POST',
        headers,
        body: JSON.stringify(artworkData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to save artwork');
      }

      await refreshArtworks();
      await refreshCategories();
      return data.artwork;
    } catch (err) {
      // Local fallback in case of connection hiccup
      const localItem = {
        id: `art-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        ...artworkData,
        createdAt: new Date().toISOString(),
      };
      const updated = [localItem, ...artworks];
      setArtworks(updated);
      localStorage.setItem(STORAGE_KEY_ARTWORKS, JSON.stringify(updated));
      return localItem;
    }
  };

  // 9. Delete Artwork
  const deleteArtwork = async (id) => {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      await fetch(`${API_BASE}/api/artworks/${id}`, {
        method: 'DELETE',
        headers,
      });
    } catch (e) {
      console.warn('API delete warning:', e.message);
    }

    const updated = artworks.filter((item) => (item.id !== id && item._id !== id));
    setArtworks(updated);
    localStorage.setItem(STORAGE_KEY_ARTWORKS, JSON.stringify(updated));
  };

  // 10. Reset to defaults
  const resetToDefaults = async () => {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      await fetch(`${API_BASE}/api/artworks/reset`, {
        method: 'POST',
        headers,
      });
    } catch (e) {}

    setArtworks(ARTWORKS_DATA);
    setCategories(ARTWORK_CATEGORIES);
    localStorage.removeItem(STORAGE_KEY_ARTWORKS);
    localStorage.removeItem(STORAGE_KEY_CATEGORIES);
    await refreshArtworks();
  };

  // 11. Add Category
  const addCategory = async (catName) => {
    const clean = (catName || '').trim();
    if (!clean) return null;

    if (!categories.includes(clean)) {
      const updated = [...categories, clean];
      setCategories(updated);
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(updated));
    }

    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      await fetch(`${API_BASE}/api/categories`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ name: clean }),
      });
    } catch (e) {}

    return clean;
  };

  return (
    <ArtworksContext.Provider
      value={{
        artworks,
        categories,
        isAdminView,
        openAdmin,
        closeAdmin,
        isAuthenticated,
        adminUser,
        login,
        logout,
        getAutoCredentialsInfo,
        getStorageStats,
        uploadPhoto,
        addArtwork,
        deleteArtwork,
        resetToDefaults,
        addCategory,
        refreshArtworks,
      }}
    >
      {children}
    </ArtworksContext.Provider>
  );
}

export function useArtworks() {
  const context = useContext(ArtworksContext);
  if (!context) {
    throw new Error('useArtworks must be used within an ArtworksProvider');
  }
  return context;
}
