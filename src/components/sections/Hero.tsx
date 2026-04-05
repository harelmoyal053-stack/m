"use client";
import { motion } from "framer-motion";
import { TrendingDown } from "lucide-react";

interface HeroProps { onScrollToProducts: () => void; }

export default function Hero({ onScrollToProducts }: HeroProps) {
  const shapes = [
    { size: 90,  top: "8%",  left: "4%",  color: "var(--blue)",   opacity: 0.18, delay: 0 },
    { size: 60,  top: "60%", left: "1%",  color: "var(--red)",    opacity: 0.2,  delay: 0.4 },
    { size: 44,  top: "75%", left: "8%",  color: "var(--yellow)", opacity: 0.35, delay: 0.8 },
    { size: 110, top: "5%",  right: "3%", color: "var(--orange)", opacity: 0.15, delay: 0.2 },
    { size: 55,  top: "55%", right: "2%", color: "var(--purple)", opacity: 0.2,  delay: 0.6 },
    { size: 38,  top: "80%", right: "9%", color: "var(--green)",  opacity: 0.4,  delay: 1 },
  ];

  const stats = [
    { num: "17", label: "מוצרים",  color: "var(--blue)" },
    { num: "3",  label: "רשתות",   color: "var(--red)" },
    { num: "30%",label: "חיסכון",  color: "var(--green)" },
  ];

  return (
    <section className="relative overflow-hidden py-16 px-4" style={{ background: "var(--dark2)" }}>
      {/* Floating shapes */}
      {shapes.map((s, i) => (
        <motion.div
          key={i}
          className="float shape-circle"
          style={{
            width: s.size, height: s.size,
            background: s.color, opacity: s.opacity,
            top: s.top, left: (s as any).left, right: (s as any).right,
            animationDelay: `${s.delay}s`,
          }}
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: s.delay, duration: 0.5 }}
        />
      ))}

      {/* Color stripe */}
      <div className="absolute top-0 inset-x-0 h-1.5 flex">
        {["var(--red)","var(--orange)","var(--yellow)","var(--green)","var(--blue)","var(--purple)"].map((c, i) => (
          <div key={i} className="flex-1" style={{ background: c }} />
        ))}
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black mb-6 text-white"
          style={{ background: "var(--green)", boxShadow: "3px 3px 0 rgba(0,191,165,0.4)" }}
        >
          <TrendingDown className="w-3.5 h-3.5" /> חכם. מהיר. חוסך כסף.
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black text-white leading-tight mb-5"
          style={{ letterSpacing: "-0.02em" }}
        >
          כמה אתה{" "}
          <span className="relative inline-block">
            <span className="relative z-10" style={{ color: "var(--yellow)" }}>משלם יותר מדי</span>
            <motion.span
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.6, duration: 0.4 }}
              className="absolute inset-x-0 bottom-1 h-2 rounded-full opacity-30 origin-right"
              style={{ background: "var(--yellow)" }}
            />
          </span>
          {" "}בסופר?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-lg text-gray-400 mb-10 max-w-xl mx-auto font-medium"
        >
          בנה סל קניות וקבל את המחיר הכי זול תוך שניות.
          SmartBasket משווה בין שופרסל, רמי לוי ויוחננוף.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-4 flex-wrap mb-14"
        >
          <button
            onClick={onScrollToProducts}
            className="px-8 py-4 font-black text-lg rounded-2xl text-white transition-all hover:scale-105 active:scale-95"
            style={{ background: "var(--green)", boxShadow: "4px 4px 0 rgba(0,191,165,0.5)" }}
          >
            התחל לבנות סל 🛒
          </button>
          <button
            className="px-8 py-4 font-bold text-lg rounded-2xl transition-all hover:scale-105 active:scale-95"
            style={{ background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.2)", color: "white" }}
          >
            ראה מבצעים 🔥
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-4 flex-wrap"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 + i * 0.1, type: "spring" }}
              className="flex flex-col items-center px-8 py-4 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.06)", border: `2px solid ${s.color}33` }}
            >
              <span className="text-3xl font-black" style={{ color: s.color }}>{s.num}</span>
              <span className="text-xs text-gray-400 font-semibold mt-1">{s.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
