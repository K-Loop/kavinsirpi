import React from 'react';
import { STUDIO_CONFIG, getPhoneUrl, getWhatsAppUrl } from '../config/studioInfo';
import { useTheme } from '../context/ThemeContext';
import { ArrowUp, Phone, MessageCircle } from 'lucide-react';

export default function Footer() {
  const { theme } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#07070a] border-t border-[#1a1922] pt-16 pb-12 text-left">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-[#1a1922]">
          
          {/* Col 1: Studio Wordmark & Mission */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <span className="font-display text-2xl font-normal tracking-[0.2em] text-[#fbf8f3]">
                KAVIN SIRPI
              </span>
              <span className="block text-[10px] tracking-[0.3em] uppercase text-[#a9a296] font-light mt-1">
                ATELIER OF ARCHITECTURAL CEMENT RELIEF
              </span>
            </div>

            <p className="font-editorial text-base text-[#9e9488] max-w-sm leading-relaxed">
              Handcrafted in-situ cement wall sculptures, elephant reliefs, and temple artworks that transform modern architecture into lasting sculptural legacies.
            </p>

            <p className="text-xs text-[#8c8475]">
              {STUDIO_CONFIG.serviceScope}
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <span
              className="text-[10px] uppercase tracking-[0.25em] font-medium block mb-2"
              style={{ color: theme.accent }}
            >
              PORTFOLIO
            </span>
            <ul className="space-y-2 text-xs uppercase tracking-[0.15em] text-[#cfc4b2]">
              <li>
                <a href="#artworks" className="hover:text-[#fbf8f3] transition-colors">Elephant Sculptures</a>
              </li>
              <li>
                <a href="#artworks" className="hover:text-[#fbf8f3] transition-colors">Peacock & Nature Murals</a>
              </li>
              <li>
                <a href="#artworks" className="hover:text-[#fbf8f3] transition-colors">Temple & Sacred Art</a>
              </li>
              <li>
                <a href="#signature-project" className="hover:text-[#fbf8f3] transition-colors">Wall Transformation</a>
              </li>
              <li>
                <a href="#craftsmanship" className="hover:text-[#fbf8f3] transition-colors">The 4-Step Process</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Consultation */}
          <div className="lg:col-span-4 space-y-4">
            <span
              className="text-[10px] uppercase tracking-[0.25em] font-medium block mb-2"
              style={{ color: theme.accent }}
            >
              DIRECT CONSULTATION
            </span>
            
            <p className="text-xs text-[#9e9488] leading-relaxed">
              For new architectural projects, renovations, and custom villa commissions:
            </p>

            <div className="space-y-2.5">
              <a
                href={getPhoneUrl()}
                className="flex items-center gap-2.5 text-xs text-[#eee7dc] hover:text-[#fbf8f3] transition-colors"
              >
                <Phone className="w-4 h-4" style={{ color: theme.accent }} />
                <span>{STUDIO_CONFIG.displayPhone}</span>
              </a>

              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-xs text-[#eee7dc] hover:text-[#fbf8f3] transition-colors"
              >
                <MessageCircle className="w-4 h-4" style={{ color: theme.accent }} />
                <span>WhatsApp Instant Inquiry</span>
              </a>
            </div>

            <p className="text-[11px] text-[#695e4e]">
              Available Monday – Saturday, 9:00 AM – 8:00 PM IST
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#695e4e]">
          <p>© {new Date().getFullYear()} Kavin Sirpi. All original relief sculptures and imagery hand-crafted in cement.</p>
          
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-[#a9a296] hover:text-[#fbf8f3] transition-colors"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
