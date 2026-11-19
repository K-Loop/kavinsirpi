import React, { useState, useEffect } from 'react';
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
  const [introDismissed, setIntroDismissed] = useState(true);

  // When switching back from admin view to main site, always skip intro
  useEffect(() => {
    if (!isAdminView) {
      setIntroDismissed(true);
    }
  }, [isAdminView]);

  // If user navigated to /admin or clicked /admin in navigation, render fast Admin Portal
  if (isAdminView) {
    return <AdminPortal />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#d48b4e]/30 selection:text-[#fbf8f3]">
      {/* Cinematic Splash Screen (plays once per session, skippable) */}
      {!introDismissed && (
        <IntroSplash
          onComplete={() => {
            setIntroDismissed(true);
          }}
        />
      )}

      {/* Main Website Navigation (Frosted Glass, hides on scroll down) */}
      <Navigation />
      
      {/* Main Editorial Showcase Sections */}
      <main className="flex-grow">
        {/* 1. Hero Section (At top of page - accessible by scrolling UP) */}
        <HeroSection />

        {/* 2. Interactive Swipeable Artwork Gallery (Primary destination on open) */}
        <ArtworkGallery />

        {/* 3. The Master Sculptor About Section */}
        <AboutArtist />
      </main>

      {/* Luxury Atelier Footer */}
      <Footer />

      {/* Interactive Studio Palette Switcher */}
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
