import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../config/studioInfo';
import { useTheme } from '../context/ThemeContext';

export default function ProjectLightbox({ artwork, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const { theme } = useTheme();

  const handleClose = React.useCallback(() => {
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

  if (!artwork) return null;

  const customEnquiryMessage = `Hello Kavin Sirpi, I am interested in commissioning a sculpture similar to "${artwork.title}" (${artwork.category}). Could you please share more details?`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={artwork.title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#07070a]/95 backdrop-blur-xl p-4 sm:p-6 md:p-10 animate-fade-in"
    >
      <div className="absolute inset-0" onClick={handleClose} />

      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-6 right-6 z-50 p-2.5 rounded-full bg-[#16151c] text-[#ded3c1] hover:text-[#fbf8f3] border border-[#2c2a38] hover:border-[#d48b4e] transition-colors focus:outline-none"
        aria-label="Close Lightbox"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Prev Navigation Button */}
      {hasPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-[#131218]/90 text-[#eee7dc] hover:text-[#fbf8f3] border border-[#2c2a38] hover:border-[#d48b4e] transition-all hover:scale-110"
          aria-label="Previous Artwork"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next Navigation Button */}
      {hasNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-[#131218]/90 text-[#eee7dc] hover:text-[#fbf8f3] border border-[#2c2a38] hover:border-[#d48b4e] transition-all hover:scale-110"
          aria-label="Next Artwork"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 max-w-6xl w-full max-h-[90vh] bg-[#0c0c10] border border-[#262432] rounded-lg shadow-2xl flex flex-col lg:flex-row overflow-hidden"
      >
        {/* Left Side: Large Full-Aspect Image */}
        <div className="lg:w-2/3 bg-[#08080a] flex items-center justify-center p-4 sm:p-6 overflow-hidden relative">
          <img
            src={artwork.image}
            alt={artwork.title}
            className="max-h-[60vh] lg:max-h-[80vh] w-auto max-w-full object-contain rounded"
          />

          <div className="flex md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 gap-4 bg-[#111116]/80 backdrop-blur-md px-4 py-2 rounded-full border border-[#2d2a38]">
            <button
              onClick={onPrev}
              disabled={!hasPrev}
              className={`p-1 ${hasPrev ? 'text-[#fbf8f3]' : 'text-stone-600'}`}
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs text-[#a9a296] self-center">Navigate</span>
            <button
              onClick={onNext}
              disabled={!hasNext}
              className={`p-1 ${hasNext ? 'text-[#fbf8f3]' : 'text-stone-600'}`}
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Side: Information */}
        <div className="lg:w-1/3 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto border-t lg:border-t-0 lg:border-l border-[#22202a] bg-[#0e0d13]">
          <div>
            <span
              style={{ color: theme.accent, borderColor: `${theme.accent}40` }}
              className="inline-block text-[10px] uppercase tracking-[0.25em] font-medium border px-2.5 py-1 rounded mb-4"
            >
              {artwork.category}
            </span>

            <h2 className="font-display text-2xl font-normal text-[#fbf8f3] mb-4 leading-tight">
              {artwork.title}
            </h2>

            <p className="font-editorial text-base text-[#cfc4b2] leading-relaxed mb-6">
              {artwork.description}
            </p>

            <div className="space-y-3.5 py-4 border-y border-[#1e1c26] text-xs">
              {artwork.medium && (
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#8c8475]">Medium & Technique</span>
                  <span className="text-[#ded3c1] font-medium mt-0.5">{artwork.medium}</span>
                </div>
              )}
              {artwork.dimensions && (
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#8c8475]">Dimensions / Scope</span>
                  <span className="text-[#ded3c1] font-medium mt-0.5">{artwork.dimensions}</span>
                </div>
              )}
            </div>

            {artwork.highlights && artwork.highlights.length > 0 && (
              <div className="mt-5">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8c8475] block mb-2">Artisan Highlights</span>
                <ul className="space-y-1.5 text-xs text-[#a9a296]">
                  {artwork.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accent }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-[#1e1c26]">
            <a
              href={getWhatsAppUrl(customEnquiryMessage)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: theme.accent }}
              className="w-full flex items-center justify-center gap-2 hover:brightness-110 text-[#0b0b0e] font-semibold text-xs tracking-[0.18em] uppercase py-3.5 px-4 rounded-full transition-all duration-300 shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-[#0b0b0e]" />
              <span>Enquire on WhatsApp</span>
            </a>
            <p className="text-[10px] text-center text-[#8c8475] mt-2">
              Discuss similar custom relief with Kavin Sirpi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
