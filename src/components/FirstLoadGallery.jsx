import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useArtworks } from '../context/ArtworksContext';
import ProjectLightbox from './ProjectLightbox';
import { 
  ChevronDown, 
  Sparkles, 
  Maximize2, 
  Layers,
  ArrowDownCircle,
  Eye
} from 'lucide-react';

export default function FirstLoadGallery() {
  const { theme } = useTheme();
  const { artworks, categories } = useArtworks();
  const [selectedCategory, setSelectedCategory] = useState("All Works");
  const [activeArtworkIndex, setActiveArtworkIndex] = useState(null);

  // Filter artworks for top gallery
  const filteredWorks = (selectedCategory === "All Works"
    ? artworks
    : artworks.filter(art => art.category === selectedCategory)
  ).slice().sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));

  // Display top 8-12 works for rich first-impression density
  const displayWorks = filteredWorks.slice(0, 10);
  const activeArtwork = activeArtworkIndex !== null ? filteredWorks[activeArtworkIndex] : null;

  const scrollToHero = (e) => {
    e.preventDefault();
    const heroElem = document.getElementById('hero');
    if (heroElem) {
      heroElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (activeArtworkIndex > 0) {
      setActiveArtworkIndex(activeArtworkIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeArtworkIndex < filteredWorks.length - 1) {
      setActiveArtworkIndex(activeArtworkIndex + 1);
    }
  };

  return (
    <section
      id="gallery-showcase"
      className="relative min-h-[92vh] sm:min-h-screen w-full flex flex-col justify-between bg-[#08080a] pt-24 sm:pt-28 pb-12 overflow-hidden border-b border-[#1c1a24]"
    >
      {/* Background Architectural Ambient Light */}
      <div className="absolute inset-0 bg-concrete-pattern opacity-30 pointer-events-none" />
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full blur-[140px] pointer-events-none opacity-20"
        style={{ background: theme.accent }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-12 w-full flex-grow flex flex-col justify-center">
        
        {/* Top Header & Context */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-6 sm:mb-8 pt-2">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16151c]/80 border border-[#2c2937] backdrop-blur-md mb-3">
              <Sparkles className="w-3.5 h-3.5" style={{ color: theme.accent }} />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-medium text-[#ded3c1]">
                Master Relief Portfolio • Live Gallery
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1" />
            </div>

            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal tracking-[0.02em] text-[#fbf8f3] leading-[1.18]">
              Architectural Murals Carved in Cement
            </h1>
            <p className="font-editorial text-sm sm:text-base text-[#baa995] mt-1.5 max-w-2xl">
              Permanent high-relief sculptures handcrafted on-site. Browse our monumental works below, then scroll down to explore the studio story.
            </p>
          </div>

          {/* Quick Counter Badge */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-[#121118]/90 border border-[#262433] backdrop-blur-md text-left">
              <span className="text-[10px] uppercase tracking-wider text-[#8b8273] block">Collection Count</span>
              <span className="font-display text-lg sm:text-xl font-medium text-[#fbf8f3]">
                {artworks.length}+ Sculptures
              </span>
            </div>
            
            <a
              href="#hero"
              onClick={scrollToHero}
              className="hidden lg:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#353142] hover:border-[#d48b4e]/70 bg-[#15141c]/80 hover:bg-[#1a1923] text-xs uppercase tracking-wider text-[#ded3c1] transition-all"
            >
              <span>Scroll to Overview</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#d48b4e]" />
            </a>
          </div>
        </div>

        {/* Quick Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-4 mb-4" style={{ scrollbarWidth: 'none' }}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = cat === "All Works" 
              ? artworks.length 
              : artworks.filter(a => a.category === cat).length;
            
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={isSelected ? { backgroundColor: theme.accent, color: '#09090c' } : {}}
                className={`text-[11px] uppercase tracking-[0.15em] px-3.5 py-1.5 rounded-full transition-all duration-300 whitespace-nowrap flex items-center gap-1.5 flex-shrink-0 ${
                  isSelected
                    ? 'font-semibold shadow-md scale-102'
                    : 'bg-[#121117] text-[#9c9384] hover:text-[#fbf8f3] border border-[#22202c] hover:border-[#383446]'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[9px] font-mono px-1 rounded-full ${isSelected ? 'bg-black/20 text-black' : 'text-[#6d665a]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Rich First-Loading Photo Display Grid (Showing Multiple Photos Simultaneously) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5 lg:gap-4 my-auto">
          {displayWorks.map((art, idx) => {
            // Give subtle aesthetic variety to card heights
            const isTall = idx === 0 || idx === 3 || idx === 7;

            return (
              <div
                key={art.id || idx}
                onClick={() => setActiveArtworkIndex(idx)}
                className={`group relative rounded-xl overflow-hidden border border-[#25232f] hover:border-[#d48b4e]/80 transition-all duration-500 cursor-pointer bg-[#100f15] shadow-lg hover:shadow-2xl hover:-translate-y-1 ${
                  isTall ? 'aspect-[3/4.2]' : 'aspect-[3/3.8]'
                }`}
                title={`Click to inspect ${art.title}`}
              >
                {/* Artwork Image */}
                <img
                  src={art.image}
                  alt={art.title}
                  loading={idx < 4 ? "eager" : "lazy"}
                  className="w-full h-full object-cover object-center transform group-hover:scale-108 transition-transform duration-700 ease-out"
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

                {/* Ambient vignette and hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#09080c] via-[#09080c]/30 to-transparent opacity-75 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Top Quick Badges */}
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                  <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#0a0a0d]/85 backdrop-blur-md text-[#dcd4c6] border border-white/10 font-mono">
                    #{idx + 1}
                  </span>
                  
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-1.5 rounded-full bg-[#d48b4e] text-[#0a0a0d] shadow-md">
                    <Maximize2 className="w-3 h-3" />
                  </span>
                </div>

                {/* Bottom Card Details */}
                <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3 text-left">
                  <span 
                    className="text-[9px] uppercase tracking-[0.16em] block truncate font-medium mb-0.5"
                    style={{ color: theme.accent }}
                  >
                    {art.category}
                  </span>
                  <h3 className="font-display text-xs sm:text-sm text-[#fbf8f3] font-normal leading-snug line-clamp-1 group-hover:text-[#ffffff] transition-colors">
                    {art.title}
                  </h3>
                  {art.dimensions && (
                    <p className="text-[9px] font-mono text-[#918778] truncate mt-0.5">
                      {art.dimensions}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Prompter: Smooth Scroll to Hero Section */}
        <div className="pt-6 sm:pt-8 flex flex-col items-center justify-center">
          <a
            href="#hero"
            onClick={scrollToHero}
            className="group inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-[#14131b]/90 hover:bg-[#1a1924] border border-[#2e2a3a] hover:border-[#d48b4e]/80 text-[#ded4c5] hover:text-[#fbf8f3] text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-xl backdrop-blur-md"
          >
            <span className="text-[11px] font-medium">Scroll down to explore Atelier Overview</span>
            <ChevronDown className="w-4 h-4 text-[#d48b4e] animate-bounce group-hover:translate-y-0.5 transition-transform" />
          </a>
        </div>

      </div>

      {/* Lightbox when any photo in top gallery is clicked */}
      {activeArtwork && (
        <ProjectLightbox
          artwork={activeArtwork}
          allArtworks={filteredWorks}
          currentIndex={activeArtworkIndex}
          onClose={() => setActiveArtworkIndex(null)}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={activeArtworkIndex > 0}
          hasNext={activeArtworkIndex < filteredWorks.length - 1}
        />
      )}
    </section>
  );
}
