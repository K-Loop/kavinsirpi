import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Palette, Check, Sparkles } from 'lucide-react';

export default function PaletteSwitcher() {
  const { currentPalette, setPalette, palettes, theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ borderColor: theme.border, backgroundColor: theme.cardBg }}
        className="flex items-center gap-2.5 px-3.5 py-2 rounded-full border text-xs tracking-wider uppercase text-[#eee7dc] hover:text-white shadow-2xl transition-all duration-300 hover:scale-105 focus:outline-none"
        title="Change Studio Palette & Typography"
      >
        <span
          className="w-3.5 h-3.5 rounded-full border border-black/30"
          style={{ backgroundColor: theme.accent }}
        />
        <span className="hidden sm:inline text-[11px] font-medium tracking-[0.15em]">
          Palette: {theme.name.split('&')[0]}
        </span>
        <Palette className="w-3.5 h-3.5 text-[#a9a296]" />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
          className="absolute bottom-12 left-0 w-72 p-4 rounded-xl border shadow-2xl animate-fade-in text-left z-50 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#282633]">
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#a9a296] flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#d48b4e]" />
              Select Studio Atmosphere
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-[#8c827a] hover:text-white p-1"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2">
            {Object.values(palettes).map((p) => {
              const isSelected = currentPalette === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setPalette(p.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-all text-left ${
                    isSelected
                      ? 'border-[#d48b4e] bg-[#22202a]'
                      : 'border-transparent hover:bg-[#1a1922] opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-4 h-4 rounded-full shadow-inner border border-white/20"
                      style={{ backgroundColor: p.accent }}
                    />
                    <div>
                      <p className="text-xs font-medium text-[#fbf8f3] tracking-wide">
                        {p.name}
                      </p>
                      <p className="text-[10px] text-[#9e9488]">
                        {p.id === 'bronze' ? 'Marcellus & Outfit' : p.id === 'champagne' ? 'Cinzel & Clean Sans' : 'Italiana & Warm Clay'}
                      </p>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-[#d48b4e]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
