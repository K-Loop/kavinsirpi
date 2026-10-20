import React, { useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../config/studioInfo';
import { useTheme } from '../context/ThemeContext';

export default function ProjectLightbox({
  artwork,
  allArtworks = [],
  currentIndex = 0,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext
}) {
  const { theme } = useTheme();
  const touchStartX = useRef(null);

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

  // Touch swipe for effortless mobile navigation
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && hasNext) {
        onNext();
      } else if (diff < 0 && hasPrev) {
        onPrev();
      }
    }
    touchStartX.current = null;
  };

  if (!artwork) return null;

  const totalCount = allArtworks.length > 0 ? allArtworks.length : 1;
  const currentNum = (currentIndex !== null && currentIndex !== undefined) ? currentIndex + 1 : 1;
  const customEnquiryMessage = `Hello Kavin Sirpi, I am interested in commissioning a cement relief sculpture similar to "${artwork.title}" (${artwork.category}). Could you please share more details?`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={artwork.title}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-[#050507]/95 backdrop-blur-xl text-[#eee7dc] select-none animate-fade-in"
      onClick={handleClose}
    >
      {/* Dialogue Top Header: Counter, Title, and Close Button */}
      <header
        onClick={(e) => e.stopPropagation()}
        className="relative z-40 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#0a0a0e]/90 border-b border-[#1c1a26]"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#8c8475] bg-[#14131b] px-2.5 py-1 rounded-md border border-[#262433]">
            {currentNum} / {totalCount}
          </span>
          <span className="text-xs uppercase tracking-wider font-medium text-[#d48b4e]">
            {artwork.category}
          </span>
        </div>

        <h2 className="font-display text-sm sm:text-base font-normal text-[#fbf8f3] tracking-wide truncate max-w-[200px] sm:max-w-md text-center">
          {artwork.title}
        </h2>

        <button
          type="button"
          onClick={handleClose}
          className="w-9 h-9 rounded-full bg-[#16151f] hover:bg-[#252230] border border-[#2b2838] hover:border-[#d48b4e] flex items-center justify-center text-[#ded3c1] hover:text-[#fbf8f3] transition-all"
          title="Close (Esc)"
          aria-label="Close dialogue"
        >
          <X className="w-4 h-4" />
        </button>
      </header>

      {/* Dialogue Main Stage: Full Focused Artwork View */}
      <main
        className="relative flex-grow flex items-center justify-center p-4 sm:p-8 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation Arrow Left */}
        {hasPrev && (
          <button
            type="button"
            onClick={onPrev}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-[#121118]/85 hover:bg-[#1f1d2a] border border-[#2b2938] hover:border-[#d48b4e] text-[#ded3c1] hover:text-[#fbf8f3] flex items-center justify-center transition-all shadow-2xl backdrop-blur-md"
            aria-label="Previous artwork"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Navigation Arrow Right */}
        {hasNext && (
          <button
            type="button"
            onClick={onNext}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-[#121118]/85 hover:bg-[#1f1d2a] border border-[#2b2938] hover:border-[#d48b4e] text-[#ded3c1] hover:text-[#fbf8f3] flex items-center justify-center transition-all shadow-2xl backdrop-blur-md"
            aria-label="Next artwork"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Center Artwork Image */}
        <div className="relative max-h-full max-w-full flex items-center justify-center">
          <img
            src={artwork.image}
            alt={artwork.title}
            className="max-h-[72vh] sm:max-h-[76vh] w-auto max-w-full object-contain rounded-xl shadow-2xl border border-[#22202c]"
          />
        </div>
      </main>

      {/* Dialogue Bottom Action Bar: Artwork Info & Straightforward WhatsApp Enquiry */}
      <footer
        onClick={(e) => e.stopPropagation()}
        className="relative z-40 px-4 sm:px-6 py-3.5 bg-[#0a0a0e]/95 border-t border-[#1c1a26]"
      >
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="font-display text-base sm:text-lg text-[#fbf8f3]">
              {artwork.title}
            </p>
            <p className="text-xs text-[#a89f90]">
              {artwork.dimensions ? `${artwork.dimensions} • ` : ''}Handcrafted In-Situ Cement Relief
            </p>
          </div>

          <a
            href={getWhatsAppUrl(customEnquiryMessage)}
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: theme.accent }}
            className="inline-flex items-center justify-center gap-2 hover:brightness-110 text-[#0b0b0e] font-semibold text-xs tracking-[0.16em] uppercase px-6 py-2.5 rounded-full transition-all shadow-md"
          >
            <MessageCircle className="w-4 h-4 fill-[#0b0b0e]" />
            <span>Enquire on WhatsApp</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
