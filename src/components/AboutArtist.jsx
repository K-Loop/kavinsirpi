import React from 'react';
import { STUDIO_CONFIG, getPhoneUrl, getWhatsAppUrl } from '../config/studioInfo';
import { useTheme } from '../context/ThemeContext';
import { Phone, MessageCircle, User } from 'lucide-react';

export default function AboutArtist() {
  const { theme } = useTheme();

  return (
    <section id="artist" className="relative py-20 md:py-24 bg-[#0a0a0d] border-t border-[#1a1822]">
      <div id="contact-direct" className="absolute -top-12" />
      <div className="absolute inset-0 bg-concrete-pattern opacity-25 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Artist Portrait Card */}
          <div className="md:col-span-5 max-w-sm mx-auto md:max-w-none w-full">
            <div className="relative rounded-xl overflow-hidden border border-[#2b2836] bg-[#121117] shadow-2xl p-6 text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-[#1b1924] border border-[#332f42] flex items-center justify-center mb-4 shadow-inner">
                <User className="w-10 h-10" style={{ color: theme.accent }} />
              </div>

              <h3 className="font-display text-xl text-[#fbf8f3] tracking-wide mb-1">
                Kavin Sirpi
              </h3>
              <p
                className="text-xs uppercase tracking-[0.2em] font-medium mb-3"
                style={{ color: theme.accent }}
              >
                Master Relief Sculptor
              </p>
              <span className="inline-block text-xs text-[#a89f90] bg-[#1a1822] px-3 py-1 rounded-full border border-[#2e2a3b]">
                Tamil Nadu, India
              </span>
            </div>
          </div>

          {/* Artist Narrative & Direct Actions */}
          <div className="md:col-span-7 text-left space-y-5">
            <div className="inline-flex items-center gap-3">
              <span className="w-5 h-[1px]" style={{ backgroundColor: theme.accent }} />
              <span
                className="text-[11px] uppercase tracking-[0.25em] font-medium"
                style={{ color: theme.accent }}
              >
                ABOUT THE ARTIST
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-normal text-[#fbf8f3] tracking-wide leading-tight">
              The Artist Behind the Art
            </h2>

            <div className="font-editorial text-base sm:text-lg text-[#ded3c1] leading-relaxed space-y-3">
              <p>
                Kavin Sirpi creates bespoke handcrafted cement wall reliefs and murals, blending traditional Indian sculptural heritage with contemporary architectural spaces.
              </p>
              <p className="text-[#a9a296]">
                Every artwork is sculpted directly on the wall in wet mortar using hand trowels and chisels—delivering a permanent, weather-resistant sculptural legacy for homes, courtyards, and sanctums.
              </p>
            </div>

            {/* Direct Connect Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
              <a
                href={getWhatsAppUrl("Hello Kavin Sirpi, I would like to discuss a custom cement relief sculpture commission.")}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: theme.accent }}
                className="inline-flex items-center justify-center gap-2 hover:brightness-110 text-[#0b0b0e] font-semibold text-xs tracking-[0.2em] uppercase px-6 py-3.5 rounded-full transition-all duration-300 shadow-lg"
              >
                <MessageCircle className="w-4 h-4 fill-[#0b0b0e]" />
                <span>Speak on WhatsApp</span>
              </a>

              <a
                href={getPhoneUrl()}
                className="inline-flex items-center justify-center gap-2 border border-[#2e2c38] hover:border-[#d48b4e] text-[#ded3c1] hover:text-[#fbf8f3] font-medium text-xs tracking-[0.2em] uppercase px-6 py-3.5 rounded-full transition-all duration-300"
              >
                <Phone className="w-4 h-4" style={{ color: theme.accent }} />
                <span>Call {STUDIO_CONFIG.displayPhone}</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
