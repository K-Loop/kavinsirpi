import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ArtworksProvider, useArtworks } from './context/ArtworksContext';
import IntroSplash from './components/IntroSplash';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import ArtworkGallery from './components/ArtworkGallery';
import AboutArtist from './components/AboutArtist';
import Footer from './components/Footer';
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton';
import PaletteSwitcher from './components/PaletteSwitcher';
import AdminPortal from './components/admin/AdminPortal';

function AppContent() {
  const { isAdminView } = useArtworks();

  // If user navigated to /admin or clicked /admin in navigation, render fast Admin Portal
  if (isAdminView) {
    return <AdminPortal />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#d48b4e]/30 selection:text-[#fbf8f3]">
      {/* Cinematic Splash Screen (plays once per session, skippable) */}
      <IntroSplash onComplete={() => {}} />

      {/* Main Website Navigation */}
      <Navigation />
      
      {/* Main Editorial Showcase Sections: Hero, Artworks, Artist, Footer */}
      <main className="flex-grow">
        <HeroSection />
        <ArtworkGallery />
        <AboutArtist />
      </main>

      {/* Luxury Atelier Footer */}
      <Footer />

      {/* Interactive Studio Palette Switcher (allows live preview of different palettes) */}
      <PaletteSwitcher />

      {/* Floating WhatsApp Action Button */}
      <WhatsAppFloatingButton />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ArtworksProvider>
        <AppContent />
      </ArtworksProvider>
    </ThemeProvider>
  );
}
