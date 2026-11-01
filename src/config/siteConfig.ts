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
  developerInfo?: {
    name: string;
    role: string;
    instagramUsername: string;
    instagramUrl: string;
  };
}

export const SITE_CONFIG: SiteConfig = {
  brandName: 'XYZ Cafe',
  tagline: 'The Ultimate 3D Culinary Haven',
  locationName: 'Central Plaza, New City, India',
  fullAddress: 'Shop 24, Crystal Galleria, Main Boulevard, Sector 21, New City 110001, India',
  phone: '+91 82782 33573',
  phoneTel: 'tel:+918278233573',
  defaultOpeningHours: 'Opens daily at 10:00 AM',
  googleMapsUrl: 'https://maps.google.com/?q=Crystal+Galleria,+Main+Boulevard,+Sector+21,+New+City+110001,+India',
  // Whitelist of authorized owner emails allowed to access the Admin Dashboard
  authorizedOwnerEmails: [
    'cafe47516@gmail.com',
    'owner@dreamcafe.in',
    'admin@dreamcafe.in',
  ],
  socialLinks: {
    instagram: 'https://www.instagram.com/xyz_123/',
    facebook: 'https://facebook.com',
    whatsapp: 'https://wa.me/918278233573',
  },
  developerInfo: {
    name: 'Ravinder Goswami',
    role: 'Full Stack Developer',
    instagramUsername: 'xyz_123',
    instagramUrl: 'https://www.instagram.com/xyz_123/',
  },
};
