import React, { useState, useRef, useEffect } from 'react';
import { ARTWORK_CATEGORIES, ARTWORKS_DATA } from '../data/artworksData';
import ProjectLightbox from './ProjectLightbox';
import { useTheme } from '../context/ThemeContext';
import { Eye, ArrowUpRight, ChevronLeft, ChevronRight, Filter, Sparkles, LayoutGrid } from 'lucide-react';

export default function ArtworkGallery() {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("All Works");
  const [activeArtworkIndex, setActiveArtworkIndex] = useState(null);
  const [hoveredArtwork, setHoveredArtwork] = useState(null);
  const [carouselIsHovered, setCarouselIsHovered] = useState(false);

  const filteredArtworks = selectedCategory === "All Works"
    ? ARTWORKS_DATA
    : ARTWORKS_DATA.filter(art => art.category === selectedCategory);

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

  // Auto-scroll the big carousel smoothly every 4 seconds, pausing when hovered
  useEffect(() => {
    if (carouselIsHovered) return;
    const interval = setInterval(() => {
      if (bigCarouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = bigCarouselRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          bigCarouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          bigCarouselRef.current.scrollBy({ left: 380, behavior: 'smooth' });
        }
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [carouselIsHovered, filteredArtworks]);

  return (
    <section id="artworks" className="relative py-28 bg-[#0c0c0e] border-t border-[#1a1922]">
      <div className="absolute inset-0 bg-concrete-pattern opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 text-left">
          <div className="inline-flex items-center gap-3 mb-3">
            <span className="w-5 h-[1px]" style={{ backgroundColor: theme.accent }} />
            <span
              className="text-[11px] uppercase tracking-[0.25em] font-medium"
              style={{ color: theme.accent }}
            >
              CURATED PORTFOLIO
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal text-[#fbf8f3] tracking-wide mb-4">
            Masterworks of Cement Relief
          </h2>
          <p className="font-editorial text-lg text-[#b8ad9c] leading-relaxed">
            Each wall relief is hand-carved in high-grade cement mortar without the use of precast molds. Explore our signature commissions across architectural spaces.
          </p>
        </div>

        {/* Category Controls Bar: Carousel with Navigation Arrows + Quick Dropdown */}
        <div className="mb-10 border-b border-[#201e29] pb-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            
            {/* Carousel Navigation with Left / Right Arrows */}
            <div className="relative flex items-center min-w-0 flex-1">
              {/* Left Carousel Arrow */}
              <button
                type="button"
                onClick={() => scrollCategories('left')}
                aria-label="Scroll categories left"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#14131a] hover:bg-[#1f1d28] border border-[#282635] text-[#b8ad9c] hover:text-[#fbf8f3] transition-all flex-shrink-0 mr-2 shadow-md hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Scrollable Pills Carousel */}
              <div
                ref={categoriesRef}
                className="flex items-center gap-2 overflow-x-auto scroll-smooth scrollbar-none py-1 px-0.5"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {ARTWORK_CATEGORIES.map((category) => {
                  const isSelected = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setActiveArtworkIndex(null);
                        setHoveredArtwork(null);
                      }}
                      style={isSelected ? { backgroundColor: theme.accent, color: '#0b0b0e' } : {}}
                      className={`text-xs uppercase tracking-[0.18em] px-4 py-2.5 rounded-full transition-all duration-300 whitespace-nowrap focus:outline-none flex-shrink-0 ${
                        isSelected
                          ? 'font-semibold shadow-md'
                          : 'text-[#a9a296] hover:text-[#fbf8f3] hover:bg-[#15141c] border border-transparent hover:border-[#282633]'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              {/* Right Carousel Arrow */}
              <button
                type="button"
                onClick={() => scrollCategories('right')}
                aria-label="Scroll categories right"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#14131a] hover:bg-[#1f1d28] border border-[#282635] text-[#b8ad9c] hover:text-[#fbf8f3] transition-all flex-shrink-0 ml-2 shadow-md hover:scale-105 active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Filter Dropdown */}
            <div className="relative flex-shrink-0 self-end sm:self-auto">
              <div className="flex items-center gap-2 bg-[#121117] border border-[#282633] hover:border-[#d48b4e]/60 rounded-full px-3.5 py-2 text-xs text-[#cfc4b2] shadow-md transition-colors">
                <Filter className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setActiveArtworkIndex(null);
                    setHoveredArtwork(null);
                  }}
                  className="bg-transparent text-[#eee7dc] uppercase text-[11px] tracking-[0.15em] focus:outline-none cursor-pointer pr-1"
                >
                  {ARTWORK_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#121117] text-[#eee7dc]">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

          </div>
        </div>

        {/* Big Showcase Carousel Section */}
        <div
          className="mb-20 text-left"
          onMouseEnter={() => setCarouselIsHovered(true)}
          onMouseLeave={() => {
            setCarouselIsHovered(false);
            setHoveredArtwork(null);
          }}
        >
          {/* Top Bar for the Big Carousel: Active Name on Hover + Navigation Arrows */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 px-1">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: theme.accent }} />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#8c8475] font-medium">
                  FEATURED SCULPTURAL SHOWCASE
                </span>
                {hoveredArtwork ? (
                  <h3 className="font-display text-lg sm:text-xl text-[#fbf8f3] tracking-wide animate-fade-in flex items-center gap-2">
                    <span style={{ color: theme.accent }}>{hoveredArtwork.title}</span>
                    <span className="hidden md:inline text-xs text-[#a9a296] font-editorial font-light">
                      — {hoveredArtwork.category} ({hoveredArtwork.dimensions})
                    </span>
                  </h3>
                ) : (
                  <p className="font-display text-sm sm:text-base text-[#cfc4b2] tracking-wide">
                    Glide through our monumental architectural reliefs • Hover any piece to view name
                  </p>
                )}
              </div>
            </div>

            {/* Left and Right Carousel Control Arrows */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#716a5f] mr-2 hidden sm:inline">
                AUTO-SLIDING ({filteredArtworks.length})
              </span>
              <button
                type="button"
                onClick={() => scrollBigCarousel('left')}
                aria-label="Previous carousel artworks"
                className="w-10 h-10 rounded-full bg-[#14131b] hover:bg-[#201e29] border border-[#2c2938] hover:border-[#d48b4e] text-[#cfc4b2] hover:text-[#fbf8f3] flex items-center justify-center transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollBigCarousel('right')}
                aria-label="Next carousel artworks"
                className="w-10 h-10 rounded-full bg-[#14131b] hover:bg-[#201e29] border border-[#2c2938] hover:border-[#d48b4e] text-[#cfc4b2] hover:text-[#fbf8f3] flex items-center justify-center transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Big Horizontal Scroll Track */}
          <div
            ref={bigCarouselRef}
            className="flex items-stretch gap-6 overflow-x-auto scroll-smooth pb-4 pt-1 px-1 scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredArtworks.map((artwork, index) => {
              const isHovered = hoveredArtwork?.id === artwork.id;

              return (
                <div
                  key={`carousel-${artwork.id}`}
                  onClick={() => setActiveArtworkIndex(index)}
                  onMouseEnter={() => setHoveredArtwork(artwork)}
                  className="group relative flex-shrink-0 w-[290px] sm:w-[350px] md:w-[390px] aspect-[3/4] rounded-xl overflow-hidden border border-[#25232f] hover:border-[#d48b4e] transition-all duration-500 shadow-2xl bg-[#121117] cursor-pointer select-none"
                >
                  {/* Artwork Image with Zoom on Hover */}
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="w-full h-full object-cover object-center transform group-hover:scale-106 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />

                  {/* Gradient Vignettes */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090c] via-[#09090c]/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#09090c]/60 via-transparent to-transparent opacity-60" />

                  {/* Top Category Badge */}
                  <div className="absolute top-3.5 left-3.5 z-20">
                    <span
                      className="text-[9px] uppercase tracking-[0.2em] font-medium bg-[#0a0a0e]/85 backdrop-blur-md border border-[#2c2a38] px-2.5 py-1 rounded"
                      style={{ color: theme.accent }}
                    >
                      {artwork.category}
                    </span>
                  </div>

                  {/* Top Right Quick Inspect Indicator */}
                  <div className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-[#0a0a0e]/85 backdrop-blur-md border border-[#2c2a38] group-hover:border-[#d48b4e] text-[#b8ad9c] group-hover:text-[#fbf8f3] flex items-center justify-center transition-all">
                    <Eye className="w-3.5 h-3.5" />
                  </div>

                  {/* Bottom Hover Content: Prominently Displays Name and Details on Hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-20 flex flex-col justify-end text-left transition-all duration-300 transform group-hover:translate-y-0">
                    {/* Eyebrow index */}
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#8c8475] font-mono mb-1 block">
                      NO. {String(index + 1).padStart(2, '0')}
                    </span>

                    {/* Prominent Artwork Name displayed clearly on hover */}
                    <h4 className="font-display text-lg sm:text-xl font-medium text-[#fbf8f3] group-hover:text-[#f2bc88] transition-colors line-clamp-2 leading-snug mb-1.5 drop-shadow-md">
                      {artwork.title}
                    </h4>

                    {/* Medium & Dimensions */}
                    <p className="text-[11px] sm:text-xs text-[#cfc4b2] font-editorial leading-relaxed line-clamp-1 mb-3">
                      {artwork.medium} • {artwork.dimensions}
                    </p>

                    {/* Action Button that appears / highlights on hover */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-[#292736]/70">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#d48b4e] group-hover:underline inline-flex items-center gap-1.5">
                        <span>OPEN FULL VIEW</span>
                        <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </span>
                      <span className="text-[10px] text-[#716a5f]">Click to expand</span>
                    </div>
                  </div>

                  {/* Corner Accents on Card */}
                  <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[#d48b4e]/30 pointer-events-none group-hover:border-[#d48b4e] transition-colors z-20" />
                  <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[#d48b4e]/30 pointer-events-none group-hover:border-[#d48b4e] transition-colors z-20" />
                  <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[#d48b4e]/30 pointer-events-none group-hover:border-[#d48b4e] transition-colors z-20" />
                  <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[#d48b4e]/30 pointer-events-none group-hover:border-[#d48b4e] transition-colors z-20" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Section Divider & Header for the Complete Grid below the Carousel */}
        <div className="flex items-center justify-between mb-8 pt-8 border-t border-[#1d1b26] text-left">
          <div className="flex items-center gap-2.5">
            <LayoutGrid className="w-4 h-4" style={{ color: theme.accent }} />
            <h3 className="font-display text-xl sm:text-2xl text-[#fbf8f3] tracking-wide font-normal">
              Complete Portfolio Grid
            </h3>
          </div>
          <span className="text-xs uppercase tracking-[0.2em] text-[#8c8475]">
            {filteredArtworks.length} {filteredArtworks.length === 1 ? 'Installation' : 'Installations'}
          </span>
        </div>

        {/* Asymmetrical Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArtworks.map((artwork, index) => {
            const isLarge = index === 0;

            return (
              <div
                key={artwork.id}
                onClick={() => setActiveArtworkIndex(index)}
                className={`group relative cursor-pointer overflow-hidden rounded-lg bg-[#121117] border border-[#23212c] hover:border-[#d48b4e]/70 transition-all duration-500 shadow-xl flex flex-col justify-between ${
                  isLarge ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                {/* Image Container with Zoom Effect */}
                <div className={`relative overflow-hidden w-full ${isLarge ? 'aspect-[16/10] sm:aspect-[16/9]' : 'aspect-[4/3] sm:aspect-[4/3]'}`}>
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0d] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Floating View Icon */}
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#0a0a0d]/80 backdrop-blur-md border border-[#302e3b] flex items-center justify-center text-[#ded3c1] group-hover:text-[#d48b4e] group-hover:border-[#d48b4e] transition-all">
                    <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>

                  {/* Category Pill */}
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-medium bg-[#0a0a0d]/80 backdrop-blur-md border border-[#2b2836] text-[#ded3c1] px-2.5 py-1 rounded">
                      {artwork.category}
                    </span>
                  </div>
                </div>

                {/* Caption Bar */}
                <div className="p-6 bg-[#100f15] flex flex-col justify-between flex-grow text-left">
                  <div>
                    <h3 className="font-display text-lg md:text-xl font-normal text-[#fbf8f3] group-hover:text-[#d48b4e] transition-colors mb-2">
                      {artwork.title}
                    </h3>
                    <p className="font-editorial text-sm text-[#a9a296] line-clamp-2 leading-relaxed">
                      {artwork.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1d1b26] flex items-center justify-between text-[11px] text-[#8c8475]">
                    <span>{artwork.dimensions || "Custom Commission"}</span>
                    <span
                      style={{ color: theme.accent }}
                      className="group-hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      Inspect Art <Eye className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredArtworks.length === 0 && (
          <div className="py-20 text-center text-[#8c8475]">
            <p className="font-editorial text-lg">No artworks in this category currently displayed.</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <ProjectLightbox
        artwork={activeArtwork}
        onClose={() => setActiveArtworkIndex(null)}
        onPrev={handlePrev}
        onNext={handleNext}
        hasPrev={activeArtworkIndex > 0}
        hasNext={activeArtworkIndex < filteredArtworks.length - 1}
      />
    </section>
  );
}
