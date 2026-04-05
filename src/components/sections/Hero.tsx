"use client";
import { motion } from "framer-motion";
import { TrendingDown, Star, Shield } from "lucide-react";

interface HeroProps {
  onScrollToProducts: () => void;
}

export default function Hero({ onScrollToProducts }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0f4c27] via-[#1a7a40] to-[#1FAF5A] text-white py-16 px-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#4BE38A]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-3 mb-8 flex-wrap"
        >
          {[
            { icon: <Shield className="w-3.5 h-3.5" />, text: "17 מוצרים במאגר" },
            { icon: <Star className="w-3.5 h-3.5" />, text: "3 רשתות גדולות" },
            { icon: <TrendingDown className="w-3.5 h-3.5" />, text: "חיסכון עד 30%" },
          ].map((b) => (
            <span key={b.text} className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold border border-white/20">
              {b.icon}{b.text}
            </span>
          ))}
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 tracking-tight"
        >
          כמה אתה{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-[#fbbf24]">משלם יותר מדי</span>
            <span className="absolute inset-x-0 bottom-1 h-3 bg-[#fbbf24]/20 rounded-full -z-0" />
          </span>
          {" "}בסופר?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-green-100 mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
        >
          בנה סל קניות וקבל את המחיר הכי זול באזור שלך תוך שניות.
          <br className="hidden sm:block" />
          SmartBasket משווה עבורך בין שופרסל, רמי לוי ויוחננוף.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center gap-4 flex-wrap"
        >
          <button
            onClick={onScrollToProducts}
            className="px-8 py-4 bg-white text-[#1FAF5A] font-black text-lg rounded-2xl shadow-xl shadow-black/20 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
          >
            התחל לבנות סל 🛒
          </button>
          <button className="px-8 py-4 bg-white/15 backdrop-blur-sm border border-white/30 text-white font-bold text-lg rounded-2xl hover:bg-white/25 transition-all">
            ראה מבצעים 🔥
          </button>
        </motion.div>

        {/* Floating stats */}
        <motion.div
          initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-14 grid grid-cols-3 gap-4 max-w-sm mx-auto"
        >
          {[
            { num: "₪47", label: "חיסכון ממוצע" },
            { num: "17", label: "מוצרים" },
            { num: "3", label: "רשתות" },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="text-2xl font-black">{s.num}</div>
              <div className="text-xs text-green-200 mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
