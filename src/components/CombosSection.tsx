import React from 'react';
import { PartyPopper, Sparkles, CheckCircle2, Phone } from 'lucide-react';
import { CAFE_INFO } from '../data/menuData';

export const CombosSection: React.FC = () => {
  const combos = [
    {
      title: 'Birthday Celebration Combo',
      tag: 'Grand Feast',
      icon: '🎂',
      description: 'The ultimate birthday party bundle crafted to delight your entire crew with pizzas, burgers, fries, drinks, and sweet indulgence.',
      includes: ['Large Loaded Pizza', 'Aloo Tikki / Veg Burgers', 'Peri Peri Cheese Fries', 'Cold Drinks (500 ml)', 'Celebration Cake Slice / Lava Cake'],
      highlight: true,
    },
    {
      title: 'Family Feast Combo',
      tag: 'Group Favorite',
      icon: '👨‍👩‍👧‍👦',
      description: 'Generous assortment designed for weekend family get-togethers and celebrations at Dream Cafe.',
      includes: ['2 Medium Veg Pizzas', 'Stuffed Garlic Bread', 'Veg Kurkure Momos Platter', '4 Chilled Shakes or Beverages'],
      highlight: false,
    },
    {
      title: 'Our Secret Dish Combo',
      tag: 'Chef Surprise',
      icon: '🔮',
      description: 'An exclusive mystery pairing featuring special off-menu chef creations and seasonal flavor infusions.',
      includes: ['Secret Signature Preparation', 'Crispy Golden Sides', 'Chef Selected Mocktail', 'Special Dessert Bite'],
      highlight: false,
    },
    {
      title: 'Aloo Tikki Burger Combo',
      tag: 'Solo Value Box',
      icon: '🍔',
      description: 'Quick comforting lunch or snack with crisp spiced potato burger, fries, and cold soda.',
      includes: ['Spiced Aloo Tikki Burger', 'Salted French Fries', 'Chilled Drink (500 ml)', 'Garlic / Mint Mayo Dip'],
      highlight: false,
    },
    {
      title: 'Medium Veg Treat Pizza Combo',
      tag: 'Best Seller',
      icon: '🍕',
      description: 'Our popular medium garden pizza paired with hot garlic sticks and refreshing soda.',
      includes: ['Medium Veg Treat Pizza', 'Garlic Bread Sticks with Dip', 'Cold Drinks (500 ml)', 'Extra Seasoning Packets'],
      highlight: false,
    },
    {
      title: 'Multi-Item Hangout Packs',
      tag: '4, 5, or 6 Items',
      icon: '🎉',
      description: 'Flexible custom combo bundles: pick your choice of 4, 5, or 6 items from our complete menu for big savings.',
      includes: ['4-Item Starter Combo', '5-Item Deluxe Combo', '6-Item Supreme Feast', 'Customizable with any category'],
      highlight: false,
    },
  ];

  const upgrades = [
    { name: 'Extra Cheese', desc: 'Double layer of pure melted mozzarella', icon: '🧀' },
    { name: 'Cheese Burst Crust', desc: 'Crust filled with warm molten cheese cream', icon: '🌋' },
    { name: 'Extra Topping', desc: 'Olives, jalapenos, mushrooms, or extra paneer', icon: '🫒' },
    { name: 'Thin Crust', desc: 'Authentic crisp and light Italian pizza base', icon: '✨' },
    { name: 'House Dips', desc: 'Creamy garlic, spicy peri peri, or cheese dip', icon: '🥣' },
    { name: 'Cold Drinks (500 ml)', desc: 'Chilled bubbly soda to complement your meal', icon: '🥤' },
  ];

  return (
    <section id="combos" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-semibold uppercase tracking-widest mb-3">
          <PartyPopper className="w-3.5 h-3.5" />
          Celebrations & Group Feasts
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
          Special <span className="gold-gradient-text">Combos & Value Packs</span>
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
          Planning a birthday party, family outing, or friends reunion in Beri? Our handcrafted combo packages offer the ultimate variety and generous servings.
        </p>
      </div>

      {/* Combo Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
        {combos.map((combo, idx) => (
          <div
            key={idx}
            className={`relative rounded-3xl p-7 transition-all duration-300 flex flex-col justify-between ${
              combo.highlight
                ? 'bg-gradient-to-b from-[#25180E] to-[#120F0C] border-2 border-amber-500/50 shadow-2xl shadow-orange-950/40'
                : 'bg-[#14110E] border border-white/10 hover:border-amber-500/30'
            }`}
          >
            {combo.highlight && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-black font-extrabold text-[11px] uppercase tracking-wider shadow-lg">
                Most Popular for Parties
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{combo.icon}</span>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-white/5 px-2.5 py-1 rounded-lg">
                  {combo.tag}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{combo.title}</h3>
              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-6">
                {combo.description}
              </p>

              <div className="space-y-2.5 mb-6">
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  What's Inside:
                </div>
                {combo.includes.map((inc, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-neutral-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-5 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-amber-300/80 font-medium">Ask for price</span>
              <a
                href={CAFE_INFO.phoneTel}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-xs shadow hover:brightness-110 active:scale-95 transition-all"
              >
                <Phone className="w-3 h-3 fill-black" />
                Book Combo
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Upgrades & Customizations Strip */}
      <div className="bg-[#15120F] rounded-3xl p-8 border border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Customize & Upgrade Any Order
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Elevate your pizzas, burgers, and sides with our signature add-ons.
            </p>
          </div>
          <a
            href={CAFE_INFO.phoneTel}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition self-start md:self-auto"
          >
            <span>Custom Request? Call Us</span>
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {upgrades.map((u, i) => (
            <div key={i} className="bg-black/30 p-3.5 rounded-2xl border border-white/5 text-center">
              <div className="text-2xl mb-1">{u.icon}</div>
              <div className="text-xs font-bold text-white">{u.name}</div>
              <div className="text-[10px] text-neutral-400 mt-1 leading-snug">{u.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
