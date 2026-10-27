export interface SiteConfig {
  brandName: string;
  tagline: string;
  locationName: string;
  fullAddress: string;
  phone: string;
  phoneTel: string;
  defaultOpeningHours: string;
  googleMapsUrl: string;
  authorizedOwnerEmails: string[];
  socialLinks: {
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
  };
}

export const SITE_CONFIG: SiteConfig = {
  brandName: 'Dream Cafe',
  tagline: 'The Ultimate 3D Culinary Haven in Beri',
  locationName: 'Beri, Haryana, India',
  fullAddress: 'Lala Ram Sarup Memorial Park, near Goswami Electronics, Beri, Haryana 124201, India',
  phone: '+91 82782 33573',
  phoneTel: 'tel:+918278233573',
  defaultOpeningHours: 'Opens daily at 10:00 AM',
  googleMapsUrl: 'https://maps.google.com/?q=Lala+Ram+Sarup+Memorial+Park,+near+Goswami+Electronics,+Beri,+Haryana+124201,+India',
  // Whitelist of authorized owner emails allowed to access the Admin Dashboard
  authorizedOwnerEmails: [
    'cafe47516@gmail.com',
    'owner@dreamcafe.in',
    'admin@dreamcafe.in',
  ],
  socialLinks: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    whatsapp: 'https://wa.me/918278233573',
  },
};
