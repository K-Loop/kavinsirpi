import React, { useState, useRef, useCallback } from 'react';
import { SIGNATURE_PROJECT } from '../data/artworksData';
import { useTheme } from '../context/ThemeContext';
import { SlidersHorizontal, CheckCircle2, ArrowRight } from 'lucide-react';
import { getWhatsAppUrl } from '../config/studioInfo';

export default function SignatureProject() {
  const { theme } = useTheme();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percent = (x / rect.width) * 100;
    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = (e) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const startDrag = () => setIsDragging(true);
  const stopDrag = () => setIsDragging(false);

  return (
    <section id="signature-project" className="relative py-28 bg-[#0a0a0d] border-t border-[#1a1822]">
      <div className="absolute inset-0 bg-concrete-pattern opacity-25 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 text-left">
          <div className="inline-flex items-center gap-3 mb-3">
            <span className="w-5 h-[1px]" style={{ backgroundColor: theme.accent }} />
            <span
              className="text-[11px] uppercase tracking-[0.25em] font-medium"
              style={{ color: theme.accent }}
            >
              SIGNATURE TRANSFORMATION
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal text-[#fbf8f3] tracking-wide mb-4">
            From Raw Masonry to Living Architecture
          </h2>
          <p className="font-editorial text-lg text-[#b8ad9c] leading-relaxed">
            Drag the comparison slider below to see how a bare structural brick wall was directly hand-carved into a timeless 3D cement masterpiece.
          </p>
        </div>

        {/* Interactive Before & After Comparison Slider */}
        <div className="relative mb-14">
          <div
            ref={containerRef}
            onMouseDown={startDrag}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-lg overflow-hidden border border-[#282633] shadow-2xl select-none cursor-ew-resize bg-[#0f0e14]"
          >
            {/* Background Image: "AFTER" */}
            <img
              src={SIGNATURE_PROJECT.afterImage}
              alt="Finished Hand-Carved Cement Elephant Relief Mural by Kavin Sirpi"
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
            />

            {/* Foreground Image: "BEFORE" using clipPath for perfect 1:1 overlay */}
            <img
              src={SIGNATURE_PROJECT.beforeImage}
              alt="Raw wall with grid and scored mortar before sculpting"
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
              style={{
                clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
              }}
            />

            {/* Dividing Line & Draggable Handle */}
            <div
              className="absolute top-0 bottom-0 z-30 w-[2px] pointer-events-none"
              style={{ left: `${sliderPosition}%`, backgroundColor: theme.accent }}
            >
              <div
                style={{ borderColor: theme.accent, color: theme.accent }}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#0a0a0d] border-2 shadow-2xl flex items-center justify-center"
              >
                <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5 rotate-90" />
              </div>
            </div>

            {/* Labels overlay */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none bg-[#0a0a0d]/85 backdrop-blur-md border border-[#2b2836] px-3 py-1.5 rounded">
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#cfc4b2]">
                BEFORE: RAW WALL
              </span>
            </div>

            <div className="absolute top-4 right-4 z-20 pointer-events-none bg-[#0a0a0d]/85 backdrop-blur-md border border-[#2b2836] px-3 py-1.5 rounded">
              <span
                className="text-[10px] uppercase tracking-[0.2em] font-medium"
                style={{ color: theme.accent }}
              >
                AFTER: 3D CEMENT MURAL
              </span>
            </div>

            {/* Bottom helper prompt */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-[#0a0a0d]/85 backdrop-blur-md border border-[#282633] px-4 py-1.5 rounded-full text-center">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#a9a296]">
                DRAG SLIDER TO REVEAL
              </span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex justify-center items-center gap-3 mt-4">
            <button
              onClick={() => setSliderPosition(100)}
              style={sliderPosition >= 90 ? { borderColor: theme.accent, color: '#fbf8f3', backgroundColor: '#1a1922' } : {}}
              className="text-xs uppercase tracking-[0.18em] px-4 py-1.5 rounded-full border border-[#282633] text-[#8c8475] hover:text-[#ded3c1] transition-all"
            >
              View Raw Wall
            </button>
            <button
              onClick={() => setSliderPosition(50)}
              style={sliderPosition > 20 && sliderPosition < 80 ? { borderColor: theme.accent, color: '#fbf8f3', backgroundColor: '#1a1922' } : {}}
              className="text-xs uppercase tracking-[0.18em] px-4 py-1.5 rounded-full border border-[#282633] text-[#8c8475] hover:text-[#ded3c1] transition-all"
            >
              Split 50 / 50
            </button>
            <button
              onClick={() => setSliderPosition(0)}
              style={sliderPosition <= 10 ? { borderColor: theme.accent, color: '#fbf8f3', backgroundColor: '#1a1922' } : {}}
              className="text-xs uppercase tracking-[0.18em] px-4 py-1.5 rounded-full border border-[#282633] text-[#8c8475] hover:text-[#ded3c1] transition-all"
            >
              View Finished Relief
            </button>
          </div>
        </div>

        {/* Project Editorial Case Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 md:p-10 rounded-lg bg-[#0e0d13] border border-[#22202a]">
          <div className="lg:col-span-7 text-left">
            <span
              className="text-[10px] uppercase tracking-[0.25em] block mb-2 font-medium"
              style={{ color: theme.accent }}
            >
              PROJECT CASE STUDY
            </span>
            <h3 className="font-display text-2xl md:text-3xl font-normal text-[#fbf8f3] mb-4">
              {SIGNATURE_PROJECT.title}
            </h3>
            <p className="font-editorial text-base md:text-lg text-[#cfc4b2] leading-relaxed mb-6">
              {SIGNATURE_PROJECT.description}
            </p>

            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5 text-xs text-[#a9a296]">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: theme.accent }} />
                <span>Permanent architectural bonding that never peels, bubbles, or warps like synthetic wallpapers or fiber panels.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-[#a9a296]">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: theme.accent }} />
                <span>Deep structural relief (2–6 inches) designed specifically to catch dynamic room raking light.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#1f1d28] pt-6 lg:pt-0 lg:pl-8 text-left">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8c8475] block">Wall Dimensions</span>
                <span className="text-sm font-medium text-[#fbf8f3]">{SIGNATURE_PROJECT.wallSize}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8c8475] block">Material & Mixture</span>
                <span className="text-sm font-medium text-[#fbf8f3]">{SIGNATURE_PROJECT.material}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8c8475] block">Sculpting Method</span>
                <span className="text-sm font-medium text-[#fbf8f3]">{SIGNATURE_PROJECT.executionTime}</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#1f1d28]">
              <a
                href={getWhatsAppUrl("Hello Kavin Sirpi, I saw the Before-and-After transformation of The Royal Tusker wall and would like to discuss transforming my wall.")}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: theme.accent }}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold hover:brightness-125 transition-colors"
              >
                <span>Discuss Your Wall Transformation</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
