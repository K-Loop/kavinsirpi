import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ARTWORKS_DATA, ARTWORK_CATEGORIES } from '../data/artworksData';

const ArtworksContext = createContext();

const STORAGE_KEY_ARTWORKS = 'kavin_sirpi_artworks_custom_v1';
const STORAGE_KEY_CATEGORIES = 'kavin_sirpi_categories_custom_v1';

export function ArtworksProvider({ children }) {
  // Load initial artworks from localStorage or fallback to default ARTWORKS_DATA
  const [artworks, setArtworks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ARTWORKS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read artworks from localStorage:', e);
    }
    return ARTWORKS_DATA;
  });

  // Load initial categories
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read categories from localStorage:', e);
    }
    return ARTWORK_CATEGORIES;
  });

  // Admin routing state
  const [isAdminView, setIsAdminView] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname === '/admin' || window.location.hash === '#admin';
    }
    return false;
  });

  // Listen to popstate and hashchange events for seamless /admin URL routing
  useEffect(() => {
    const handleUrlChange = () => {
      const isPathAdmin = window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin');
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
      window.history.pushState({}, '', '/admin');
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

  // Persist artworks
  const saveArtworks = (newList) => {
    setArtworks(newList);
    try {
      localStorage.setItem(STORAGE_KEY_ARTWORKS, JSON.stringify(newList));
    } catch (e) {
      console.error('Failed to save artworks to localStorage:', e);
    }
  };

  // Persist categories
  const saveCategories = (newCats) => {
    setCategories(newCats);
    try {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(newCats));
    } catch (e) {
      console.error('Failed to save categories to localStorage:', e);
    }
  };

  // Add new photo/artwork
  const addArtwork = ({ title, image, category, medium, dimensions, description }) => {
    const cleanTitle = (title || '').trim();
    if (!cleanTitle || !image) {
      throw new Error('Title and Image are required');
    }

    const cleanCategory = (category || 'Sacred Deities').trim();

    // Ensure category exists in list
    if (!categories.includes(cleanCategory) && cleanCategory !== 'All Works') {
      const updatedCategories = [...categories, cleanCategory];
      saveCategories(updatedCategories);
    }

    const newArtwork = {
      id: `art-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: cleanTitle,
      category: cleanCategory,
      image,
      medium: medium?.trim() || 'In-Situ Handcrafted Cement Relief',
      dimensions: dimensions?.trim() || 'Custom Architectural Feature',
      description: description?.trim() || `Authentic cement relief carving crafted on-site by Kavin Sirpi.`,
      highlights: ['Direct wall relief carving', 'Master architectural craftsmanship'],
      featured: true,
      aspect: 'portrait',
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };

    const updatedArtworks = [newArtwork, ...artworks];
    saveArtworks(updatedArtworks);
    return newArtwork;
  };

  // Delete artwork
  const deleteArtwork = (id) => {
    const updated = artworks.filter(item => item.id !== id);
    saveArtworks(updated);
  };

  // Reset to default initial portfolio
  const resetToDefaults = () => {
    saveArtworks(ARTWORKS_DATA);
    saveCategories(ARTWORK_CATEGORIES);
    localStorage.removeItem(STORAGE_KEY_ARTWORKS);
    localStorage.removeItem(STORAGE_KEY_CATEGORIES);
  };

  // Add a new custom category
  const addCategory = (catName) => {
    const clean = (catName || '').trim();
    if (clean && !categories.includes(clean)) {
      const updated = [...categories, clean];
      saveCategories(updated);
      return clean;
    }
    return null;
  };

  return (
    <ArtworksContext.Provider
      value={{
        artworks,
        categories,
        isAdminView,
        openAdmin,
        closeAdmin,
        addArtwork,
        deleteArtwork,
        resetToDefaults,
        addCategory,
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
