import React, { useEffect } from 'react';
import { X, Phone, Sparkles, Check, Info } from 'lucide-react';
import { CAFE_INFO } from '../data/menuData';
import type { MenuItem } from '../data/menuData';

interface ItemModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export const ItemModal: React.FC<ItemModalProps> = ({ item, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (item) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-[#14110E] border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-black/90 transform-style-3d scale-100 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-neutral-300 hover:text-white hover:bg-black/80 backdrop-blur-md border border-white/10 transition"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image in Modal */}
        <div className="relative h-64 sm:h-72 w-full bg-neutral-900">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14110E] via-transparent to-black/30" />

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {item.badge && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-black text-xs font-bold uppercase tracking-wider shadow-lg">
                <Sparkles className="w-3.5 h-3.5" />
                {item.badge}
              </span>
            )}
            {item.spicy && (
              <span className="px-3 py-1 rounded-full bg-red-600/90 text-white text-xs font-bold shadow-lg">
                🌶️ Spicy Recipe
              </span>
            )}
          </div>

          <div className="absolute bottom-4 left-6">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
              {item.category}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">
              {item.name}
            </h3>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-5">
          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
            {item.description}
          </p>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              <Info className="w-4 h-4 text-amber-400" />
              Kitchen Notes
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-neutral-300">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span>100% Vegetarian</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span>Cooked Fresh to Order</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span>Custom Spice Levels</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span>Dine-in or Takeaway</span>
              </div>
            </div>
          </div>

          {/* Pricing Notice & Call To Action */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="text-xs text-neutral-400">Price Info</div>
              <div className="text-sm font-bold text-amber-300">
                Ask at counter / Call for today's price
              </div>
            </div>

            <a
              href={CAFE_INFO.phoneTel}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              <Phone className="w-4 h-4 fill-black" />
              Call to Order
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
