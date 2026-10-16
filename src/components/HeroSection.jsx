import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function HeroSection() {
  const { theme } = useTheme();

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-center bg-[#0a0a0d] pt-24 pb-16 lg:py-0 overflow-hidden"
    >
      {/* Background Architectural Texture Grid */}
      <div className="absolute inset-0 bg-concrete-pattern opacity-40 pointer-events-none" />

      {/* Main Split Grid Layout */}
      <div className="relative w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center min-h-[calc(100vh-6rem)]">

        {/* Left Column: Editorial Typography & CTAs (balanced 50% split) */}
        <div className="lg:col-span-6 flex flex-col justify-center z-10 text-left order-2 lg:order-1 pt-2 lg:pt-0">
          
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-3 mb-4 sm:mb-5">
            <span className="w-6 h-[1.5px]" style={{ backgroundColor: theme.accent }} />
            <span
              className="text-[11px] md:text-xs uppercase tracking-[0.3em] font-medium"
              style={{ color: theme.accent }}
            >
              BESPOKE CEMENT RELIEF ART
            </span>
          </div>

          {/* Main Headline in Marcellus Display Typography */}
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-normal tracking-[0.03em] leading-[1.14] text-[#fbf8f3] mb-5 sm:mb-6">
            Turning Walls Into Masterpieces.
          </h1>

          {/* Supporting Text */}
          <p className="font-editorial text-base sm:text-lg md:text-xl text-[#cfc4b2] font-normal leading-relaxed mb-6 sm:mb-8 max-w-lg">
            Handcrafted cement murals and sculptural reliefs that transform ordinary walls into extraordinary works of art.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-8 sm:mb-10">
            {/* Primary CTA */}
            <a
              href="#signature-project"
              style={{ backgroundColor: theme.accent }}
              className="inline-flex items-center justify-center gap-2 hover:brightness-110 text-[#0b0b0e] font-semibold text-xs tracking-[0.2em] uppercase px-7 py-4 rounded-full transition-all duration-300 shadow-xl"
            >
              <span>SEE TRANSFORMATION</span>
              <ChevronRight className="w-4 h-4" />
            </a>

            {/* Secondary CTA */}
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 border border-[#302e3b] hover:border-[#d48b4e] text-[#eee7dc] hover:text-[#fbf8f3] font-medium text-xs tracking-[0.2em] uppercase px-7 py-4 rounded-full transition-all duration-300 bg-[#141318]/60 hover:bg-[#1a1922]"
            >
              <span>COMMISSION A SCULPTURE</span>
            </a>
          </div>

          {/* Material & Artisanal Guarantee Badges */}
          <div className="pt-5 sm:pt-6 border-t border-[#22202a] grid grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#8c8475] mb-1">CRAFTSMANSHIP</p>
              <p className="text-xs font-medium text-[#eee7dc] tracking-wide">100% Hand-Carved On-Site</p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#8c8475] mb-1">MEDIUM</p>
              <p className="text-xs font-medium text-[#eee7dc] tracking-wide">Weatherproof Cement Relief</p>
            </div>
          </div>
        </div>

        {/* Right Column: Hero High-Resolution Real Sculpture Photograph (Perfect 1:1 Fitted Card) */}
        <div className="lg:col-span-6 relative order-1 lg:order-2 flex items-center justify-center w-full">
          
          <div className="relative w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[460px] aspect-[3/4] rounded-lg overflow-hidden border border-[#2b2836] shadow-2xl group bg-[#121117]">
            <img
              src="/images/crafts/elephant-relief-monumental-frontal.jpeg"
              alt="Monumental handcrafted 3D cement elephant relief wall sculpture by Kavin Sirpi"
              className="w-full h-full object-cover object-center transform group-hover:scale-102 transition-transform duration-1000 ease-out"
              loading="eager"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0d] via-transparent to-transparent opacity-50 pointer-events-none" />

            {/* Artwork Overlay Badge */}
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-auto bg-[#0a0a0e]/90 backdrop-blur-md border border-[#2b2836] px-3.5 py-2.5 rounded text-left max-w-xs z-10">
              <span
                className="text-[9px] uppercase tracking-[0.25em] block mb-0.5"
                style={{ color: theme.accent }}
              >
                FEATURED INSTALLATION
              </span>
              <p className="text-xs font-display font-medium text-[#fbf8f3] tracking-wide truncate">
                Monumental Frontal Tusker Relief
              </p>
              <p className="text-[10px] text-[#9e9488] font-light">
                Direct in-situ cement relief carving • 10 ft × 8 ft
              </p>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[#d48b4e]/40 pointer-events-none z-10" />
            <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[#d48b4e]/40 pointer-events-none z-10" />
            <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[#d48b4e]/40 pointer-events-none z-10" />
            <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[#d48b4e]/40 pointer-events-none z-10" />
          </div>
        </div>
      </div>

      {/* Subtle Scroll Indicator */}
      <div className="hidden lg:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-2 pointer-events-none opacity-60">
        <span className="text-[9px] tracking-[0.3em] uppercase text-[#a9a296]">SCROLL</span>
        <div className="w-[1px] h-6 bg-gradient-to-b from-[#d48b4e] to-transparent animate-pulse" />
      </div>
    </section>
  );
}
