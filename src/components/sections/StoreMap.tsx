"use client";
import { motion } from "framer-motion";
import { MapPin, Clock, Navigation, Star } from "lucide-react";
import { SUPERMARKETS } from "@/lib/data";

const BRANCHES = [
  { store: "shufersal", branch: "תל אביב - דיזנגוף", dist: "0.4 ק״מ", rating: 4.5, open: "פתוח עד 23:00" },
  { store: "rami",      branch: "תל אביב - יגאל אלון", dist: "1.2 ק״מ", rating: 4.2, open: "פתוח עד 22:00" },
  { store: "yohananof", branch: "רמת גן - ביאליק",    dist: "2.1 ק״מ", rating: 4.7, open: "פתוח עד 21:00" },
  { store: "shufersal", branch: "תל אביב - גבעת שמר", dist: "2.8 ק״מ", rating: 4.3, open: "פתוח 24 שעות" },
];

export default function StoreMap() {
  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-8 flex items-center gap-2">
          <MapPin className="w-7 h-7 text-[#1FAF5A]" /> סניפים קרובים אליך
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map placeholder */}
          <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl overflow-hidden border border-green-100 h-72 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-6xl mb-3">🗺️</div>
              <div className="font-bold text-lg text-gray-600">מפת סניפים</div>
              <div className="text-sm mt-1">שילוב Google Maps בקרוב</div>
            </div>
            {/* Decorative pins */}
            {[{ top: "30%", left: "25%", color: "#0057b8" }, { top: "55%", left: "60%", color: "#e31837" }, { top: "40%", left: "70%", color: "#2d8653" }].map((pin, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                className="absolute w-8 h-8 rounded-full flex items-center justify-center text-white text-sm shadow-lg"
                style={{ top: pin.top, left: pin.left, backgroundColor: pin.color }}
              >
                <MapPin className="w-4 h-4" />
              </motion.div>
            ))}
          </div>

          {/* Branch list */}
          <div className="space-y-3">
            {BRANCHES.map((b, i) => {
              const store = SUPERMARKETS.find((s) => s.id === b.store)!;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-4 bg-gray-50 hover:bg-gray-100 rounded-2xl p-4 transition-colors cursor-pointer group"
                >
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white text-lg font-black shrink-0 shadow-sm"
                    style={{ backgroundColor: store.color }}>
                    {store.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-gray-900">{store.name} — {b.branch}</div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{b.open}</span>
                      <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" />{b.rating}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-gray-700">{b.dist}</div>
                    <button className="mt-1 text-xs text-[#1FAF5A] font-semibold group-hover:underline flex items-center gap-1">
                      <Navigation className="w-3 h-3" /> נווט
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
