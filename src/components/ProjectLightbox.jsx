import React, { useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
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
  const touchStartX = useRef(null);
  const thumbStripRef = useRef(null);
  const thumbRefs = useRef([]);

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
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [artwork, handleClose, onPrev, onNext, hasPrev, hasNext]);

  // Smoothly auto-center the active thumbnail INSIDE the bottom strip only (never scrolls the main page)
  useEffect(() => {
    if (!artwork || currentIndex === null || currentIndex === undefined) return;
    const container = thumbStripRef.current;
    const activeThumb = thumbRefs.current[currentIndex];
    if (container && activeThumb) {
      const targetLeft =
        activeThumb.offsetLeft - container.clientWidth / 2 + activeThumb.clientWidth / 2;
      container.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: 'smooth'
      });
    }
  }, [artwork, currentIndex]);

  // Touch swipe for effortless mobile navigation
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0 && hasNext) {
        onNext();
      } else if (diff < 0 && hasPrev) {
        onPrev();
      }
    }
    touchStartX.current = null;
  };

  if (!artwork || typeof document === 'undefined') return null;

  const totalCount = allArtworks.length > 0 ? allArtworks.length : 1;
  const currentNum = (currentIndex !== null && currentIndex !== undefined) ? currentIndex + 1 : 1;
  const customEnquiryMessage = `Hello Kavin Sirpi, I am interested in commissioning a cement relief sculpture similar to "${artwork.title}" (${artwork.category}). Could you please share more details?`;

  const lightboxContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={artwork.title}
      className="fixed inset-0 h-[100dvh] w-screen z-[9999] flex flex-col justify-between bg-[#050507]/98 backdrop-blur-xl text-[#eee7dc] select-none animate-fade-in overflow-hidden"
      onClick={handleClose}
    >
      {/* Top Header: Counter, Category, Title, and Close Button */}
      <header
        onClick={(e) => e.stopPropagation()}
        className="relative z-40 flex items-center justify-between px-3.5 sm:px-6 py-2.5 sm:py-3 bg-[#0a0a0e]/95 border-b border-[#1c1a26] flex-shrink-0"
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="text-[11px] sm:text-xs font-mono text-[#8c8475] bg-[#14131b] px-2 sm:px-2.5 py-1 rounded-md border border-[#262433] flex-shrink-0">
            {currentNum} / {totalCount}
          </span>
          <span
            className="text-[10px] sm:text-xs uppercase tracking-wider font-medium truncate"
            style={{ color: theme.accent }}
          >
            {artwork.category}
          </span>
        </div>

        <h2 className="hidden md:block font-display text-sm sm:text-base font-normal text-[#fbf8f3] tracking-wide truncate max-w-md text-center px-4">
          {artwork.title}
        </h2>

        <button
          type="button"
          onClick={handleClose}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#16151f] hover:bg-[#252230] border border-[#2b2838] hover:border-[#d48b4e] flex items-center justify-center text-[#ded3c1] hover:text-[#fbf8f3] transition-all flex-shrink-0"
          title="Close Gallery (Esc)"
          aria-label="Close gallery"
        >
          <X className="w-4 h-4" />
        </button>
      </header>

      {/* Main Stage: Full Focused Artwork View */}
      <main
        className="relative flex-grow min-h-0 flex items-center justify-center px-2 py-2 sm:px-8 sm:py-4 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation Arrow Left */}
        {hasPrev && (
          <button
            type="button"
            onClick={onPrev}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#121118]/85 hover:bg-[#1f1d2a] border border-[#2b2938] hover:border-[#d48b4e] text-[#ded3c1] hover:text-[#fbf8f3] flex items-center justify-center transition-all shadow-2xl backdrop-blur-md"
            aria-label="Previous artwork"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Navigation Arrow Right */}
        {hasNext && (
          <button
            type="button"
            onClick={onNext}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#121118]/85 hover:bg-[#1f1d2a] border border-[#2b2938] hover:border-[#d48b4e] text-[#ded3c1] hover:text-[#fbf8f3] flex items-center justify-center transition-all shadow-2xl backdrop-blur-md"
            aria-label="Next artwork"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Center Artwork Image */}
        <div className="relative h-full w-full min-h-0 flex items-center justify-center">
          <img
            src={artwork.image}
            alt={artwork.title}
            className="max-h-[54dvh] sm:max-h-[64dvh] max-w-full w-auto h-auto object-contain rounded-xl shadow-2xl border border-[#22202c]"
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
        </div>
      </main>

      {/* Bottom Area: Info + WhatsApp CTA + WhatsApp-Style Horizontal Thumbnail Strip */}
      <footer
        onClick={(e) => e.stopPropagation()}
        className="relative z-40 bg-[#0a0a0e]/95 border-t border-[#1c1a26] flex-shrink-0 pb-[env(safe-area-inset-bottom)]"
      >
        {/* Artwork Info & WhatsApp Enquiry Row */}
        <div className="px-3.5 sm:px-6 pt-2.5 pb-2">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <div className="min-w-0 max-w-full">
              <p className="font-display text-sm sm:text-base md:text-lg text-[#fbf8f3] truncate">
                {artwork.title}
              </p>
              <p className="text-[11px] sm:text-xs text-[#a89f90] truncate">
                {artwork.dimensions ? `${artwork.dimensions} • ` : ''}Handcrafted In-Situ Cement Relief
              </p>
            </div>

            <a
              href={getWhatsAppUrl(customEnquiryMessage)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: theme.accent }}
              className="inline-flex items-center justify-center gap-2 hover:brightness-110 text-[#0b0b0e] font-semibold text-[11px] sm:text-xs tracking-[0.15em] uppercase px-4 py-2 sm:px-6 sm:py-2.5 rounded-full transition-all shadow-md flex-shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#0b0b0e]" />
              <span>Enquire on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* WhatsApp-Style Horizontal Album Thumbnail Filmstrip */}
        {allArtworks.length > 1 && (
          <div className="border-t border-[#1a1824] bg-[#07070a]/95 px-2.5 sm:px-6 py-2">
            <div
              ref={thumbStripRef}
              className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto scrollbar-none py-1 px-1 max-w-6xl mx-auto"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {allArtworks.map((item, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={`thumb-${item.id || idx}`}
                    ref={(el) => {
                      thumbRefs.current[idx] = el;
                    }}
                    type="button"
                    onClick={() => {
                      if (typeof onSelectIndex === 'function') {
                        onSelectIndex(idx);
                      }
                    }}
                    aria-label={`View ${item.title}`}
                    style={
                      isActive
                        ? {
                            borderColor: theme.accent,
                            boxShadow: `0 0 0 2px ${theme.accent}`
                          }
                        : {}
                    }
                    className={`relative flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden transition-all duration-200 focus:outline-none ${
                      isActive
                        ? 'opacity-100 scale-105 border-2 z-10'
                        : 'opacity-50 hover:opacity-95 border border-[#262433] hover:border-[#4b465e]'
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        if (!e.currentTarget.dataset.triedFallback) {
                          e.currentTarget.dataset.triedFallback = 'true';
                          if (item.image && item.image.includes('/uploads/')) {
                            const base = item.image.split('/uploads/').pop().replace(/\.webp$/, '.jpeg');
                            e.currentTarget.src = `/images/crafts/${base}`;
                          }
                        }
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </footer>
    </div>
  );

  return createPortal(lightboxContent, document.body);
}
