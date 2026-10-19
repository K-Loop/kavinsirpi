import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Info,
  Layers,
  Eye,
  EyeOff,
  Maximize2
} from 'lucide-react';
import { getWhatsAppUrl } from '../config/studioInfo';
import { useTheme } from '../context/ThemeContext';

export default function ProjectLightbox({
  artwork,
  allArtworks = [],
  currentIndex = 0,
  onSelectIndex,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext
}) {
  const { theme } = useTheme();
  const [showDetails, setShowDetails] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [touchStartX, setTouchStartX] = useState(null);
  const filmstripRef = useRef(null);

  // Auto-scroll active thumbnail into view in the bottom filmstrip
  useEffect(() => {
    if (filmstripRef.current && currentIndex !== null && currentIndex !== undefined) {
      const activeThumb = filmstripRef.current.children[currentIndex];
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }
    }
  }, [currentIndex]);

  // Reset zoom whenever artwork changes
  useEffect(() => {
    setZoomLevel(1);
  }, [artwork]);

  const handleClose = useCallback(() => {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!artwork) {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      return;
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
      if (e.key === 'i' || e.key === 'I') setShowDetails((prev) => !prev);
      if (e.key === '+' || e.key === '=') setZoomLevel((z) => Math.min(2.5, z + 0.25));
      if (e.key === '-' || e.key === '_') setZoomLevel((z) => Math.max(1, z - 0.25));
      if (e.key === '0') setZoomLevel(1);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [artwork, handleClose, onPrev, onNext, hasPrev, hasNext]);

  // Touch swipe support for phone gallery feel
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && hasNext) {
        onNext();
      } else if (diff < 0 && hasPrev) {
        onPrev();
      }
    }
    setTouchStartX(null);
  };

  if (!artwork) return null;

  const totalCount = allArtworks.length > 0 ? allArtworks.length : 1;
  const currentNum = (currentIndex !== null && currentIndex !== undefined) ? currentIndex + 1 : 1;
  const customEnquiryMessage = `Hello Kavin Sirpi, I am interested in commissioning a cement relief sculpture similar to "${artwork.title}" (${artwork.category}). Could you please share more details?`;

  // The overlay is visible if explicitly toggled on OR when the user is hovering/interacting
  const isOverlayOpen = showDetails || isHovered;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={artwork.title}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-[#050507]/98 backdrop-blur-2xl text-[#eee7dc] select-none animate-fade-in"
      onClick={() => {
        // Clicking backdrop toggles details overlay in Windows Photos / Phone Gallery style
        setShowDetails((prev) => !prev);
      }}
    >
      {/* =========================================================================
          Top Gallery Bar (Windows Photos / Phone Album Header)
         ========================================================================= */}
      <header
        onClick={(e) => e.stopPropagation()}
        className="relative z-40 flex items-center justify-between px-4 sm:px-6 py-3 bg-[#0c0c11]/85 backdrop-blur-xl border-b border-[#201e2b]"
      >
        {/* Left: Back to Album + Album Title & Photo Index */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={handleClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#16151e] hover:bg-[#22202c] border border-[#2a2838] hover:border-[#d48b4e] text-xs font-medium text-[#ded3c1] hover:text-[#fbf8f3] transition-all flex-shrink-0"
            title="Back to gallery (Esc)"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Album</span>
          </button>

          <div className="flex items-center gap-2 truncate">
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] uppercase tracking-[0.2em] font-medium bg-[#1a1923] text-[#a9a296] border border-[#282635]">
              <Layers className="w-3 h-3" style={{ color: theme.accent }} />
              {artwork.category}
            </span>
            <span className="text-xs font-mono text-[#8c8475]">
              {currentNum} of {totalCount}
            </span>
          </div>
        </div>

        {/* Center: Image Name */}
        <div className="hidden lg:block truncate max-w-md text-center">
          <span className="font-display text-sm text-[#fbf8f3] tracking-wide truncate">
            {artwork.title}
          </span>
        </div>

        {/* Right: Quick Photo Controls (Zoom, Details Toggle, WhatsApp, Close) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Zoom Out */}
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(1, z - 0.25))}
            disabled={zoomLevel <= 1}
            className="w-8 h-8 rounded-full bg-[#16151e] hover:bg-[#22202c] disabled:opacity-40 disabled:hover:bg-[#16151e] border border-[#2a2838] flex items-center justify-center text-[#ded3c1] hover:text-[#fbf8f3] transition-all"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          {/* Reset Zoom */}
          {zoomLevel > 1 && (
            <button
              type="button"
              onClick={() => setZoomLevel(1)}
              className="px-2 py-1 rounded-full bg-[#16151e] hover:bg-[#22202c] border border-[#2a2838] text-[10px] font-mono text-[#d48b4e] hover:text-[#fbf8f3] transition-all flex items-center gap-1"
              title="Reset Zoom (0)"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{Math.round(zoomLevel * 100)}%</span>
            </button>
          )}

          {/* Zoom In */}
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
            disabled={zoomLevel >= 2.5}
            className="w-8 h-8 rounded-full bg-[#16151e] hover:bg-[#22202c] disabled:opacity-40 disabled:hover:bg-[#16151e] border border-[#2a2838] flex items-center justify-center text-[#ded3c1] hover:text-[#fbf8f3] transition-all"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-[1px] bg-[#272533] mx-1 hidden sm:block" />

          {/* Toggle Details Overlay Button */}
          <button
            type="button"
            onClick={() => setShowDetails((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
              isOverlayOpen
                ? 'bg-[#d48b4e]/20 border-[#d48b4e] text-[#fbf8f3]'
                : 'bg-[#16151e] hover:bg-[#22202c] border-[#2a2838] text-[#ded3c1]'
            }`}
            title="Toggle Details (I)"
          >
            <Info className="w-3.5 h-3.5" style={{ color: theme.accent }} />
            <span className="hidden sm:inline">Details</span>
          </button>

          {/* WhatsApp Enquiry Button */}
          <a
            href={getWhatsAppUrl(customEnquiryMessage)}
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: theme.accent }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[#0b0b0e] hover:brightness-110 text-xs font-semibold uppercase tracking-[0.12em] transition-all shadow-md"
            title="Enquire on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-[#0b0b0e]" />
            <span>Enquire</span>
          </a>

          {/* Close Lightbox */}
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-[#16151e] hover:bg-[#272330] border border-[#2a2838] hover:border-[#d48b4e] flex items-center justify-center text-[#ded3c1] hover:text-[#fbf8f3] transition-all ml-1"
            title="Close Lightbox (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* =========================================================================
          Center Canvas: Large Image with Hover/Click Details Overlay
         ========================================================================= */}
      <main
        className="relative flex-grow flex items-center justify-center overflow-hidden p-2 sm:p-4 md:p-6"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Navigation Arrow Left */}
        {hasPrev && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-[#100f16]/85 hover:bg-[#1a1924] border border-[#2d2a3a] hover:border-[#d48b4e] text-[#ded3c1] hover:text-[#fbf8f3] flex items-center justify-center transition-all shadow-2xl hover:scale-105 active:scale-95 backdrop-blur-md"
            aria-label="Previous artwork"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Navigation Arrow Right */}
        {hasNext && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-[#100f16]/85 hover:bg-[#1a1924] border border-[#2d2a3a] hover:border-[#d48b4e] text-[#ded3c1] hover:text-[#fbf8f3] flex items-center justify-center transition-all shadow-2xl hover:scale-105 active:scale-95 backdrop-blur-md"
            aria-label="Next artwork"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Image Container with Zoom & Hover Overlay Trigger */}
        <div
          onClick={(e) => {
            // Tapping/clicking image toggles overlay visibility
            e.stopPropagation();
            setShowDetails((prev) => !prev);
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative max-h-full max-w-full flex items-center justify-center cursor-pointer group"
          title="Click to toggle details overlay"
        >
          {/* Main Artwork Image */}
          <img
            src={artwork.image}
            alt={artwork.title}
            style={{
              transform: `scale(${zoomLevel})`,
              transition: 'transform 0.25s ease-out'
            }}
            className="max-h-[64vh] sm:max-h-[68vh] md:max-h-[72vh] w-auto max-w-full object-contain rounded-lg shadow-2xl transition-all"
            loading="eager"
          />

          {/* Visual Tap / Click Hint for mobile/desktop */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <span className="px-2.5 py-1 rounded-full text-[10px] bg-[#0c0c11]/80 backdrop-blur-md border border-[#2a2838] text-[#a9a296] font-mono">
              Click photo to {isOverlayOpen ? 'hide' : 'show'} info
            </span>
          </div>

          {/* =====================================================================
              FLOATING DETAILS OVERLAY
              Appears smoothly when clicked or hovered over the artwork!
             ===================================================================== */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute bottom-3 sm:bottom-5 left-3 sm:left-5 right-3 sm:right-5 max-w-2xl mx-auto z-30 transition-all duration-300 transform ${
              isOverlayOpen
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            <div className="relative p-5 sm:p-6 rounded-2xl bg-[#0d0c14]/90 backdrop-blur-2xl border border-[#2d2a3c] shadow-2xl text-left">
              {/* Close / Minimize Overlay Button */}
              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-[#181622] hover:bg-[#242230] text-[#a9a296] hover:text-[#fbf8f3] border border-[#2d2a3c] transition-all"
                title="Hide details"
              >
                <EyeOff className="w-3.5 h-3.5" />
              </button>

              {/* Category & Index Pill */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span
                  style={{ color: theme.accent, borderColor: `${theme.accent}40` }}
                  className="inline-block text-[9px] uppercase tracking-[0.25em] font-semibold border px-2.5 py-0.5 rounded-full bg-[#151420]"
                >
                  {artwork.category}
                </span>
                {artwork.dimensions && (
                  <span className="text-[10px] text-[#cfc4b2] bg-[#161520] px-2.5 py-0.5 rounded-full border border-[#272535]">
                    {artwork.dimensions}
                  </span>
                )}
                {artwork.medium && (
                  <span className="text-[10px] text-[#cfc4b2] bg-[#161520] px-2.5 py-0.5 rounded-full border border-[#272535] hidden sm:inline">
                    {artwork.medium}
                  </span>
                )}
              </div>

              {/* Artwork Title */}
              <h3 className="font-display text-lg sm:text-2xl font-normal text-[#fbf8f3] tracking-wide mb-2 drop-shadow-sm pr-6">
                {artwork.title}
              </h3>

              {/* Description */}
              {artwork.description && (
                <p className="font-editorial text-xs sm:text-sm text-[#ded3c1] line-clamp-3 sm:line-clamp-4 leading-relaxed mb-4">
                  {artwork.description}
                </p>
              )}

              {/* Highlights tags if present */}
              {artwork.highlights && artwork.highlights.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4 hidden sm:flex">
                  {artwork.highlights.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] text-[#b8ad9c] bg-[#13121b] border border-[#252332] px-2 py-0.5 rounded"
                    >
                      • {item}
                    </span>
                  ))}
                </div>
              )}

              {/* Bottom Action Bar inside Overlay */}
              <div className="flex items-center justify-between pt-3 border-t border-[#232130]">
                <div className="text-[11px] text-[#8c8475] hidden sm:block">
                  Direct In-Situ Cement Mortar Carving
                </div>
                <a
                  href={getWhatsAppUrl(customEnquiryMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ backgroundColor: theme.accent }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[#0b0b0e] hover:brightness-110 text-xs font-semibold uppercase tracking-[0.15em] transition-all shadow-md ml-auto"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-[#0b0b0e]" />
                  <span>Enquire for Custom Relief</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* =========================================================================
          Bottom Filmstrip Carousel (Windows Photos / Phone Gallery Strip)
         ========================================================================= */}
      {allArtworks.length > 0 && (
        <footer
          onClick={(e) => e.stopPropagation()}
          className="relative z-40 bg-[#09090d]/90 backdrop-blur-xl border-t border-[#1d1b28] py-2 px-4"
        >
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#716a5f] font-mono whitespace-nowrap hidden md:inline">
              ALBUM STRIP ({allArtworks.length})
            </span>

            {/* Thumbnail Scroll Track */}
            <div
              ref={filmstripRef}
              className="flex items-center gap-2.5 overflow-x-auto scroll-smooth py-1 scrollbar-none flex-grow"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {allArtworks.map((item, idx) => {
                const isActive = idx === currentIndex;

                return (
                  <button
                    key={`filmstrip-${item.id || idx}`}
                    type="button"
                    onClick={() => {
                      if (onSelectIndex) {
                        onSelectIndex(idx);
                      }
                    }}
                    className={`relative flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden transition-all duration-200 group ${
                      isActive
                        ? 'ring-2 scale-105 opacity-100 shadow-lg'
                        : 'opacity-50 hover:opacity-90 hover:scale-100'
                    }`}
                    style={isActive ? { ringColor: theme.accent } : {}}
                    title={item.title}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {isActive && (
                      <div
                        className="absolute inset-0 border-2 rounded-lg pointer-events-none"
                        style={{ borderColor: theme.accent }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="text-[10px] text-[#716a5f] font-mono hidden sm:block whitespace-nowrap">
              ◄ ► to scrub
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
