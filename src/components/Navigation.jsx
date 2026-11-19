import React, { useState, useEffect, useRef } from 'react';
import { STUDIO_CONFIG, getWhatsAppUrl, getPhoneUrl } from '../config/studioInfo';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Phone, MessageCircle } from 'lucide-react';

export default function Navigation() {
  const { theme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setIsScrolled(currentScrollY > 20);

      const scrollDiff = currentScrollY - lastScrollY.current;
      // Scroll delta threshold to avoid accidental micro-toggles
      if (Math.abs(scrollDiff) > 6) {
        if (currentScrollY > 70 && scrollDiff > 0) {
          // Scrolling down -> hide navbar smoothly
          setIsVisible(false);
          setIsMobileMenuOpen(false);
        } else {
          // Scrolling up or at top -> reveal navbar
          setIsVisible(true);
        }
        lastScrollY.current = currentScrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Gallery', href: '#artworks' },
    { name: 'Atelier Hero', href: '#hero' },
    { name: 'The Artist', href: '#artist' },
    { name: 'Contact', href: '#contact-direct' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      } ${
        isScrolled
          ? 'bg-[#0a0a0d]/75 backdrop-blur-xl border-b border-white/[0.08] py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
          : 'bg-[#0a0a0d]/50 backdrop-blur-md border-b border-white/[0.04] py-4 md:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Studio Wordmark */}
        <a
          href="#"
          className="group flex flex-col items-start focus:outline-none"
          aria-label="Kavin Sirpi Home"
        >
          <span className="font-display text-lg md:text-xl tracking-[0.22em] text-[#fbf8f3] group-hover:text-[#d48b4e] transition-colors font-medium">
            KAVIN SIRPI
          </span>
          <span className="text-[9px] tracking-[0.3em] uppercase text-[#a9a296] font-light">
            CEMENT RELIEF ATELIER
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs uppercase tracking-[0.2em] text-[#cfc4b2] hover:text-[#f2bc88] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#d48b4e] hover:after:w-full after:transition-all after:duration-300"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Quick Contact Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={getPhoneUrl()}
            className="flex items-center gap-2 text-xs tracking-wider uppercase text-[#cfc4b2] hover:text-[#fbf8f3] px-3.5 py-1.5 border border-[#2d2a36] hover:border-[#d48b4e]/60 rounded-full transition-colors backdrop-blur-md bg-black/20"
            title="Call Kavin Sirpi directly"
          >
            <Phone className="w-3.5 h-3.5 text-[#d48b4e]" />
            <span className="text-[11px]">{STUDIO_CONFIG.displayPhone}</span>
          </a>

          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: theme.accent }}
            className="flex items-center gap-2 hover:brightness-110 text-[#0b0b0e] font-semibold text-xs tracking-[0.16em] uppercase px-4 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-[#0b0b0e]" />
            <span>Enquire</span>
          </a>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-[#cfc4b2] hover:text-[#fbf8f3] focus:outline-none"
            aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer (Glassmorphic) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-full bg-[#0a0a0d]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-8 shadow-2xl animate-fade-in">
          <nav className="flex flex-col gap-4 text-center mb-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm uppercase tracking-[0.25em] text-[#ded3c1] hover:text-[#d48b4e] py-1.5 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4 border-t border-[#22202a]">
            <a
              href={getPhoneUrl()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs tracking-wider uppercase text-[#cfc4b2] border border-[#2d2a36] px-5 py-2.5 rounded-full"
            >
              <Phone className="w-4 h-4 text-[#d48b4e]" />
              <span>Call: {STUDIO_CONFIG.displayPhone}</span>
            </a>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: theme.accent }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-[#0b0b0e] font-semibold text-xs tracking-widest uppercase px-6 py-2.5 rounded-full"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Chat</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
