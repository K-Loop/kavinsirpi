/**
 * Kavin Sirpi Studio Configuration
 * Centralized contact and studio information.
 * Easily update the phone number and WhatsApp details here.
 */

export const STUDIO_CONFIG = {
  name: "Kavin Sirpi",
  title: "Master Cement Mural & Relief Sculptor",
  tagline: "Art Carved Into Walls",
  eyebrow: "Bespoke Cement Relief Art",
  bioHeadline: "The Artist Behind the Art",
  
  // Contact details (Configurable)
  // Phone numbers format:
  // - displayPhone: human-readable format shown to visitors
  // - rawPhone: digits-only for tel: and wa.me links
  displayPhone: "+91 96882 40799",
  rawPhone: "+919688240799",
  whatsappNumber: "919688240799", // Country code + digits without '+' or spaces

  // WhatsApp prefilled enquiry messages
  whatsappDefaultMessage: "Hello Kavin Sirpi, I saw your sculpture portfolio and would like to enquire about a custom cement mural. Could you please share more details?",
  
  // Location & service scope
  location: "Tamil Nadu, India",
  serviceScope: "On-site commissions undertaken across Tamil Nadu, Karnataka, Kerala, Andhra Pradesh & Pan-India",
  
  // Specialities
  specialties: [
    "High-Relief Elephant Sculptures",
    "Peacock & Nature Wall Reliefs",
    "Temple & Sacred Traditional Motifs",
    "Contemporary Architectural Murals",
    "Direct On-Site Cement Wall Carving"
  ],

  // Social & Reference links (if any)
  social: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
  }
};

/**
 * Helper to build custom WhatsApp link with prefilled text
 */
export function getWhatsAppUrl(customMessage) {
  const message = customMessage || STUDIO_CONFIG.whatsappDefaultMessage;
  return `https://wa.me/${STUDIO_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Helper to build tel: link
 */
export function getPhoneUrl() {
  return `tel:${STUDIO_CONFIG.rawPhone}`;
}
