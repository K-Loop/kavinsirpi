import React, { useState, useRef, useEffect, useCallback } from 'react';
import ProjectLightbox from './ProjectLightbox';
import { useTheme } from '../context/ThemeContext';
import { useArtworks } from '../context/ArtworksContext';
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Filter,
  LayoutGrid,
  Film,
  Sparkles,
  Maximize2,
  MoveHorizontal
} from 'lucide-react';

export default function ArtworkGallery() {
  const { theme } = useTheme();
  const { artworks, categories } = useArtworks();
  const [selectedCategory, setSelectedCategory] = useState("All Works");
  const [activeArtworkIndex, setActiveArtworkIndex] = useState(null);
  const [hoveredArtwork, setHoveredArtwork] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // Default to 'grid' (Album Grid) | 'spotlight' (Swipe Reel)
  const [carouselIsHovered, setCarouselIsHovered] = useState(false);
  const hasAutoOpenedRef = useRef(false);

  // Drag-to-swipe & progress state for the horizontal reel
  const [isDragging, setIsDragging] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);
  const hasDragged = useRef(false);

  const filteredArtworks = (selectedCategory === "All Works"
    ? artworks
    : artworks.filter(art => art.category === selectedCategory)
  ).slice().sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));

  // Automatically open the full-screen gallery viewer directly when the website link is opened
  useEffect(() => {
    if (!hasAutoOpenedRef.current && filteredArtworks.length > 0) {
      hasAutoOpenedRef.current = true;
      setActiveArtworkIndex(0);
    }
  }, [filteredArtworks.length]);

  const activeArtwork = activeArtworkIndex !== null ? filteredArtworks[activeArtworkIndex] : null;

  const handlePrev = () => {
    if (activeArtworkIndex > 0) {
      setActiveArtworkIndex(activeArtworkIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeArtworkIndex < filteredArtworks.length - 1) {
      setActiveArtworkIndex(activeArtworkIndex + 1);
    }
  };

  const categoriesRef = useRef(null);
  const bigCarouselRef = useRef(null);

  const scrollCategories = (direction) => {
    if (categoriesRef.current) {
      const scrollAmount = 260;
      categoriesRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollBigCarousel = (direction) => {
    setHasInteracted(true);
    if (bigCarouselRef.current) {
      const cardStep = Math.min(bigCarouselRef.current.clientWidth * 0.8, 420);
      bigCarouselRef.current.scrollBy({
        left: direction === 'left' ? -cardStep : cardStep,
        behavior: 'smooth'
      });
    }
  };

  // Track horizontal scroll position to update live counter & progress bar
  const handleCarouselScroll = useCallback(() => {
    const el = bigCarouselRef.current;
    if (!el || filteredArtworks.length === 0) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setScrollPercent(100);
      setCurrentSlide(1);
      return;
    }

    const ratio = Math.min(1, Math.max(0, el.scrollLeft / maxScroll));
    setScrollPercent(Math.round(ratio * 100));

    const estimatedIndex = Math.round(ratio * (filteredArtworks.length - 1)) + 1;
    setCurrentSlide(Math.min(filteredArtworks.length, Math.max(1, estimatedIndex)));

    if (el.scrollLeft > 20) {
      setHasInteracted(true);
    }
  }, [filteredArtworks.length]);

  // Reset carousel scroll when category changes
  useEffect(() => {
    if (bigCarouselRef.current) {
      bigCarouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
    setCurrentSlide(1);
    setScrollPercent(0);
  }, [selectedCategory, viewMode]);

  // Desktop mouse drag-to-swipe handlers
  const handleMouseDown = (e) => {
    if (!bigCarouselRef.current) return;
    setIsDragging(true);
    setHasInteracted(true);
    hasDragged.current = false;
    dragStartX.current = e.pageX - bigCarouselRef.current.offsetLeft;
    dragScrollLeft.current = bigCarouselRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !bigCarouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - bigCarouselRef.current.offsetLeft;
    const walk = (x - dragStartX.current) * 1.45;
    if (Math.abs(walk) > 6) {
      hasDragged.current = true;
    }
    bigCarouselRef.current.scrollLeft = dragScrollLeft.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
    setCarouselIsHovered(false);
    setHoveredArtwork(null);
  };

  // Gentle auto-nudge / auto-scroll when idle and not hovered or dragged
  useEffect(() => {
    if (carouselIsHovered || isDragging || viewMode !== 'spotlight') return;
    const interval = setInterval(() => {
      if (bigCarouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = bigCarouselRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          bigCarouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          bigCarouselRef.current.scrollBy({ left: 380, behavior: 'smooth' });
        }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselIsHovered, isDragging, filteredArtworks, viewMode]);

  const scrollUpToHero = () => {
    const heroEl = document.getElementById('hero');
    if (heroEl) {
      heroEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section id="artworks" className="relative pt-20 pb-24 sm:pt-24 sm:pb-28 bg-[#0a0a0d] border-t border-[#181722] overflow-hidden">
      <div className="absolute inset-0 bg-concrete-pattern opacity-25 pointer-events-none" />
      <div
        className="absolute top-24 left-1/2 -translate-x-1/2 w-[680px] h-[260px] rounded-full blur-[150px] pointer-events-none opacity-15"
        style={{ background: theme.accent }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        {/* Prominent Scroll Up to Hero Bar (Since website lands directly on Gallery) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-7 border-b border-[#1f1d2a]">
          <button
            type="button"
            onClick={scrollUpToHero}
            className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#14131b]/90 hover:bg-[#1e1c29] border border-[#2d2a3b] hover:border-[#d48b4e] text-[11px] uppercase tracking-[0.18em] text-[#ded3c1] hover:text-[#fbf8f3] transition-all shadow-lg backdrop-blur-md"
          >
            <ChevronUp className="w-4 h-4 text-[#d48b4e] animate-bounce group-hover:-translate-y-0.5 transition-transform" />
            <span>Scroll Up to Atelier Hero & Story</span>
          </button>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121118] border border-[#242230] text-[11px] text-[#a9a296]">
            <Sparkles className="w-3.5 h-3.5" style={{ color: theme.accent }} />
            <span>{artworks.length}+ Handcrafted Cement Reliefs</span>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8 text-left">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 mb-2.5">
              <span className="w-5 h-[1px]" style={{ backgroundColor: theme.accent }} />
              <span
                className="text-[11px] uppercase tracking-[0.25em] font-medium"
                style={{ color: theme.accent }}
              >
                INTERACTIVE RELIEF GALLERY
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal text-[#fbf8f3] tracking-wide mb-2.5">
              Masterworks of Cement Relief
            </h2>
            <p className="font-editorial text-sm sm:text-base md:text-lg text-[#b8ad9c] leading-relaxed">
              Swipe through our real on-site sculptures. Tap any artwork to view full size and craftsmanship details.
            </p>
          </div>

          {/* View Mode Switcher & Quick Dropdown Filter */}
          <div className="flex items-center gap-2.5 self-start lg:self-end flex-shrink-0">
            <div className="flex items-center bg-[#121118] border border-[#242230] rounded-full p-1 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                style={viewMode === 'grid' ? { backgroundColor: `${theme.accent}25`, color: theme.accent } : {}}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all ${
                  viewMode === 'grid'
                    ? 'font-semibold'
                    : 'text-[#8c8475] hover:text-[#ded3c1]'
                }`}
                title="Album Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Album Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('spotlight')}
                style={viewMode === 'spotlight' ? { backgroundColor: `${theme.accent}25`, color: theme.accent } : {}}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all ${
                  viewMode === 'spotlight'
                    ? 'font-semibold'
                    : 'text-[#8c8475] hover:text-[#ded3c1]'
                }`}
                title="Swipeable Showcase Reel"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Swipe Reel</span>
              </button>
            </div>

            <div className="relative">
              <div className="flex items-center gap-2 bg-[#121118] border border-[#242230] hover:border-[#d48b4e]/60 rounded-full px-3 py-1.5 text-xs text-[#cfc4b2] shadow-md transition-colors">
                <Filter className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setActiveArtworkIndex(null);
                    setHoveredArtwork(null);
                  }}
                  className="bg-transparent text-[#eee7dc] uppercase text-[10px] tracking-[0.14em] focus:outline-none cursor-pointer pr-1"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#121118] text-[#eee7dc]">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Category Album Tabs */}
        <div className="mb-7 border-b border-[#1f1d2b] pb-4">
          <div className="relative flex items-center min-w-0 flex-1">
            <button
              type="button"
              onClick={() => scrollCategories('left')}
              aria-label="Scroll album categories left"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#131219] hover:bg-[#1f1d28] border border-[#262433] text-[#b8ad9c] hover:text-[#fbf8f3] transition-all flex-shrink-0 mr-2 shadow-md hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div
              ref={categoriesRef}
              className="flex items-center gap-2 overflow-x-auto scroll-smooth scrollbar-none py-1 px-0.5"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {categories.map((category) => {
                const isSelected = selectedCategory === category;
                const count = category === "All Works"
                  ? artworks.length
                  : artworks.filter(a => a.category === category).length;

                return (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setActiveArtworkIndex(null);
                      setHoveredArtwork(null);
                    }}
                    style={isSelected ? { backgroundColor: theme.accent, color: '#09090c' } : {}}
                    className={`text-xs uppercase tracking-[0.16em] px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap focus:outline-none flex-shrink-0 flex items-center gap-2 ${
                      isSelected
                        ? 'font-semibold shadow-lg scale-102'
                        : 'text-[#9e968a] hover:text-[#fbf8f3] hover:bg-[#14131b] border border-transparent hover:border-[#262433]'
                    }`}
                  >
                    <span>{category}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-[#09090c]/25 text-[#09090c]' : 'bg-[#181622] text-[#716a5f]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => scrollCategories('right')}
              aria-label="Scroll album categories right"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#131219] hover:bg-[#1f1d28] border border-[#262433] text-[#b8ad9c] hover:text-[#fbf8f3] transition-all flex-shrink-0 ml-2 shadow-md hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            PRIMARY VIEW: ATTRACTIVE SWIPEABLE SHOWCASE REEL
            Designed to immediately invite customers to swipe & drag through works!
           ========================================================================= */}
        {viewMode === 'spotlight' && (
          <div
            className="text-left relative"
            onMouseEnter={() => setCarouselIsHovered(true)}
            onMouseLeave={handleMouseUpOrLeave}
          >
            {/* Swipe Invitation Bar & Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5 px-1">
              {/* Eye-Catching Animated Swipe Cue */}
              <div
                className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full border text-xs tracking-[0.14em] uppercase transition-all duration-500 ${
                  hasInteracted
                    ? 'bg-[#14131b] border-[#282636] text-[#cfc4b2]'
                    : 'bg-[#d48b4e]/15 border-[#d48b4e]/60 text-[#f5c896] shadow-[0_0_24px_rgba(212,139,78,0.22)] animate-pulse'
                }`}
              >
                <MoveHorizontal className="w-4 h-4 flex-shrink-0" style={{ color: theme.accent }} />
                <span className="font-semibold text-[11px] sm:text-xs">
                  {hoveredArtwork
                    ? hoveredArtwork.title
                    : 'Swipe or Drag to Explore Sculptures'}
                </span>
                {!hasInteracted && (
                  <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: theme.accent }} />
                )}
              </div>

              {/* Live Slide Counter + Arrow Buttons */}
              <div className="flex items-center gap-2.5 ml-auto">
                <div className="text-[11px] font-mono text-[#a9a296] bg-[#121118] px-3.5 py-1.5 rounded-full border border-[#242230]">
                  <span className="text-[#fbf8f3] font-semibold">
                    {String(currentSlide).padStart(2, '0')}
                  </span>
                  <span className="text-[#6d665a] mx-1">/</span>
                  <span>{String(filteredArtworks.length).padStart(2, '0')}</span>
                </div>

                <button
                  type="button"
                  onClick={() => scrollBigCarousel('left')}
                  aria-label="Swipe left to previous sculptures"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#131219] hover:bg-[#1f1d28] border border-[#2a2838] hover:border-[#d48b4e] text-[#ded3c1] hover:text-[#fbf8f3] flex items-center justify-center transition-all shadow-lg hover:scale-105 active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollBigCarousel('right')}
                  aria-label="Swipe right to next sculptures"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#131219] hover:bg-[#1f1d28] border border-[#2a2838] hover:border-[#d48b4e] text-[#ded3c1] hover:text-[#fbf8f3] flex items-center justify-center transition-all shadow-lg hover:scale-105 active:scale-95"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Swipeable Horizontal Track with Card Peek & Drag-to-Scroll */}
            <div className="relative">
              <div
                ref={bigCarouselRef}
                onScroll={handleCarouselScroll}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={() => setIsDragging(false)}
                className={`flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-5 pt-2 px-1 scrollbar-none snap-x snap-mandatory ${
                  isDragging ? 'cursor-grabbing select-none' : 'cursor-grab scroll-smooth'
                }`}
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {filteredArtworks.map((artwork, index) => (
                  <div
                    key={`spotlight-${artwork.id}`}
                    onClick={() => {
                      if (!hasDragged.current) {
                        setActiveArtworkIndex(index);
                      }
                    }}
                    onMouseEnter={() => setHoveredArtwork(artwork)}
                    className="group relative flex-shrink-0 snap-center sm:snap-start w-[80vw] sm:w-[330px] md:w-[375px] lg:w-[400px] aspect-[3/4] rounded-2xl overflow-hidden border border-[#282534] hover:border-[#d48b4e] transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.65)] bg-[#121118] select-none"
                  >
                    <img
                      src={artwork.image}
                      alt={artwork.title}
                      draggable={false}
                      className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out pointer-events-none"
                      loading={index < 3 ? "eager" : "lazy"}
                      onError={(e) => {
                        if (!e.currentTarget.dataset.triedFallback) {
                          e.currentTarget.dataset.triedFallback = 'true';
                          if (artwork.image && artwork.image.includes('/uploads/')) {
                            const base = artwork.image.split('/uploads/').pop().replace(/\.webp$/, '.jpeg');
                            e.currentTarget.src = `/images/crafts/${base}`;
                          }
                        }
                      }}
                    />

                    {/* Rich bottom gradient so artwork title is always crisp & inviting */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060609] via-[#060609]/35 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300 pointer-events-none" />

                    {/* Top Category & Relief Badges */}
                    <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-1.5 flex-wrap pointer-events-none">
                      <span
                        className="text-[9px] uppercase tracking-[0.2em] font-semibold bg-[#0a0a0e]/85 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full"
                        style={{ color: theme.accent }}
                      >
                        {artwork.category}
                      </span>
                      {artwork.scale === 'monumental' && (
                        <span className="text-[8px] uppercase tracking-wider font-mono bg-[#d48b4e]/25 text-[#f7cca0] border border-[#d48b4e]/50 px-2 py-0.5 rounded-full backdrop-blur-md">
                          Hard Relief
                        </span>
                      )}
                    </div>

                    {/* Expand / Inspect Badge */}
                    <div className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-[#0a0a0e]/80 backdrop-blur-md border border-white/15 group-hover:border-[#d48b4e] text-[#ded3c1] group-hover:text-[#fbf8f3] flex items-center justify-center transition-all shadow-md group-hover:scale-110 pointer-events-none">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>

                    {/* Always-Visible Editorial Caption Card at Bottom */}
                    <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end p-5 text-left pointer-events-none">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] tracking-[0.22em] uppercase text-[#a9a296] font-mono">
                          NO. {String(index + 1).padStart(2, '0')}
                        </span>
                        {artwork.dimensions && (
                          <span className="text-[10px] text-[#b8ad9c] font-mono truncate max-w-[65%]">
                            {artwork.dimensions}
                          </span>
                        )}
                      </div>

                      <h4 className="font-display text-lg sm:text-xl font-medium text-[#fbf8f3] group-hover:text-[#f2bc88] transition-colors line-clamp-2 leading-snug mb-1.5 drop-shadow-md">
                        {artwork.title}
                      </h4>

                      <div className="flex items-center justify-between pt-2.5 mt-1 border-t border-white/10 text-[10px] uppercase tracking-[0.18em] font-medium" style={{ color: theme.accent }}>
                        <span className="inline-flex items-center gap-1.5">
                          <span>TAP TO VIEW FULL</span>
                          <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </span>
                        <span className="text-[10px] text-[#9e968a] font-mono">
                          Swipe →
                        </span>
                      </div>
                    </div>

                    {/* Subtle Inner Glow Frame */}
                    <div className="absolute inset-0 rounded-2xl border border-white/5 group-hover:border-[#d48b4e]/50 pointer-events-none transition-colors" />
                  </div>
                ))}
              </div>

              {/* Subtle Right-Edge Peek Cue (invites swiping further right) */}
              {scrollPercent < 95 && filteredArtworks.length > 2 && (
                <button
                  type="button"
                  onClick={() => scrollBigCarousel('right')}
                  aria-label="Swipe right for more sculptures"
                  className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-[#0a0a0d]/85 hover:bg-[#1a1824] backdrop-blur-xl border border-[#d48b4e]/60 text-[#f2bc88] items-center justify-center shadow-[0_0_25px_rgba(0,0,0,0.8)] hover:scale-110 transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Live Swipe Progress Bar */}
            <div className="mt-4 flex items-center gap-4 px-1">
              <div className="flex-1 h-1.5 bg-[#191722] rounded-full overflow-hidden border border-[#252332]">
                <div
                  className="h-full rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${Math.max(8, scrollPercent)}%`,
                    backgroundColor: theme.accent
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className="text-[11px] uppercase tracking-[0.16em] text-[#a9a296] hover:text-[#f2bc88] transition-colors whitespace-nowrap"
              >
                View All ({filteredArtworks.length}) →
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECONDARY VIEW: PHONE GALLERY / ALBUM PHOTO GRID
           ========================================================================= */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {filteredArtworks.map((artwork, index) => {
              return (
                <div
                  key={`album-${artwork.id}`}
                  onClick={() => setActiveArtworkIndex(index)}
                  onMouseEnter={() => setHoveredArtwork(artwork)}
                  onMouseLeave={() => setHoveredArtwork(null)}
                  className="group relative overflow-hidden rounded-xl bg-[#121118] border border-[#22202d] hover:border-[#d48b4e]/80 transition-all duration-500 shadow-xl cursor-pointer select-none aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4]"
                >
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="w-full h-full object-cover object-center transform group-hover:scale-106 transition-transform duration-700 ease-out"
                    loading="lazy"
                    onError={(e) => {
                      if (!e.currentTarget.dataset.triedFallback) {
                        e.currentTarget.dataset.triedFallback = 'true';
                        if (artwork.image && artwork.image.includes('/uploads/')) {
                          const base = artwork.image.split('/uploads/').pop().replace(/\.webp$/, '.jpeg');
                          e.currentTarget.src = `/images/crafts/${base}`;
                        }
                      }
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#060608]/90 via-[#060608]/20 to-transparent opacity-55 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none" />

                  <div className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-[#08080c]/75 backdrop-blur-md border border-[#2a2838] group-hover:border-[#d48b4e] text-[#ded3c1] group-hover:text-[#fbf8f3] flex items-center justify-center opacity-75 group-hover:opacity-100 transition-all shadow-md group-hover:scale-110">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>

                  <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] uppercase tracking-[0.2em] font-medium bg-[#08080c]/80 backdrop-blur-md border border-[#252332] text-[#cfc4b2] px-2 py-0.5 rounded">
                      {artwork.category}
                    </span>
                    {artwork.scale === 'monumental' && (
                      <span className="text-[8px] uppercase tracking-wider font-mono bg-[#d48b4e]/20 text-[#f2bc88] border border-[#d48b4e]/40 px-1.5 py-0.5 rounded backdrop-blur-md">
                        Hard Relief
                      </span>
                    )}
                  </div>

                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-4 sm:p-5 text-left pointer-events-none">
                    <span className="text-[9px] tracking-[0.2em] uppercase text-[#9e968a] font-mono mb-1 block">
                      NO. {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-display text-sm sm:text-base font-medium text-[#fbf8f3] group-hover:text-[#f2bc88] transition-colors line-clamp-2 leading-snug mb-1 drop-shadow-md">
                      {artwork.title}
                    </h3>
                    <div className="flex items-center justify-between pt-2 border-t border-[#2d2a3c]/80 text-[10px] uppercase tracking-[0.16em] font-medium text-[#d48b4e] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="inline-flex items-center gap-1">
                        <span>OPEN FULL VIEW</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                  <div className="absolute inset-0 border border-white/5 group-hover:border-[#d48b4e]/40 rounded-xl pointer-events-none transition-colors" />
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {filteredArtworks.length === 0 && (
          <div className="py-20 text-center text-[#8c8475]">
            <p className="font-editorial text-lg">No artworks found in this album category.</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal Viewer */}
      <ProjectLightbox
        artwork={activeArtwork}
        allArtworks={filteredArtworks}
        currentIndex={activeArtworkIndex}
        onSelectIndex={(index) => setActiveArtworkIndex(index)}
        onClose={() => setActiveArtworkIndex(null)}
        onPrev={handlePrev}
        onNext={handleNext}
        hasPrev={activeArtworkIndex > 0}
        hasNext={activeArtworkIndex < filteredArtworks.length - 1}
      />
    </section>
  );
}
