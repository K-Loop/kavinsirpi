import React, { useState } from 'react';
import { ARTWORK_CATEGORIES, ARTWORKS_DATA } from '../data/artworksData';
import ProjectLightbox from './ProjectLightbox';
import { useTheme } from '../context/ThemeContext';
import { Eye, ArrowUpRight, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

export default function ArtworkGallery() {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("All Works");
  const [activeArtworkIndex, setActiveArtworkIndex] = useState(null);

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

  const categoriesRef = React.useRef(null);

  const scrollCategories = (direction) => {
    if (categoriesRef.current) {
      const scrollAmount = 260;
      categoriesRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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
        <div className="mb-12 border-b border-[#201e29] pb-4">
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
