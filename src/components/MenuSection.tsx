import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRight, Utensils } from 'lucide-react';
import { CATEGORIES } from '../data/menuData';
import type { MenuItem } from '../data/menuData';
import { TiltCard } from './TiltCard';

interface MenuSectionProps {
  items: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ items, onSelectItem }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [vegetarianOnly, setVegetarianOnly] = useState<boolean>(false);
  const [spicyOnly, setSpicyOnly] = useState<boolean>(false);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      // Vegetarian filter
      if (vegetarianOnly && !item.vegetarian) {
        return false;
      }
      // Spicy filter
      if (spicyOnly && !item.spicy) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCat = item.category.toLowerCase().includes(query);
        return matchesName || matchesDesc || matchesCat;
      }
      return true;
    });
  }, [items, activeCategory, searchQuery, vegetarianOnly, spicyOnly]);

  const activeCategoryInfo = CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <section id="menu" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-3">
          <Utensils className="w-3.5 h-3.5" />
          Full Culinary Catalog
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
          Explore Our Handcrafted <span className="gold-gradient-text">Menu</span>
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
          From fiery kurkure momos and molten volcano pizzas to velvety coffees and gourmet burgers. Every recipe is cooked to order with fresh ingredients.
        </p>
      </div>

      {/* Search and Secondary Filter Controls */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pizza, burger, momos, pasta, shake..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-[#141210] border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Toggle Pills */}
        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setVegetarianOnly((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
              vegetarianOnly
                ? 'bg-green-950/60 border-green-500 text-green-300'
                : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-green-500" />
            100% Pure Veg
          </button>
          <button
            onClick={() => setSpicyOnly((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
              spicyOnly
                ? 'bg-red-950/60 border-red-500 text-red-300'
                : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
            }`}
          >
            <span>🌶️</span>
            Spicy Only
          </button>
          {(searchQuery || activeCategory !== 'all' || vegetarianOnly || spicyOnly) && (
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
                setVegetarianOnly(false);
                setSpicyOnly(false);
              }}
              className="text-xs text-amber-400 hover:underline px-2 py-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Slider / Grid */}
      <div className="mb-10 overflow-x-auto pb-3 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2 min-w-max">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold tracking-wide transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold shadow-lg shadow-orange-500/20 scale-105'
                    : 'bg-[#15120F] border border-white/10 text-neutral-300 hover:bg-white/5 hover:border-amber-500/30'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Category Meta */}
      {activeCategoryInfo && activeCategory !== 'all' && (
        <div className="mb-8 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{activeCategoryInfo.icon}</span>
            <div>
              <h3 className="text-base font-bold text-white">{activeCategoryInfo.name}</h3>
              <p className="text-xs text-neutral-400">{activeCategoryInfo.description}</p>
            </div>
          </div>
          <span className="text-xs text-amber-400 font-semibold">
            {filteredItems.length} items
          </span>
        </div>
      )}

      {/* Menu Cards Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <TiltCard
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="rounded-3xl bg-[#13100D] border border-white/10 hover:border-amber-500/40 shadow-lg shadow-black/50 cursor-pointer flex flex-col justify-between"
            >
              {/* Image Preview */}
              <div className="relative h-44 w-full overflow-hidden rounded-t-3xl bg-neutral-900">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#13100D] via-transparent to-black/20" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  {item.badge && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-bold uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                  {item.spicy && (
                    <span className="px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-bold">
                      🌶️
                    </span>
                  )}
                </div>

                {/* Vegetarian Dot */}
                <div className="absolute top-3 right-3 w-5 h-5 rounded bg-black/60 backdrop-blur-md border border-green-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-amber-300 transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-neutral-400 text-xs line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-amber-300 font-bold">
                    {(item as any).price || 'Ask for price'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
                    Details <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#13100D] rounded-3xl border border-white/5 p-8 max-w-md mx-auto">
          <p className="text-3xl mb-3">🔍</p>
          <h4 className="text-lg font-bold text-white mb-1">No items found</h4>
          <p className="text-xs text-neutral-400 mb-4">
            We couldn't find any dish matching "{searchQuery}". Try searching for another favorite or browse all categories.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
              setVegetarianOnly(false);
              setSpicyOnly(false);
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 text-black font-semibold text-xs"
          >
            Clear Search & Filters
          </button>
        </div>
      )}
    </section>
  );
};
