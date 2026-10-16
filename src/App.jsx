import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import IntroSplash from './components/IntroSplash';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import ArtworkGallery from './components/ArtworkGallery';
import SignatureProject from './components/SignatureProject';
import CraftsmanshipSection from './components/CraftsmanshipSection';
import AboutArtist from './components/AboutArtist';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton';
import PaletteSwitcher from './components/PaletteSwitcher';

export default function App() {
  const [introFinished, setIntroFinished] = useState(false);

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col font-sans selection:bg-[#d48b4e]/30 selection:text-[#fbf8f3]">
        {/* Cinematic Splash Screen (plays once per session, skippable) */}
        <IntroSplash onComplete={() => setIntroFinished(true)} />

        {/* Main Website Navigation */}
        <Navigation />
        
        {/* Main Editorial Showcase Sections */}
        <main className="flex-grow">
          <HeroSection />
          <SignatureProject />
          <ArtworkGallery />
          <CraftsmanshipSection />
          <AboutArtist />
          <ContactSection />
        </main>

        {/* Luxury Atelier Footer */}
        <Footer />

        {/* Interactive Studio Palette Switcher (allows live preview of different palettes) */}
        <PaletteSwitcher />

        {/* Floating WhatsApp Action Button */}
        <WhatsAppFloatingButton />
      </div>
    </ThemeProvider>
  );
}
