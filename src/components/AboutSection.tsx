import React from 'react';
import { Heart, Sparkles, Coffee, ShieldCheck, MapPin } from 'lucide-react';
import { CAFE_INFO } from '../data/menuData';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Visual Collage with 3D Depth */}
        <div className="lg:col-span-6 relative">
          <div className="relative mx-auto max-w-lg">
            {/* Primary Image */}
            <div className="relative rounded-3xl overflow-hidden border border-amber-500/20 shadow-2xl shadow-black/80 aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80"
                alt="Dream Cafe Interior Ambiance"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                  Beri's Vibrant Gathering Place
                </span>
                <p className="text-sm font-semibold text-white">
                  Cozy seats, ambient lighting, and great memories.
                </p>
              </div>
            </div>

            {/* Overlapping Floating Secondary Image */}
            <div className="absolute -bottom-8 -right-4 sm:-right-8 w-48 sm:w-56 rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl shadow-black hidden sm:block">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
                alt="Barista brewing coffee"
                className="w-full h-36 object-cover"
                loading="lazy"
              />
              <div className="bg-[#181410] p-2.5 text-center">
                <span className="text-[11px] font-bold text-amber-300">
                  Brewed Fresh Every Day
                </span>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-5 -left-4 sm:-left-6 bg-[#16120E]/90 backdrop-blur-md border border-amber-500/30 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">
                Beri's Landmark Cafe
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Story & Philosophy */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest">
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            Our Heritage & Passion
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Crafting Delightful Moments in the Heart of <span className="gold-gradient-text">Beri</span>
          </h2>

          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
            Located beside the scenic <span className="text-white font-medium">Lala Ram Sarup Memorial Park</span> and near Goswami Electronics, <span className="text-amber-400 font-semibold">Dream Cafe</span> was born from a simple passion: to bring metropolitan-grade culinary quality, handcrafted fast-casual dining, and warm hospitality to the beloved town of Beri, Haryana.
          </p>

          <p className="text-neutral-400 text-sm leading-relaxed">
            Whether you are catching up after college, sharing an evening pizza feast with family, or grabbing a frosty thick shake with friends, our kitchen is dedicated to using fresh produce, 100% vegetarian ingredients, and artisanal cooking techniques.
          </p>

          {/* Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Quality & Hygiene</span>
              </div>
              <p className="text-xs text-neutral-400 leading-normal">
                Strict food safety standards, spotless kitchen, and cooked-to-order dishes.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Coffee className="w-4 h-4" />
                <span>Handcrafted Flavor</span>
              </div>
              <p className="text-xs text-neutral-400 leading-normal">
                House-blended sauces, tandoori marinades, and hand-stretched pizza crusts.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3 text-xs text-neutral-300">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{CAFE_INFO.address}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
