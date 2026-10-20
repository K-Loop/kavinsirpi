import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronRight, ChevronLeft, Pause, Play, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useArtworks } from '../context/ArtworksContext';

export default function HeroSection() {
  const { theme } = useTheme();
  const { artworks } = useArtworks();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayIntervalRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const displayArtworks = artworks.length > 0 ? artworks : [];
  const totalWorks = displayArtworks.length;
  const safeIndex = totalWorks > 0 ? Math.min(currentIndex, totalWorks - 1) : 0;
  const currentArtwork = displayArtworks[safeIndex];

  const handleNext = useCallback(() => {
    if (totalWorks <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalWorks);
  }, [totalWorks]);

  const handlePrev = useCallback(() => {
    if (totalWorks <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalWorks) % totalWorks);
  }, [totalWorks]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Auto Slider Timer: advances every 4.5 seconds when not paused and not hovered
  useEffect(() => {
    if (isPlaying && !isHovered) {
      autoPlayIntervalRef.current = setInterval(() => {
        handleNext();
      }, 4500);
    }
    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [isPlaying, isHovered, handleNext]);

  // Keyboard navigation when interacting with hero card
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      handleNext();
    } else if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === ' ') {
      e.preventDefault();
      setIsPlaying((prev) => !prev);
    }
  };

  // Mobile Touch Swipe Handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    if (Math.abs(swipeDistance) > 45) {
      if (swipeDistance > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-center bg-[#0a0a0d] pt-32 pb-16 sm:pt-36 sm:pb-20 lg:pt-36 lg:pb-16 overflow-hidden"
    >
      {/* Background Architectural Texture Grid */}
      <div className="absolute inset-0 bg-concrete-pattern opacity-40 pointer-events-none" />

      {/* Main Split Grid Layout */}
      <div className="relative w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center my-auto">

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

          {/* Main Headline in Display Typography */}
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
              href="#artworks"
              style={{ backgroundColor: theme.accent }}
              className="inline-flex items-center justify-center gap-2 hover:brightness-110 text-[#0b0b0e] font-semibold text-xs tracking-[0.2em] uppercase px-7 py-4 rounded-full transition-all duration-300 shadow-xl"
            >
              <span>EXPLORE ARTWORKS</span>
              <ChevronRight className="w-4 h-4" />
            </a>

            {/* Secondary CTA */}
            <a
              href="#artist"
              className="inline-flex items-center justify-center gap-2 border border-[#302e3b] hover:border-[#d48b4e] text-[#eee7dc] hover:text-[#fbf8f3] font-medium text-xs tracking-[0.2em] uppercase px-7 py-4 rounded-full transition-all duration-300 bg-[#141318]/60 hover:bg-[#1a1922]"
            >
              <span>THE ARTIST</span>
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

        {/* Right Column: Hero Real Sculpture Interactive Auto-Slider Carousel */}
        <div className="lg:col-span-6 relative order-1 lg:order-2 flex flex-col items-center justify-center w-full">
          
          {/* Main Card Container */}
          <div
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[420px] aspect-[3/4] max-h-[66vh] rounded-lg overflow-hidden border border-[#2b2836] shadow-2xl group bg-[#121117] select-none focus:outline-none focus:ring-1 focus:ring-[#d48b4e]/40"
            aria-label="Artworks Showcase Carousel"
          >
            {/* Artworks Image Stack with Smooth Cross-Fade Transition */}
            {displayArtworks.map((art, idx) => {
              const isCurrent = idx === safeIndex;
              // Render current and adjacent images for preloading and smooth cross-fade
              const isAdjacent =
                Math.abs(idx - currentIndex) === 1 ||
                (currentIndex === 0 && idx === totalWorks - 1) ||
                (currentIndex === totalWorks - 1 && idx === 0);

              if (!isCurrent && !isAdjacent) return null;

              return (
                <div
                  key={art.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    isCurrent ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
                  }`}
                >
                  <img
                    src={art.image}
                    alt={art.title}
                    className={`w-full h-full object-cover object-center transform transition-transform duration-1000 ease-out ${
                      isCurrent && isHovered ? 'scale-103' : 'scale-100'
                    }`}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    onError={(e) => {
                      if (!e.currentTarget.dataset.triedFallback) {
                        e.currentTarget.dataset.triedFallback = 'true';
                        if (art.image && art.image.includes('/uploads/')) {
                          const base = art.image.split('/uploads/').pop().replace(/\.webp$/, '.jpeg');
                          e.currentTarget.src = `/images/crafts/${base}`;
                        }
                      }
                    }}
                  />
                </div>
              );
            })}

            {/* Subtle Gradient Overlays for Readability and Depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0d] via-transparent to-[#0a0a0d]/30 opacity-70 pointer-events-none z-20" />

            {/* Top Info Bar: Category Chip, Auto-Play Toggle & Slide Counter */}
            <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 flex items-center justify-between z-30 pointer-events-auto">
              {/* Category Badge */}
              <div className="bg-[#0a0a0e]/85 backdrop-blur-md border border-[#2b2836] px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                <Sparkles className="w-3 h-3" style={{ color: theme.accent }} />
                <span
                  className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-medium"
                  style={{ color: theme.accent }}
                >
                  {currentArtwork.category}
                </span>
              </div>

              {/* Counter & Play/Pause Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  title={isPlaying ? "Pause auto-slider" : "Resume auto-slider"}
                  aria-label={isPlaying ? "Pause carousel" : "Play carousel"}
                  className="w-7 h-7 rounded-full bg-[#0a0a0e]/85 hover:bg-[#1a1922] backdrop-blur-md border border-[#2b2836] text-[#b8ad9c] hover:text-[#fbf8f3] flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                >
                  {isPlaying ? (
                    <Pause className="w-3 h-3" />
                  ) : (
                    <Play className="w-3 h-3 translate-x-0.5 text-[#d48b4e]" />
                  )}
                </button>

                <div className="bg-[#0a0a0e]/85 backdrop-blur-md border border-[#2b2836] px-2.5 py-1 rounded-full text-[10px] tracking-widest font-mono text-[#dcd4c6] shadow-lg">
                  <span className="text-[#fbf8f3] font-semibold">
                    {String(currentIndex + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[#6d665b] mx-1">/</span>
                  <span className="text-[#8c8475]">
                    {String(totalWorks).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>

            {/* Manual Slide Navigation Arrows */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous artwork"
              className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0a0a0e]/75 hover:bg-[#16151e] backdrop-blur-md border border-[#2b2836] hover:border-[#d48b4e]/70 text-[#eee7dc] hover:text-[#fbf8f3] flex items-center justify-center transition-all duration-300 opacity-80 sm:opacity-0 group-hover:opacity-100 z-30 shadow-xl hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next artwork"
              className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0a0a0e]/75 hover:bg-[#16151e] backdrop-blur-md border border-[#2b2836] hover:border-[#d48b4e]/70 text-[#eee7dc] hover:text-[#fbf8f3] flex items-center justify-center transition-all duration-300 opacity-80 sm:opacity-0 group-hover:opacity-100 z-30 shadow-xl hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Auto-Slide Dynamic Progress Line (resets and fills on each slide) */}
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1a1924] z-30 overflow-hidden">
              <div
                key={currentIndex + (isPlaying && !isHovered ? '-playing' : '-paused')}
                style={{
                  backgroundColor: theme.accent,
                  animation: isPlaying && !isHovered ? 'heroProgress 4.5s linear forwards' : 'none',
                  width: isPlaying && !isHovered ? undefined : '0%'
                }}
                className="h-full"
              />
            </div>

            {/* Artwork Overlay Badge with Live Information */}
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-[#0a0a0e]/92 backdrop-blur-md border border-[#2b2836] px-3.5 py-3 rounded text-left z-30 transition-all duration-300 shadow-2xl">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <span
                    className="text-[9px] uppercase tracking-[0.25em] block mb-0.5 font-medium truncate"
                    style={{ color: theme.accent }}
                  >
                    ARTWORK {currentIndex + 1} OF {totalWorks} • {currentArtwork.category.toUpperCase()}
                  </span>
                  <p className="text-xs sm:text-[13px] font-display font-medium text-[#fbf8f3] tracking-wide truncate">
                    {currentArtwork.title}
                  </p>
                  <p className="text-[10px] text-[#9e9488] font-light truncate mt-0.5">
                    {currentArtwork.medium} • {currentArtwork.dimensions}
                  </p>
                </div>

                <a
                  href="#artworks"
                  title="View full artwork portfolio"
                  className="flex-shrink-0 text-[10px] uppercase tracking-wider font-medium text-[#c4b9a7] hover:text-[#fbf8f3] underline decoration-[#d48b4e]/60 underline-offset-4 self-center ml-1"
                >
                  EXPLORE
                </a>
              </div>
            </div>

            {/* Corner Architectural Accents */}
            <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[#d48b4e]/40 pointer-events-none z-30" />
            <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[#d48b4e]/40 pointer-events-none z-30" />
            <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[#d48b4e]/40 pointer-events-none z-30" />
            <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[#d48b4e]/40 pointer-events-none z-30" />
          </div>

          {/* Quick Slider Thumbnails / Dots Strip under Hero Card */}
          <div className="w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[460px] mt-4 flex items-center justify-between px-1">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#8c8475]">
              AUTO-SLIDING SHOWCASE
            </span>
            <div className="flex items-center gap-1.5 overflow-hidden">
              {displayArtworks.slice(0, 8).map((art, i) => {
                const isActive = i === safeIndex;
                return (
                  <button
                    key={art.id}
                    type="button"
                    onClick={() => goToSlide(i)}
                    aria-label={`Go to artwork ${i + 1}`}
                    style={isActive ? { backgroundColor: theme.accent } : {}}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'w-6 shadow-sm'
                        : 'w-2 bg-[#2d2a38] hover:bg-[#464155]'
                    }`}
                  />
                );
              })}
              {totalWorks > 8 && (
                <span className="text-[9px] text-[#716a5f] font-mono ml-0.5">
                  +{totalWorks - 8}
                </span>
              )}
            </div>
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

