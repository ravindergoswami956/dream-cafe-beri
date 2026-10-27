import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Clock, Menu as MenuIcon, X, Lock } from 'lucide-react';
import { CAFE_INFO } from '../data/menuData';

interface NavbarProps {
  isOwnerLoggedIn?: boolean;
  onOpenDashboard?: () => void;
  onOpenOwnerLogin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isOwnerLoggedIn,
  onOpenDashboard,
  onOpenOwnerLogin,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      // Section tracker
      const sections = ['home', 'specials', 'menu', 'combos', 'about', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home', id: 'home' },
    { label: 'Specials 3D', href: '#specials', id: 'specials' },
    { label: 'Menu', href: '#menu', id: 'menu' },
    { label: 'Combos', href: '#combos', id: 'combos' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B0A09]/90 backdrop-blur-xl border-b border-amber-500/15 py-3 shadow-2xl shadow-black/70'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Left Admin Option */}
          <div className="flex items-center gap-3">
            <a
              href="#home"
              className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-lg"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform duration-300">
                <span className="text-xl">☕</span>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-xl tracking-wider text-white flex items-center gap-1.5">
                  DREAM CAFE
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                </span>
                <span className="text-[10px] uppercase tracking-widest text-amber-400/90 font-medium -mt-1">
                  Beri • Haryana
                </span>
              </div>
            </a>

            {/* Left Header Admin Quick Access */}
            <button
              onClick={isOwnerLoggedIn ? onOpenDashboard : onOpenOwnerLogin}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.04] hover:bg-amber-500/15 text-neutral-300 hover:text-amber-300 border border-white/5 hover:border-amber-500/30 text-[11px] font-semibold transition ml-1"
              title="Admin Portal (cafe47516@gmail.com)"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>{isOwnerLoggedIn ? 'Admin Active' : 'Admin'}</span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#161310]/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-inner">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`text-xs uppercase tracking-wider font-semibold px-3 py-1.5 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                      : 'text-neutral-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Quick Contact & Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="hidden xl:flex items-center gap-1.5 text-xs text-neutral-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{CAFE_INFO.openingHours}</span>
            </div>

            <a
              href={CAFE_INFO.phoneTel}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
            >
              <Phone className="w-3.5 h-3.5 fill-black" />
              <span>Call Us</span>
            </a>

            {isOwnerLoggedIn && onOpenDashboard && (
              <button
                onClick={onOpenDashboard}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40 hover:bg-amber-500/30 transition"
              >
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Dashboard</span>
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-neutral-200 hover:text-white transition"
            aria-label="Toggle mobile navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F0D0B]/98 border-b border-amber-500/20 px-6 py-6 backdrop-blur-2xl transition-all">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-semibold tracking-wide px-4 py-2.5 rounded-xl transition ${
                  activeSection === link.id
                    ? 'bg-amber-500 text-black font-bold'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </a>
            ))}

            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs text-amber-400/90">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{CAFE_INFO.openingHours}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="line-clamp-1">{CAFE_INFO.address}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <a
                  href={CAFE_INFO.phoneTel}
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500 text-black font-bold text-xs"
                >
                  <Phone className="w-3.5 h-3.5 fill-black" />
                  Call Now
                </a>
                <a
                  href={CAFE_INFO.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/10 text-white font-medium text-xs border border-white/10"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  Directions
                </a>
              </div>

              {isOwnerLoggedIn ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDashboard?.();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/40 text-center mt-2 flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Open Owner Dashboard
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenOwnerLogin?.();
                  }}
                  className="w-full py-2 text-center text-[11px] text-neutral-500 hover:text-neutral-300 transition mt-1"
                >
                  Staff Login Portal
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
