import React from 'react';
import { Phone, MapPin, ArrowRight, UtensilsCrossed } from 'lucide-react';
import { CAFE_INFO } from '../data/menuData';
import { ThreeHeroCenterpiece } from './ThreeHeroCenterpiece';

export const Hero: React.FC = () => {
  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background radial gradient halos */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-orange-600/15 via-amber-500/10 to-transparent blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 text-center lg:text-left space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#1C1814] border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wider uppercase shadow-lg shadow-black/50">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <span>Beri, Haryana's Premium Dining Destination</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              Where Every Bite is a <span className="gold-gradient-text">Dream</span> Come True.
            </h1>

            {/* Subtitle */}
            <p className="text-neutral-300 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              Welcome to <span className="text-amber-400 font-semibold">Dream Cafe</span> at Lala Ram Sarup Memorial Park. Savor artisan pizzas with volcanic cheese pulls, towering loaded burgers, spicy kurkure momos, and decadent thick cold brews.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
              <a
                href="#menu"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-black font-extrabold text-sm tracking-wide shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Explore Full Menu</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>

              <a
                href={CAFE_INFO.phoneTel}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#1C1814]/90 hover:bg-[#25201A] text-white font-semibold text-sm border border-amber-500/30 hover:border-amber-400/60 shadow-lg active:scale-95 transition-all"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>{CAFE_INFO.phone}</span>
              </a>

              <a
                href={CAFE_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-medium text-sm border border-white/10 transition-all"
                title="View on Google Maps"
              >
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Directions</span>
              </a>
            </div>

            {/* Quick Meta Highlights */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-left">
              <div>
                <div className="text-2xl font-black text-amber-400 font-heading">10:00 AM</div>
                <div className="text-xs text-neutral-400">Opening Time</div>
              </div>
              <div>
                <div className="text-2xl font-black text-amber-400 font-heading">70+</div>
                <div className="text-xs text-neutral-400">Handcrafted Items</div>
              </div>
              <div>
                <div className="text-2xl font-black text-amber-400 font-heading">100%</div>
                <div className="text-xs text-neutral-400">Pure Veg Selection</div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Centerpiece Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto w-full max-w-[540px]">
              {/* Backlight Glow Behind 3D Mesh */}
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/20 via-amber-400/20 to-transparent rounded-full filter blur-3xl -z-10" />

              {/* 3D Component */}
              <ThreeHeroCenterpiece />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
