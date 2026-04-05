"use client";
import { motion } from "framer-motion";
import { MapPin, Clock, Star, Navigation } from "lucide-react";
import { SUPERMARKETS } from "@/lib/data";

const BRANCHES = [
  { store: "shufersal", branch: "תל אביב — דיזנגוף",   dist: "0.4 ק״מ", rating: 4.5, open: "פתוח עד 23:00" },
  { store: "rami",      branch: "תל אביב — יגאל אלון", dist: "1.2 ק״מ", rating: 4.2, open: "פתוח עד 22:00" },
  { store: "yohananof", branch: "רמת גן — ביאליק",     dist: "2.1 ק״מ", rating: 4.7, open: "פתוח עד 21:00" },
  { store: "shufersal", branch: "תל אביב — גבעת שמר",  dist: "2.8 ק״מ", rating: 4.3, open: "פתוח 24 שעות" },
];

export default function StoreMap() {
  return (
    <section className="py-12 px-4" style={{ background: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black mb-8 flex items-center gap-2" style={{ color: "var(--dark)" }}>
          <MapPin className="w-7 h-7" style={{ color: "var(--green)" }} /> סניפים קרובים
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map placeholder */}
          <div className="relative rounded-3xl overflow-hidden flex items-center justify-center h-64"
            style={{ background: "var(--dark2)", border: "2px solid rgba(255,255,255,0.08)", boxShadow: "5px 5px 0 rgba(26,35,50,0.15)" }}>
            {/* Color stripe */}
            <div className="absolute top-0 inset-x-0 h-1 flex">
              {["var(--red)","var(--yellow)","var(--green)","var(--blue)","var(--purple)"].map((c,i) => (
                <div key={i} className="flex-1" style={{ background: c }} />
              ))}
            </div>
            <div className="text-center">
              <div className="text-5xl mb-3">🗺️</div>
              <div className="font-black text-white text-lg">מפת סניפים</div>
              <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Google Maps — בקרוב</div>
            </div>
            {/* Animated pins */}
            {[
              { top: "35%", left: "28%", color: "var(--blue)" },
              { top: "55%", left: "58%", color: "var(--red)" },
              { top: "38%", left: "68%", color: "var(--green)" },
            ].map((pin, i) => (
              <motion.div key={i}
                animate={{ y: [0, -7, 0] }} transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                className="absolute w-9 h-9 rounded-full flex items-center justify-center text-white font-black shadow-lg"
                style={{ top: pin.top, left: pin.left, background: pin.color, boxShadow: `3px 3px 0 rgba(0,0,0,0.3)` }}>
                <MapPin className="w-4 h-4" />
              </motion.div>
            ))}
          </div>

          {/* Branch list */}
          <div className="flex flex-col gap-3">
            {BRANCHES.map((b, i) => {
              const s = SUPERMARKETS.find((x) => x.id === b.store)!;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  whileHover={{ x: -4 }}
                  className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all bg-white"
                  style={{ border: "1.5px solid rgba(26,35,50,0.07)", boxShadow: "3px 3px 0 rgba(26,35,50,0.06)" }}
                >
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0"
                    style={{ background: s.color, boxShadow: `3px 3px 0 ${s.color}55` }}>
                    {s.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm" style={{ color: "var(--dark)" }}>{s.name} — {b.branch}</div>
                    <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: "rgba(26,35,50,0.45)" }}>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{b.open}</span>
                      <span className="flex items-center gap-1"><Star className="w-3 h-3" style={{ color: "var(--yellow)", fill: "var(--yellow)" }} />{b.rating}</span>
                    </div>
                  </div>
                  <div className="text-left shrink-0">
                    <div className="text-sm font-bold" style={{ color: "var(--dark)" }}>{b.dist}</div>
                    <button className="mt-1 text-xs font-bold flex items-center gap-1" style={{ color: "var(--green)" }}>
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
