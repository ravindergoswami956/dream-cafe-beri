import React from 'react';
import { Phone, MapPin, Clock, ArrowUp, Lock } from 'lucide-react';
import { CAFE_INFO } from '../data/menuData';
import { SITE_CONFIG } from '../config/siteConfig';
import ravinderImg from '../assets/ravinder-goswami.png';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface FooterProps {
  onOpenOwnerLogin: () => void;
  isOwnerLoggedIn?: boolean;
  onOpenDashboard?: () => void;
}

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC<FooterProps> = ({
  onOpenOwnerLogin,
  isOwnerLoggedIn,
  onOpenDashboard,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#080706] border-t border-amber-500/20 pt-16 pb-12 overflow-hidden">
      {/* Decorative Warm Top Line Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/5">
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-orange-500/30">
                ☕
              </div>
              <div>
                <span className="font-heading font-black text-2xl tracking-wider text-white">
                  {SITE_CONFIG.brandName.toUpperCase()}
                </span>
                <div className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold -mt-1">
                  Beri • Haryana
                </div>
              </div>
            </div>

            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              The premier culinary hangout in Beri. Serving fresh artisan pizzas, loaded double-deck burgers, crunchy kurkure momos, and decadent cold brews in a cinematic ambient environment.
            </p>

            <div className="flex items-center gap-2 text-xs text-amber-300 font-medium">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{CAFE_INFO.openingHours}</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-1">
              {SITE_CONFIG.socialLinks.whatsapp && (
                <a
                  href={SITE_CONFIG.socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-green-400 text-xs font-medium border border-white/5 transition"
                >
                  💬 WhatsApp
                </a>
              )}
              {SITE_CONFIG.socialLinks.instagram && (
                <a
                  href={SITE_CONFIG.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-pink-400 text-xs font-medium border border-white/5 transition inline-flex items-center gap-1.5"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                  <span>Instagram</span>
                </a>
              )}
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Quick Navigation
            </div>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li>
                <a href="#home" className="hover:text-amber-400 transition">
                  Home Overview
                </a>
              </li>
              <li>
                <a href="#specials" className="hover:text-amber-400 transition">
                  3D Food Showcase
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-amber-400 transition">
                  Complete Menu Catalog
                </a>
              </li>
              <li>
                <a href="#combos" className="hover:text-amber-400 transition">
                  Party Combos & Value Packs
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-amber-400 transition">
                  About Our Kitchen
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-amber-400 transition">
                  Directions & Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details & Staff Access */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Visit & Call Us
            </div>
            <div className="space-y-3 text-xs text-neutral-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <span className="leading-relaxed">{CAFE_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  href={CAFE_INFO.phoneTel}
                  className="font-semibold text-white hover:text-amber-400 transition"
                >
                  {CAFE_INFO.phone}
                </a>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 items-center">
              <a
                href={CAFE_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs border border-white/10 transition"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Directions in Maps
              </a>

              {/* Discrete Owner Login Portal */}
              {isOwnerLoggedIn ? (
                <button
                  onClick={onOpenDashboard}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-semibold border border-amber-500/30 transition"
                >
                  <Lock className="w-3 h-3 text-amber-400" />
                  Owner Dashboard
                </button>
              ) : (
                <button
                  onClick={onOpenOwnerLogin}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-neutral-400 hover:text-neutral-200 text-[11px] transition"
                  title="Staff Portal (Owner Login)"
                >
                  <Lock className="w-3 h-3" />
                  <span>Owner Portal</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Developer Credit & Bottom Bar */}
        <div className="pt-8 pb-4 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Ravinder Goswami Developer Profile Card */}
          <div className="flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/30 backdrop-blur-sm shadow-xl shadow-black/40 hover:border-amber-400/50 transition">
            <div className="relative shrink-0">
              <img
                src={ravinderImg}
                alt="Ravinder Goswami - Full Stack Developer"
                className="w-13 h-13 rounded-full object-cover border-2 border-amber-400 shadow-lg shadow-orange-500/30 ring-2 ring-black"
              />
              <span
                className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-black"
                title="Active Developer"
              />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
                <span>Designed &amp; Developed By</span>
                <span className="w-1 h-1 rounded-full bg-amber-400" />
                <span className="text-white/70">Full Stack</span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-white tracking-wide flex items-center gap-2">
                <span>Ravinder Goswami</span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Developer
                </span>
              </div>
              {/* Direct Instagram Profile Link */}
              <a
                href={SITE_CONFIG.developerInfo?.instagramUrl || "https://www.instagram.com/goswami_sarkaar_333/"}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-rose-600/30 hover:from-purple-600/50 hover:via-pink-600/50 hover:to-rose-600/50 border border-pink-500/40 text-[11px] font-medium text-pink-200 hover:text-white transition group/insta"
                title="Follow Ravinder Goswami on Instagram (@goswami_sarkaar_333)"
              >
                <InstagramIcon className="w-3 h-3 text-pink-400 group-hover/insta:scale-110 transition-transform" />
                <span>@{SITE_CONFIG.developerInfo?.instagramUsername || "goswami_sarkaar_333"}</span>
              </a>
            </div>
          </div>

          {/* Quick info & back to top */}
          <div className="flex items-center gap-4 text-xs text-neutral-400">
            <span className="text-[11px] text-neutral-400">
              Pure Veg Kitchen • Beri, Haryana 124201
            </span>
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition group"
              title="Scroll to top"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 border-t border-white/[0.04]">
          <span>© {CURRENT_YEAR} {SITE_CONFIG.brandName} (Beri). All rights reserved.</span>
          <span className="text-[11px] text-neutral-500 mt-1 sm:mt-0">
            Website crafted with React 19 &amp; Three.js by Ravinder Goswami
          </span>
        </div>
      </div>
    </footer>
  );
};
