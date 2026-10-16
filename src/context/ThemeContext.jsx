import React, { createContext, useContext, useState, useEffect } from 'react';

export const PALETTES = {
  bronze: {
    id: 'bronze',
    name: 'Burnished Bronze & Basalt',
    accent: '#d48b4e',
    accentHover: '#e7a369',
    accentLight: '#f2bc88',
    bg: '#0c0c0e',
    cardBg: '#141318',
    border: '#262430',
    textMain: '#fbf8f3',
    textMuted: '#b8ad9c',
    displayFont: 'font-display', // Marcellus
    bodyFont: 'font-body',       // Outfit
    gradientText: 'text-bronze-gradient',
  },
  champagne: {
    id: 'champagne',
    name: 'Champagne Gold & Charcoal',
    accent: '#cfa856',
    accentHover: '#e0bc6e',
    accentLight: '#ebd28f',
    bg: '#09090b',
    cardBg: '#121216',
    border: '#272733',
    textMain: '#f8f5ee',
    textMuted: '#ad9e8e',
    displayFont: 'font-display',
    bodyFont: 'font-body',
    gradientText: 'text-gold-gradient',
  },
  terracotta: {
    id: 'terracotta',
    name: 'Terracotta & Raw Umber',
    accent: '#d96e43',
    accentHover: '#e8835a',
    accentLight: '#f3a483',
    bg: '#0f0d0c',
    cardBg: '#181413',
    border: '#2c2422',
    textMain: '#fdfbf7',
    textMuted: '#bdaea7',
    displayFont: 'font-haute',   // Italiana
    bodyFont: 'font-body',       // Outfit
    gradientText: 'text-bronze-gradient',
  }
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [currentPalette, setCurrentPalette] = useState('bronze');

  useEffect(() => {
    const saved = localStorage.getItem('kavin_sirpi_palette');
    if (saved && PALETTES[saved]) {
      setCurrentPalette(saved);
    }
  }, []);

  const setPalette = (id) => {
    if (PALETTES[id]) {
      setCurrentPalette(id);
      localStorage.setItem('kavin_sirpi_palette', id);
    }
  };

  const theme = PALETTES[currentPalette];

  return (
    <ThemeContext.Provider value={{ currentPalette, setPalette, theme, palettes: PALETTES }}>
      <div className={`theme-${currentPalette} font-body min-h-screen text-[#eee7dc] bg-[${theme.bg}]`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
