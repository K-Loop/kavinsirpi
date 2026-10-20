import React, { useState, useRef, useEffect } from 'react';
import ProjectLightbox from './ProjectLightbox';
import { useTheme } from '../context/ThemeContext';
import { useArtworks } from '../context/ArtworksContext';
import {
  Eye,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Filter,
  LayoutGrid,
  Film,
  Sparkles,
  Maximize2
} from 'lucide-react';

export default function ArtworkGallery() {
  const { theme } = useTheme();
  const { artworks, categories } = useArtworks();
  const [selectedCategory, setSelectedCategory] = useState("All Works");
  const [activeArtworkIndex, setActiveArtworkIndex] = useState(null);
  const [hoveredArtwork, setHoveredArtwork] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' (phone/album grid) | 'spotlight' (scrolling reel)
  const [carouselIsHovered, setCarouselIsHovered] = useState(false);

  const filteredArtworks = selectedCategory === "All Works"
    ? artworks
    : artworks.filter(art => art.category === selectedCategory);

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
    if (bigCarouselRef.current) {
      const scrollAmount = bigCarouselRef.current.clientWidth * 0.75;
      bigCarouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Auto-scroll the spotlight carousel smoothly every 4.5 seconds when not hovered
  useEffect(() => {
    if (carouselIsHovered || viewMode !== 'spotlight') return;
    const interval = setInterval(() => {
      if (bigCarouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = bigCarouselRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          bigCarouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          bigCarouselRef.current.scrollBy({ left: 380, behavior: 'smooth' });
        }
      }
    }, 4500);
    return () => clearInterval(interval);
  }, [carouselIsHovered, filteredArtworks, viewMode]);

  return (
    <section id="artworks" className="relative py-24 sm:py-28 bg-[#0a0a0d] border-t border-[#181722]">
      <div className="absolute inset-0 bg-concrete-pattern opacity-25 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 text-left">
          <div className="inline-flex items-center gap-3 mb-3">
            <span className="w-5 h-[1px]" style={{ backgroundColor: theme.accent }} />
            <span
              className="text-[11px] uppercase tracking-[0.25em] font-medium"
              style={{ color: theme.accent }}
            >
              PORTFOLIO SHOWCASE
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal text-[#fbf8f3] tracking-wide mb-3">
            Masterworks of Cement Relief
          </h2>
          <p className="font-editorial text-base sm:text-lg text-[#b8ad9c] leading-relaxed">
            Hand-carved directly into high-grade cement mortar in-situ. Click any artwork to view in full.
          </p>
        </div>

        {/* Windows Albums / Phone Gallery Navigation Bar */}
        <div className="mb-8 border-b border-[#1f1d2b] pb-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            
            {/* Scrollable Album Tabs */}
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
                      className={`text-xs uppercase tracking-[0.16em] px-4 py-2.5 rounded-full transition-all duration-300 whitespace-nowrap focus:outline-none flex-shrink-0 flex items-center gap-2 ${
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

            {/* View Mode Switcher & Quick Dropdown Filter */}
            <div className="flex items-center gap-2.5 self-end sm:self-auto flex-shrink-0">
              {/* Grid / Reel View Mode Toggle */}
              <div className="flex items-center bg-[#121118] border border-[#242230] rounded-full p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  style={viewMode === 'grid' ? { backgroundColor: `${theme.accent}25`, color: theme.accent } : {}}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                    viewMode === 'grid'
                      ? 'font-medium'
                      : 'text-[#8c8475] hover:text-[#ded3c1]'
                  }`}
                  title="Phone Gallery Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Album Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('spotlight')}
                  style={viewMode === 'spotlight' ? { backgroundColor: `${theme.accent}25`, color: theme.accent } : {}}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                    viewMode === 'spotlight'
                      ? 'font-medium'
                      : 'text-[#8c8475] hover:text-[#ded3c1]'
                  }`}
                  title="Spotlight Carousel View"
                >
                  <Film className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Spotlight Reel</span>
                </button>
              </div>

              {/* Quick Category Select */}
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
        </div>

        {/* Album Summary Sub-bar */}
        <div className="flex items-center justify-between mb-6 px-1 text-left">
          <div className="flex items-center gap-2 text-xs text-[#8c8475]">
            <span className="font-mono">{filteredArtworks.length} {filteredArtworks.length === 1 ? 'Artwork' : 'Artworks'}</span>
            <span>•</span>
            <span className="text-[#a9a296]">{selectedCategory}</span>
            <span>•</span>
            <span className="text-[11px] text-[#716a5f] hidden sm:inline">Hover/tap photo for details, click to expand gallery</span>
          </div>
          <span className="text-[11px] uppercase tracking-[0.18em] font-mono text-[#8c8475] hidden md:inline">
            Direct In-Situ Wall Reliefs
          </span>
        </div>

        {/* =========================================================================
            VIEW 1: PHONE GALLERY / WINDOWS ALBUM PHOTO GRID
            Pure, edge-to-edge photography. NO bulky text cards underneath!
            Hover or tap shows the image name, category, and details overlay.
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
                  {/* High Quality Artwork Image */}
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

                  {/* Gentle Ambient Vignette (always subtle, strengthens on hover) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060608]/90 via-[#060608]/20 to-transparent opacity-40 group-hover:opacity-85 transition-opacity duration-300 pointer-events-none" />

                  {/* Corner Accent in Gallery Style */}
                  <div className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-[#08080c]/75 backdrop-blur-md border border-[#2a2838] group-hover:border-[#d48b4e] text-[#ded3c1] group-hover:text-[#fbf8f3] flex items-center justify-center opacity-75 group-hover:opacity-100 transition-all shadow-md group-hover:scale-110">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>

                  {/* Static Category Pill (Minimal, top-left) */}
                  <div className="absolute top-2.5 left-2.5 z-20">
                    <span className="text-[9px] uppercase tracking-[0.2em] font-medium bg-[#08080c]/80 backdrop-blur-md border border-[#252332] text-[#cfc4b2] px-2 py-0.5 rounded">
                      {artwork.category}
                    </span>
                  </div>

                  {/* =====================================================================
                      PHONE GALLERY / WINDOWS ALBUM OVERLAY
                      Appears smoothly on HOVER or TAP over the image!
                     ===================================================================== */}
                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-4 sm:p-5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 text-left pointer-events-none">
                    {/* Index Number */}
                    <span className="text-[9px] tracking-[0.2em] uppercase text-[#9e968a] font-mono mb-1 block">
                      NO. {String(index + 1).padStart(2, '0')}
                    </span>

                    {/* Artwork Name displayed prominently */}
                    <h3 className="font-display text-base sm:text-lg font-medium text-[#fbf8f3] group-hover:text-[#f2bc88] transition-colors line-clamp-2 leading-snug mb-1 drop-shadow-md">
                      {artwork.title}
                    </h3>

                    {/* Medium & Dimensions */}
                    <p className="text-[11px] text-[#ded3c1] font-editorial line-clamp-1 mb-2.5">
                      {artwork.medium} {artwork.dimensions ? `• ${artwork.dimensions}` : ''}
                    </p>

                    {/* Open Action Strip */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#2d2a3c]/80 text-[10px] uppercase tracking-[0.16em] font-medium text-[#d48b4e]">
                      <span className="inline-flex items-center gap-1">
                        <span>OPEN ALBUM VIEW</span>
                        <ArrowUpRight className="w-3 h-3 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </span>
                      <span className="text-[9px] text-[#8c8475] font-mono">Full Details</span>
                    </div>
                  </div>

                  {/* Subtle Frame Highlight */}
                  <div className="absolute inset-0 border border-white/5 group-hover:border-[#d48b4e]/40 rounded-xl pointer-events-none transition-colors" />
                </div>
              );
            })}
          </div>
        )}

        {/* =========================================================================
            VIEW 2: SPOTLIGHT SHOWCASE REEL
            Horizontal sliding album carousel with the same hover overlay styling!
           ========================================================================= */}
        {viewMode === 'spotlight' && (
          <div
            className="text-left"
            onMouseEnter={() => setCarouselIsHovered(true)}
            onMouseLeave={() => {
              setCarouselIsHovered(false);
              setHoveredArtwork(null);
            }}
          >
            {/* Top Reel Navigation Bar */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: theme.accent }} />
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#a9a296] font-medium">
                  {hoveredArtwork ? hoveredArtwork.title : 'Sliding Album Reel • Hover any photo to reveal details'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollBigCarousel('left')}
                  aria-label="Previous carousel artworks"
                  className="w-9 h-9 rounded-full bg-[#131219] hover:bg-[#1f1d28] border border-[#282635] hover:border-[#d48b4e] text-[#ded3c1] hover:text-[#fbf8f3] flex items-center justify-center transition-all shadow-lg hover:scale-105 active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollBigCarousel('right')}
                  aria-label="Next carousel artworks"
                  className="w-9 h-9 rounded-full bg-[#131219] hover:bg-[#1f1d28] border border-[#282635] hover:border-[#d48b4e] text-[#ded3c1] hover:text-[#fbf8f3] flex items-center justify-center transition-all shadow-lg hover:scale-105 active:scale-95"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal Track with Hover-Only Overlay */}
            <div
              ref={bigCarouselRef}
              className="flex items-stretch gap-5 overflow-x-auto scroll-smooth pb-4 pt-1 px-1 scrollbar-none"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {filteredArtworks.map((artwork, index) => (
                <div
                  key={`spotlight-${artwork.id}`}
                  onClick={() => setActiveArtworkIndex(index)}
                  onMouseEnter={() => setHoveredArtwork(artwork)}
                  className="group relative flex-shrink-0 w-[280px] sm:w-[340px] md:w-[380px] aspect-[3/4] rounded-xl overflow-hidden border border-[#23212d] hover:border-[#d48b4e] transition-all duration-500 shadow-2xl bg-[#121118] cursor-pointer select-none"
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

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060608]/95 via-[#060608]/30 to-transparent opacity-40 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none" />

                  {/* Top Category Badge */}
                  <div className="absolute top-3 left-3 z-20">
                    <span
                      className="text-[9px] uppercase tracking-[0.2em] font-medium bg-[#0a0a0e]/85 backdrop-blur-md border border-[#2b2938] px-2.5 py-1 rounded"
                      style={{ color: theme.accent }}
                    >
                      {artwork.category}
                    </span>
                  </div>

                  {/* Inspect Icon */}
                  <div className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-[#0a0a0e]/85 backdrop-blur-md border border-[#2b2938] group-hover:border-[#d48b4e] text-[#b8ad9c] group-hover:text-[#fbf8f3] flex items-center justify-center transition-all">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>

                  {/* Details Overlay on Hover */}
                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 text-left pointer-events-none">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#8c8475] font-mono mb-1 block">
                      NO. {String(index + 1).padStart(2, '0')}
                    </span>
                    <h4 className="font-display text-lg sm:text-xl font-medium text-[#fbf8f3] group-hover:text-[#f2bc88] transition-colors line-clamp-2 leading-snug mb-1.5 drop-shadow-md">
                      {artwork.title}
                    </h4>
                    <p className="text-xs text-[#cfc4b2] font-editorial leading-relaxed line-clamp-2 mb-3">
                      {artwork.medium} • {artwork.dimensions}
                    </p>
                    <div className="flex items-center justify-between pt-2.5 border-t border-[#292736]/70 text-[10px] uppercase tracking-[0.2em] font-medium text-[#d48b4e]">
                      <span className="inline-flex items-center gap-1.5">
                        <span>OPEN FULL VIEW</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-[10px] text-[#716a5f]">Click to expand</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {filteredArtworks.length === 0 && (
          <div className="py-20 text-center text-[#8c8475]">
            <p className="font-editorial text-lg">No artworks found in this album category.</p>
          </div>
        )}
      </div>

      {/* =========================================================================
          Phone Gallery & Windows Photos Lightbox Modal Viewer
         ========================================================================= */}
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
