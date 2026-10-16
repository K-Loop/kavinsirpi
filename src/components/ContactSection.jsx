import React, { useState } from 'react';
import { STUDIO_CONFIG, getPhoneUrl, getWhatsAppUrl } from '../config/studioInfo';
import { useTheme } from '../context/ThemeContext';
import { Phone, MessageCircle, Send, Camera } from 'lucide-react';

export default function ContactSection() {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    projectType: 'Elephant Sculpture Relief',
    location: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendViaWhatsApp = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("Please enter your name and phone number.");
      return;
    }

    const message = `Hello Kavin Sirpi,
I would like to enquire about a custom cement relief project:
• Name: ${formData.name}
• Phone: ${formData.phone}
• Artwork Type: ${formData.projectType}
• Location / City: ${formData.location || 'Not specified'}
• Space / Notes: ${formData.message || 'Looking for details and consultation'}`;

    window.open(getWhatsAppUrl(message), '_blank');
    setFormSubmitted(true);
  };

  return (
    <section id="contact" className="relative py-28 bg-[#121115] border-t border-[#24222c]">
      <div className="absolute inset-0 bg-concrete-pattern opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-3">
            <span className="w-5 h-[1px]" style={{ backgroundColor: theme.accent }} />
            <span
              className="text-[11px] uppercase tracking-[0.25em] font-medium"
              style={{ color: theme.accent }}
            >
              COMMISSION AN ARTWORK
            </span>
            <span className="w-5 h-[1px]" style={{ backgroundColor: theme.accent }} />
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal text-[#fbf8f3] tracking-wide mb-4">
            Have a Wall Worth Transforming?
          </h2>

          <p className="font-editorial text-lg md:text-xl text-[#ded3c1] leading-relaxed max-w-2xl mx-auto">
            Tell us about your space, your vision, and the artwork you have in mind.
          </p>
        </div>

        {/* Direct Immediate Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
          {/* Card 1: Direct Phone Call */}
          <div className="p-7 rounded-lg bg-[#17161e] border border-[#292735] hover:border-[#d48b4e]/60 transition-all text-left flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#1e1d28] border border-[#322f42] flex items-center justify-center mb-4">
                <Phone className="w-5 h-5" style={{ color: theme.accent }} />
              </div>
              <h3 className="font-display text-lg font-normal text-[#fbf8f3] mb-1">
                Direct Telephone
              </h3>
              <p className="text-xs text-[#a9a296] mb-4">
                Speak directly with master sculptor Kavin regarding feasibility, site visits, and project schedules.
              </p>
            </div>
            <a
              href={getPhoneUrl()}
              className="inline-flex items-center justify-center gap-2 bg-[#1e1d27] hover:bg-[#252431] border border-[#333042] hover:border-[#d48b4e] text-[#fbf8f3] font-semibold text-xs tracking-[0.18em] uppercase py-3.5 px-6 rounded-full transition-all"
            >
              <Phone className="w-4 h-4" style={{ color: theme.accent }} />
              <span>Call Now: {STUDIO_CONFIG.displayPhone}</span>
            </a>
          </div>

          {/* Card 2: WhatsApp Chat */}
          <div className="p-7 rounded-lg bg-[#17161e] border border-[#292735] hover:border-[#d48b4e]/60 transition-all text-left flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#1e1d28] border border-[#322f42] flex items-center justify-center mb-4">
                <MessageCircle className="w-5 h-5" style={{ color: theme.accent }} />
              </div>
              <h3 className="font-display text-lg font-normal text-[#fbf8f3] mb-1">
                WhatsApp Consultation
              </h3>
              <p className="text-xs text-[#a9a296] mb-4">
                Send photographs of your wall, dimensions, or design references for instant assessment and pricing.
              </p>
            </div>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: theme.accent }}
              className="inline-flex items-center justify-center gap-2 hover:brightness-110 text-[#0b0b0e] font-semibold text-xs tracking-[0.18em] uppercase py-3.5 px-6 rounded-full transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-[#0b0b0e]" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Project Enquiry Form */}
        <div className="max-w-4xl mx-auto p-8 sm:p-10 rounded-xl bg-[#16151c] border border-[#292735] shadow-2xl">
          <div className="text-left mb-8">
            <h3 className="font-display text-xl font-normal text-[#fbf8f3] mb-2">
              Commission Enquiry Form
            </h3>
            <p className="font-editorial text-sm text-[#b8ad9c]">
              Provide details about your project space. You can submit directly via WhatsApp or receive a prompt callback.
            </p>
          </div>

          <form onSubmit={handleSendViaWhatsApp} className="space-y-6 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] text-[#a9a296] mb-2 font-medium">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Anandha Kumar"
                  className="w-full bg-[#0e0d13] border border-[#282635] focus:border-[#d48b4e] rounded px-4 py-3 text-sm text-[#fbf8f3] placeholder-[#666373] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] text-[#a9a296] mb-2 font-medium">
                  Phone / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-[#0e0d13] border border-[#282635] focus:border-[#d48b4e] rounded px-4 py-3 text-sm text-[#fbf8f3] placeholder-[#666373] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] text-[#a9a296] mb-2 font-medium">
                  Artform / Category
                </label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className="w-full bg-[#0e0d13] border border-[#282635] focus:border-[#d48b4e] rounded px-4 py-3 text-sm text-[#fbf8f3] focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="Elephant Sculpture Relief">High-Relief Elephant Sculpture</option>
                  <option value="Peacock & Nature Relief">Peacock & Flora Wall Mural</option>
                  <option value="Temple / Religious Art">Lord Ganesha / Temple Sacred Art</option>
                  <option value="Custom Living Room Feature">Custom Living Room Feature Wall</option>
                  <option value="Architectural Courtyard Relief">Exterior Courtyard / Compound Relief</option>
                  <option value="Bespoke Traditional Motifs">Bespoke Traditional Indian Relief</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] text-[#a9a296] mb-2 font-medium">
                  Site Location / City
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Chennai, Coimbatore, Bangalore"
                  className="w-full bg-[#0e0d13] border border-[#282635] focus:border-[#d48b4e] rounded px-4 py-3 text-sm text-[#fbf8f3] placeholder-[#666373] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-[#a9a296] mb-2 font-medium">
                Wall Dimensions & Vision (Optional)
              </label>
              <textarea
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                placeholder="Share wall width/height, whether interior or exterior, and any specific motifs you would like..."
                className="w-full bg-[#0e0d13] border border-[#282635] focus:border-[#d48b4e] rounded px-4 py-3 text-sm text-[#fbf8f3] placeholder-[#666373] focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="flex items-start gap-3 p-4 rounded bg-[#0f0e14] border border-[#242230] text-xs text-[#a9a296]">
              <Camera className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: theme.accent }} />
              <span>
                <strong>Tip:</strong> Customers can take photos of their bare wall and send them over WhatsApp along with room dimensions for an immediate spatial recommendation and quote.
              </span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                style={{ backgroundColor: theme.accent }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 hover:brightness-110 text-[#0b0b0e] font-semibold text-xs tracking-[0.2em] uppercase py-4 px-10 rounded-full transition-all duration-300 shadow-xl"
              >
                <Send className="w-4 h-4" />
                <span>Submit Enquiry via WhatsApp</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
