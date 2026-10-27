import React from 'react';
import { Sparkles, ArrowRight, Flame } from 'lucide-react';
import type { MenuItem } from '../data/menuData';
import { TiltCard } from './TiltCard';

interface FeaturedDishesProps {
  onSelectItem: (item: MenuItem) => void;
}

const FEATURED_ITEMS: MenuItem[] = [
  {
    id: 'pz-2',
    name: 'Volcano Pizza',
    category: 'pizzas',
    description: 'Our showstopper center-burst volcano crust loaded with bubbling mozzarella and spicy toppings.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    badge: 'House Signature',
    popular: true,
    vegetarian: true,
  },
  {
    id: 'bg-3',
    name: 'Hangover Burger',
    category: 'burgers',
    description: 'Double stacked crunch patty overloaded with melting cheese slices, fiery jalapenos, and spicy drizzle.',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    badge: 'Legendary',
    spicy: true,
    popular: true,
    vegetarian: true,
  },
  {
    id: 'mo-1',
    name: 'Veg Kurkure Momos',
    category: 'momos',
    description: 'Extra-crunchy flake-crusted vegetable momos fried golden and served with fiery red chili sauce.',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80',
    badge: 'Super Crunch',
    popular: true,
    vegetarian: true,
  },
  {
    id: 'pa-1',
    name: 'White Sauce Pasta',
    category: 'pasta',
    description: 'Classic velvety Alfredo cream sauce tossed with penne, sweet corn, bell peppers, and oregano.',
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80',
    badge: 'Best Seller',
    popular: true,
    vegetarian: true,
  },
  {
    id: 'fr-3',
    name: 'Peri Peri Cheese Fries',
    category: 'fries',
    description: 'Fiery peri peri fries smothered under a lavish pour of warm melted cheddar cheese.',
    image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80',
    badge: 'Crowd Favorite',
    popular: true,
    vegetarian: true,
  },
  {
    id: 'sh-1',
    name: 'Nutella Shake',
    category: 'shakes',
    description: 'Decadent creamy blend of authentic Italian hazelnut Nutella with rich ice cream.',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    badge: 'Popular',
    popular: true,
    vegetarian: true,
  },
];

export const FeaturedDishes: React.FC<FeaturedDishesProps> = ({ onSelectItem }) => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            Signature Hall of Fame
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Dream Cafe <span className="gold-gradient-text">Masterpieces</span>
          </h2>
        </div>
        <p className="text-neutral-400 text-sm max-w-md mt-3 md:mt-0">
          The dishes our Beri guests return for again and again. Handcrafted with passion, premium ingredients, and authentic flair.
        </p>
      </div>

      {/* Featured Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {FEATURED_ITEMS.map((item) => (
          <TiltCard
            key={item.id}
            onClick={() => onSelectItem(item)}
            className="rounded-3xl bg-[#14110E] border border-amber-500/20 hover:border-amber-400/50 shadow-xl shadow-black/60 cursor-pointer flex flex-col justify-between"
          >
            {/* Image Container with Badges */}
            <div className="relative h-60 w-full overflow-hidden rounded-t-3xl bg-neutral-900">
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14110E] via-transparent to-black/30" />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {item.badge && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-black text-[11px] font-bold uppercase tracking-wider shadow-md">
                    <Sparkles className="w-3 h-3" />
                    {item.badge}
                  </span>
                )}
                {item.spicy && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-600/90 text-white text-[11px] font-bold shadow-md">
                    🌶️ Spicy
                  </span>
                )}
              </div>

              {/* Veg Indicator */}
              <div className="absolute top-4 right-4 w-6 h-6 rounded-md bg-black/60 backdrop-blur-md border border-green-500 flex items-center justify-center p-1">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              </div>

              <div className="absolute bottom-3 left-4 text-xs font-semibold text-amber-400 uppercase tracking-widest">
                {item.category}
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 flex flex-col flex-grow justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                  {item.name}
                </h3>
                <p className="text-neutral-400 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-medium text-amber-300/80">
                  Ask for price at counter
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                  View Details <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
};
