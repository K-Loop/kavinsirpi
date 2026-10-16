import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function IntroSplash({ onComplete }) {
  const { theme } = useTheme();
  const [phase, setPhase] = useState(0);
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      handleFinish();
      return;
    }

    const seen = sessionStorage.getItem('kavin_sirpi_intro_seen');
    if (seen === 'true') {
      onComplete();
      return;
    }

    const t1 = setTimeout(() => setPhase(1), 150);
    const t2 = setTimeout(() => setPhase(2), 800);
    const t3 = setTimeout(() => setPhase(3), 1500);
    const t4 = setTimeout(() => setPhase(4), 2300);
    const t5 = setTimeout(() => handleFinish(), 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  const handleFinish = () => {
    sessionStorage.setItem('kavin_sirpi_intro_seen', 'true');
    setIsSkipped(true);
    onComplete();
  };

  if (isSkipped) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#070709] transition-opacity duration-700 ease-in-out ${
        phase === 4 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        backgroundImage: 'radial-gradient(circle at center, #131217 0%, #060608 100%)',
      }}
      aria-label="Studio Intro Animation"
    >
      {/* Skip Button */}
      <button
        onClick={handleFinish}
        className="absolute top-6 right-6 z-50 text-[11px] tracking-[0.25em] uppercase text-[#a9a296] hover:text-[#fbf8f3] border border-[#2b2b36] hover:border-[#d48b4e] px-3.5 py-1.5 rounded-full transition-all duration-300"
      >
        Skip Intro
      </button>

      {/* Decorative architectural borders */}
      <div className="absolute inset-8 md:inset-12 border border-[#d48b4e]/15 pointer-events-none" />
      <div className="absolute top-8 left-8 md:top-12 md:left-12 w-4 h-4 border-t border-l border-[#d48b4e]/50 pointer-events-none" />
      <div className="absolute top-8 right-8 md:top-12 md:right-12 w-4 h-4 border-t border-r border-[#d48b4e]/50 pointer-events-none" />
      <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 w-4 h-4 border-b border-l border-[#d48b4e]/50 pointer-events-none" />
      <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 w-4 h-4 border-b border-r border-[#d48b4e]/50 pointer-events-none" />

      {/* Center Cinematic Content */}
      <div className="relative text-center px-6 max-w-xl mx-auto flex flex-col items-center">
        
        {/* Antique Bronze / Gold Line Illustration (Elephant Relief Silhouette & Lotus) */}
        <div
          className={`transition-all duration-700 ease-out transform ${
            phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <svg
            className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 text-[#d48b4e]"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="#d48b4e"
              strokeWidth="0.8"
              strokeDasharray="2 3"
              strokeOpacity="0.6"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#d48b4e"
              strokeWidth="1.2"
              strokeOpacity="0.4"
            />
            <path
              d="M32 62 C32 46, 42 34, 56 34 C68 34, 74 42, 74 54 C74 58, 71 62, 67 62 C63 62, 61 58, 62 52 C63 46, 59 42, 53 42 C45 42, 40 48, 40 56 L40 66"
              stroke="#e7a369"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M48 60 C42 62, 38 60, 36 54"
              stroke="#fbf8f3"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M56 38 C52 42, 50 48, 52 56"
              stroke="#d48b4e"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M26 72 C36 68, 44 74, 50 74 C56 74, 64 68, 74 72 C68 78, 58 79, 50 79 C42 79, 32 78, 26 72 Z"
              fill="#d48b4e"
              fillOpacity="0.15"
              stroke="#d48b4e"
              strokeWidth="1.2"
            />
          </svg>
        </div>

        {/* Studio Name Reveal in Marcellus / Display */}
        <div
          className={`transition-all duration-700 ease-out transform ${
            phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="text-[10px] md:text-xs tracking-[0.35em] uppercase text-[#a9a296] font-light block mb-2">
            ATELIER OF ARCHITECTURAL RELIEF
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-normal tracking-[0.18em] text-[#fbf8f3] mb-3">
            KAVIN SIRPI
          </h1>
        </div>

        {/* Tagline Reveal */}
        <div
          className={`transition-all duration-700 ease-out transform ${
            phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="font-editorial italic text-lg md:text-xl tracking-[0.2em] text-[#d48b4e] font-normal">
            “ART CARVED INTO WALLS.”
          </p>
        </div>

        {/* Animated Bronze Hairline Sweep */}
        <div
          className={`mt-8 h-[1px] bg-gradient-to-r from-transparent via-[#d48b4e] to-transparent transition-all duration-1000 ease-in-out ${
            phase >= 3 ? 'w-64 opacity-80' : 'w-0 opacity-0'
          }`}
        />
      </div>
    </div>
  );
}
