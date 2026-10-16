import React, { useState } from 'react';
import { getWhatsAppUrl } from '../config/studioInfo';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloatingButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center">
      {/* Tooltip on hover */}
      {showTooltip && (
        <div className="hidden sm:block mr-3 bg-[#0d0d12]/95 backdrop-blur-md text-[#f4f0eb] border border-[#2d2d38] text-xs px-3.5 py-1.5 rounded-full shadow-2xl tracking-wide whitespace-nowrap animate-fade-in">
          Enquire directly with Kavin Sirpi
        </div>
      )}

      {/* Button */}
      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative group flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#1e231c] border border-[#3b4737] hover:border-[#25d366] text-[#25d366] hover:text-[#25d366] shadow-2xl transition-all duration-300 hover:scale-105 focus:outline-none"
        aria-label="Chat with Kavin Sirpi on WhatsApp"
      >
        {/* Subtle breathing ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25d366]/20 animate-ping opacity-60 pointer-events-none" />

        {/* WhatsApp Icon */}
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-[#25d366] text-[#1e231c]" />
      </a>
    </div>
  );
}
