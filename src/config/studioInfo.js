/**
 * Dynamic Kavin Sirpi Studio Configuration
 * Driven dynamically by frontend environment variables (.env with VITE_ prefix).
 */

const env = import.meta.env || {};

export const STUDIO_CONFIG = {
  name: env.VITE_STUDIO_NAME || "Kavin Sirpi",
  title: env.VITE_STUDIO_TITLE || "Master Cement Mural & Relief Sculptor",
  tagline: env.VITE_STUDIO_TAGLINE || "Art Carved Into Walls",
  eyebrow: env.VITE_STUDIO_EYEBROW || "Bespoke Cement Relief Art",
  bioHeadline: env.VITE_BIO_HEADLINE || "The Artist Behind the Art",
  
  // Contact details (Dynamically read from .env)
  displayPhone: env.VITE_DISPLAY_PHONE || "+91 96882 40799",
  rawPhone: env.VITE_RAW_PHONE || "+919688240799",
  whatsappNumber: env.VITE_WHATSAPP_NUMBER || "919688240799",

  // WhatsApp prefilled enquiry messages
  whatsappDefaultMessage:
    env.VITE_WHATSAPP_DEFAULT_MESSAGE ||
    "Hello Kavin Sirpi, I saw your sculpture portfolio and would like to enquire about a custom cement mural. Could you please share more details?",
  
  // Location & service scope
  location: env.VITE_LOCATION || "Tamil Nadu, India",
  serviceScope:
    env.VITE_SERVICE_SCOPE ||
    "On-site commissions undertaken across Tamil Nadu, Karnataka, Kerala, Andhra Pradesh & Pan-India",
  
  // Specialities
  specialties: [
    "High-Relief Elephant Sculptures",
    "Peacock & Nature Wall Reliefs",
    "Temple & Sacred Traditional Motifs",
    "Contemporary Architectural Murals",
    "Direct On-Site Cement Wall Carving"
  ],

  // Social & Reference links
  social: {
    instagram: env.VITE_INSTAGRAM_URL || "https://instagram.com",
    facebook: env.VITE_FACEBOOK_URL || "https://facebook.com",
  },

  // Dynamic API and routing endpoints
  apiBaseUrl: env.VITE_API_BASE_URL || "",
  adminPath: env.VITE_ADMIN_PATH || "/admin",
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
