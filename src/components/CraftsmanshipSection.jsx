import React from 'react';
import { PROCESS_STEPS } from '../data/artworksData';
import { useTheme } from '../context/ThemeContext';
import { Hammer, Sparkles, Layers, Compass } from 'lucide-react';

export default function CraftsmanshipSection() {
  const { theme } = useTheme();

  const stepIcons = [
    <Compass className="w-5 h-5" style={{ color: theme.accent }} />,
    <Layers className="w-5 h-5" style={{ color: theme.accent }} />,
    <Hammer className="w-5 h-5" style={{ color: theme.accent }} />,
    <Sparkles className="w-5 h-5" style={{ color: theme.accent }} />
  ];

  return (
    <section id="craftsmanship" className="relative py-28 bg-[#0c0c0e] border-t border-[#1a1922]">
      <div className="absolute inset-0 bg-concrete-pattern opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 text-left">
          <div className="inline-flex items-center gap-3 mb-3">
            <span className="w-5 h-[1px]" style={{ backgroundColor: theme.accent }} />
            <span
              className="text-[11px] uppercase tracking-[0.25em] font-medium"
              style={{ color: theme.accent }}
            >
              THE ARTISANAL METHOD
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal text-[#fbf8f3] tracking-wide mb-4">
            From Raw Cement to Living Art.
          </h2>
          <p className="font-editorial text-lg text-[#b8ad9c] leading-relaxed">
            Cement relief sculpting is an uncompromising discipline. Unlike soft clay or plaster, cement begins its cure within hours, demanding anatomical mastery, swift chisel maneuvers, and decades of muscle memory.
          </p>
        </div>

        {/* Wide Hero Image of Sculptor at Work */}
        <div className="relative rounded-lg overflow-hidden border border-[#282633] mb-20 shadow-2xl group">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] lg:aspect-[2.3/1] bg-[#121117] overflow-hidden">
            <img
              src="/images/difference main/image copy 2.png"
              alt="Master Indian sculptor Kavin hand-carving wet cement on architectural wall mural scaffolding"
              className="w-full h-full object-cover object-center transform group-hover:scale-102 transition-transform duration-1000 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0e]/70 via-transparent to-transparent hidden md:block" />
          </div>

          <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-auto max-w-lg bg-[#0a0a0d]/90 backdrop-blur-md border border-[#282633] p-5 rounded text-left">
            <span
              className="text-[10px] uppercase tracking-[0.25em] font-semibold block mb-1"
              style={{ color: theme.accent }}
            >
              AUTHENTIC IN-SITU SCULPTING
            </span>
            <p className="text-sm font-display font-medium text-[#fbf8f3] mb-1">
              Hands Against the Mortar
            </p>
            <p className="text-xs text-[#a9a296] font-light leading-relaxed">
              Every curve of the elephant trunk, feather contour, and divine arch is hand-tooled with bespoke chisels while the mortar cures on your structural wall.
            </p>
          </div>
        </div>

        {/* Four Steps */}
        <div className="relative">
          <div
            className="hidden lg:block absolute top-10 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-[#d48b4e]/40 to-transparent z-0"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {PROCESS_STEPS.map((step, idx) => (
              <div
                key={step.step}
                className="bg-[#121117] border border-[#22202a] hover:border-[#d48b4e]/60 rounded-lg p-6 sm:p-7 flex flex-col justify-between text-left transition-all duration-300 hover:-translate-y-1 shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className="font-display text-2xl font-normal"
                      style={{ color: theme.accent }}
                    >
                      {step.step}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-[#181622] border border-[#2a2838] flex items-center justify-center">
                      {stepIcons[idx]}
                    </div>
                  </div>

                  <h3 className="font-display text-lg font-normal text-[#fbf8f3] mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs font-medium text-[#cfc4b2] mb-3 leading-relaxed">
                    {step.summary}
                  </p>

                  <p className="font-editorial text-sm text-[#8c8475] leading-relaxed">
                    {step.details}
                  </p>
                </div>

                <div
                  className="mt-6 pt-4 border-t border-[#1b1924] text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: theme.accent }}
                >
                  Phase {idx + 1} Execution
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Artisanal Commitment Bar */}
        <div className="mt-16 p-6 rounded-lg bg-[#14131a]/80 border border-[#262432] flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="max-w-2xl">
            <h4 className="text-sm uppercase tracking-[0.2em] font-medium text-[#fbf8f3] mb-1">
              Direct Masonry Bonding vs. Factory Precasts
            </h4>
            <p className="text-xs text-[#a9a296]">
              We do not glue synthetic lightweight plaster or FRP casts onto your wall. Our sculptures are monolithic cement bonds that endure as long as the building structure itself.
            </p>
          </div>
          <div className="whitespace-nowrap">
            <span
              style={{ color: theme.accent, borderColor: `${theme.accent}60` }}
              className="text-xs uppercase tracking-[0.2em] font-medium border px-4 py-2 rounded-full"
            >
              Lifetime Durability
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
