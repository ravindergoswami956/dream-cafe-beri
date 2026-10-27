import React, { useState } from 'react';
import { MapPin, Phone, Clock, Navigation, Copy, Check, ExternalLink } from 'lucide-react';
import { CAFE_INFO } from '../data/menuData';

export const LocationSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(CAFE_INFO.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-3">
          <MapPin className="w-3.5 h-3.5" />
          Find Us in Beri
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
          Visit <span className="gold-gradient-text">Dream Cafe</span>
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
          Conveniently located at Lala Ram Sarup Memorial Park near Goswami Electronics in Beri. Step inside for an ambient dine-in experience or call ahead for quick pickup.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Contact & Hours Info Card */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#181410] to-[#100D0B] rounded-3xl p-7 sm:p-8 border border-amber-500/25 shadow-2xl shadow-black/80 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                Official Location Details
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">Dream Cafe Beri</h3>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <MapPin className="w-5 h-5 text-amber-400 mt-1 shrink-0" />
              <div className="flex-1">
                <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                  Address
                </div>
                <div className="text-sm font-medium text-white mt-0.5 leading-snug">
                  {CAFE_INFO.address}
                </div>
                <button
                  onClick={handleCopyAddress}
                  className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold transition"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-green-400">Address copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Address</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <Phone className="w-5 h-5 text-amber-400 mt-1 shrink-0" />
              <div className="flex-1">
                <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                  Phone / Reservations
                </div>
                <div className="text-base font-bold text-white mt-0.5">
                  <a
                    href={CAFE_INFO.phoneTel}
                    className="hover:text-amber-400 transition underline underline-offset-4"
                  >
                    {CAFE_INFO.phone}
                  </a>
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Tap to call directly from your device.
                </p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <Clock className="w-5 h-5 text-amber-400 mt-1 shrink-0" />
              <div className="flex-1">
                <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                  Opening Information
                </div>
                <div className="text-sm font-bold text-amber-300 mt-0.5">
                  Opens Daily at 10:00 AM
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Serving breakfast snacks, lunch combos, and evening bites.
                </p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 mt-6 border-t border-white/10">
            <a
              href={CAFE_INFO.phoneTel}
              className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              <Phone className="w-4 h-4 fill-black" />
              Call Now
            </a>
            <a
              href={CAFE_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 transition-all"
            >
              <Navigation className="w-4 h-4 text-amber-400" />
              Get Directions
            </a>
          </div>
        </div>

        {/* Visual Map Representation Card */}
        <div className="lg:col-span-7 rounded-3xl bg-[#14110E] border border-white/10 p-4 sm:p-6 flex flex-col justify-between overflow-hidden relative shadow-2xl">
          {/* Simulated Interactive Map Frame */}
          <div className="relative w-full h-[340px] sm:h-[400px] rounded-2xl overflow-hidden bg-neutral-900 border border-white/5">
            <iframe
              title="Dream Cafe Beri Location Map"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(100%)' }}
              loading="lazy"
              allowFullScreen
              src={`https://maps.google.com/maps?q=Lala+Ram+Sarup+Memorial+Park,+near+Goswami+Electronics,+Beri,+Haryana+124201&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            />

            {/* Map Overlay Card */}
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm bg-[#0E0C0A]/95 backdrop-blur-md p-4 rounded-2xl border border-amber-500/30 shadow-2xl shadow-black">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Dream Cafe Landmark
              </div>
              <p className="text-xs text-white font-medium mt-1">
                Lala Ram Sarup Memorial Park, near Goswami Electronics, Beri
              </p>
              <a
                href={CAFE_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300"
              >
                Open in Google Maps App <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-neutral-400 pt-2">
            <span>📍 Beri, Haryana 124201</span>
            <span className="text-amber-400 font-medium">Free Parking & Ample Seating</span>
          </div>
        </div>
      </div>
    </section>
  );
};
