import React from 'react';
import { STUDIO_CONFIG, getPhoneUrl, getWhatsAppUrl } from '../config/studioInfo';
import { useTheme } from '../context/ThemeContext';
import { Phone, MessageCircle } from 'lucide-react';

export default function AboutArtist() {
  const { theme } = useTheme();

  return (
    <section id="artist" className="relative py-16 sm:py-20 md:py-28 bg-[#0a0a0d] border-t border-[#1a1822]">
      <div className="absolute inset-0 bg-concrete-pattern opacity-25 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Authentic Portrait */}
          <div className="lg:col-span-5 relative max-w-md mx-auto lg:max-w-none w-full">
            <div className="relative rounded-lg overflow-hidden border border-[#2b2836] shadow-2xl bg-[#121117] group">
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src="/images/kavin-sirpi-portrait.png"
                  alt="Portrait of Master Sculptor Kavin Sirpi beside his Murugan Vel and Peacock relief sculpture"
                  className="w-full h-full object-cover object-top transform group-hover:scale-102 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              </div>

              {/* Bottom Portrait Name Plaque */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-[#0a0a0e]/90 backdrop-blur-md border border-[#282633] p-3 sm:p-4 rounded text-left">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-display text-sm sm:text-base font-normal text-[#fbf8f3]">
                      Kavin Sirpi
                    </p>
                    <p
                      className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em]"
                      style={{ color: theme.accent }}
                    >
                      Master Relief Sculptor
                    </p>
                  </div>
                  <span className="text-[10px] sm:text-xs text-[#a89f90] bg-[#1a1822] px-2.5 py-1 rounded border border-[#2e2a3b]">
                    Tamil Nadu, India
                  </span>
                </div>
              </div>

              {/* Corner accents */}
              <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[#d48b4e]/40 pointer-events-none" />
              <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[#d48b4e]/40 pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[#d48b4e]/40 pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[#d48b4e]/40 pointer-events-none" />
            </div>
          </div>

          {/* Right Column: Narrative */}
          <div className="lg:col-span-7 text-left">
            <div className="inline-flex items-center gap-3 mb-3">
              <span className="w-5 h-[1px]" style={{ backgroundColor: theme.accent }} />
              <span
                className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-medium"
                style={{ color: theme.accent }}
              >
                PHILOSOPHY & CRAFT
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-[#fbf8f3] tracking-wide mb-4 sm:mb-6 leading-tight">
              The Artist Behind the Art.
            </h2>

            <div className="space-y-3 sm:space-y-4 font-editorial text-base sm:text-lg text-[#ded3c1] leading-relaxed mb-6 sm:mb-8">
              <p>
                Kavin Sirpi creates bespoke handcrafted cement wall reliefs and sculptural murals, combining deep-rooted traditional Indian artistic heritage with contemporary architectural spaces.
              </p>
              <p className="text-[#a9a296]">
                For Kavin, the wall is not simply a divider of rooms, but an enduring canvas waiting to be given life. Through direct, in-situ sculpting with hand trowels and chisels, each elephant contour, dancing peacock plume, and sacred deity icon is sculpted directly into wet mortar.
              </p>
              <p className="text-[#a9a296]">
                Rejecting mass-produced synthetic casts, every commission is unique—calibrated to the client’s spatial proportions and the play of natural light across the wall surface.
              </p>
            </div>

            {/* Principles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-5 sm:pt-6 border-t border-[#201e28] mb-8 sm:mb-10">
              <div className="p-3.5 sm:p-4 rounded bg-[#121117] border border-[#22202a]">
                <span
                  className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] block mb-1 font-medium"
                  style={{ color: theme.accent }}
                >
                  Pure Craftsmanship
                </span>
                <p className="text-xs text-[#a9a296] leading-relaxed">
                  Every line and undercut is sculpted by hand directly on the wall substrate.
                </p>
              </div>

              <div className="p-3.5 sm:p-4 rounded bg-[#121117] border border-[#22202a]">
                <span
                  className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] block mb-1 font-medium"
                  style={{ color: theme.accent }}
                >
                  Living Architecture
                </span>
                <p className="text-xs text-[#a9a296] leading-relaxed">
                  Permanent cementitious bond engineered for residential villas, courtyards, and sanctums.
                </p>
              </div>
            </div>

            {/* Direct Connect Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <a
                href={getWhatsAppUrl("Hello Kavin Sirpi, I read about your artistic approach and would like to consult with you directly regarding a relief sculpture.")}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: theme.accent }}
                className="inline-flex items-center justify-center gap-2 hover:brightness-110 text-[#0b0b0e] font-semibold text-xs tracking-[0.2em] uppercase px-6 py-3.5 rounded-full transition-all duration-300 w-full sm:w-auto"
              >
                <MessageCircle className="w-4 h-4 fill-[#0b0b0e]" />
                <span>Speak with Kavin</span>
              </a>

              <a
                href={getPhoneUrl()}
                className="inline-flex items-center justify-center gap-2 border border-[#2e2c38] hover:border-[#d48b4e] text-[#ded3c1] hover:text-[#fbf8f3] font-medium text-xs tracking-[0.2em] uppercase px-6 py-3.5 rounded-full transition-all duration-300 w-full sm:w-auto"
              >
                <Phone className="w-4 h-4" style={{ color: theme.accent }} />
                <span>{STUDIO_CONFIG.displayPhone}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
