"use client";
import { motion } from "framer-motion";
import { Flame, Plus } from "lucide-react";
import { PRODUCTS, SUPERMARKETS, HOT_DEALS } from "@/lib/data";
import { useCartStore } from "@/store/cartStore";

const DEAL_COLORS = ["var(--red)", "var(--blue)", "var(--orange)", "var(--purple)", "var(--green)", "var(--pink)"];

export default function HotDeals() {
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);

  return (
    <section className="py-12 px-4" style={{ background: "var(--dark2)" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <Flame className="w-7 h-7" style={{ color: "var(--orange)" }} /> מבצעים חמים
          </h2>
          {/* Color dots */}
          <div className="flex gap-1.5">
            {DEAL_COLORS.map((c) => <div key={c} className="w-3.5 h-3.5 rounded-full" style={{ background: c }} />)}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {HOT_DEALS.map((deal, i) => {
            const product = PRODUCTS.find((p) => p.id === deal.productId)!;
            const storeMeta = SUPERMARKETS.find((s) => s.id === deal.store)!;
            const origPrice = product.prices[deal.store];
            const pctOff = Math.round((1 - deal.salePrice / origPrice) * 100);
            const inCart = items.some((x) => x.productId === product.id);
            const accentColor = DEAL_COLORS[i % DEAL_COLORS.length];

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="relative overflow-hidden cursor-pointer group"
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  border: `2px solid rgba(255,255,255,0.08)`,
                  boxShadow: `4px 4px 0 ${accentColor}55`,
                }}
              >
                {/* Accent top bar */}
                <div className="h-1.5" style={{ background: accentColor }} />

                <div className="relative h-28 overflow-hidden" style={{ background: "#f5f5f5" }}>
                  <img src={product.img} alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/300x200/f3f4f6/9ca3af?text=${encodeURIComponent(product.name)}`; }}
                  />
                  {/* Discount badge */}
                  <div className="absolute top-2 right-2 text-white text-[10px] font-black px-2 py-0.5 rounded-full"
                    style={{ background: "var(--red)", boxShadow: "2px 2px 0 rgba(0,0,0,0.2)" }}>
                    -{pctOff}%
                  </div>
                  {/* Store badge */}
                  <div className="absolute top-2 left-2 text-white text-[9px] font-black px-2 py-0.5 rounded-full"
                    style={{ background: storeMeta.color }}>
                    {storeMeta.name}
                  </div>
                </div>

                <div className="p-3">
                  <div className="font-bold text-xs leading-tight mb-0.5" style={{ color: "var(--dark)" }}>{product.name}</div>
                  <div className="text-[10px] mb-2 font-medium" style={{ color: "rgba(26,35,50,0.4)" }}>{product.qty}</div>
                  <div className="flex items-end justify-between gap-1">
                    <div>
                      <div className="text-[10px] line-through" style={{ color: "rgba(26,35,50,0.35)" }}>₪{origPrice.toFixed(2)}</div>
                      <div className="text-base font-black" style={{ color: "var(--green)" }}>₪{deal.salePrice.toFixed(2)}</div>
                    </div>
                    <button
                      onClick={() => addItem(product.id)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold transition-all"
                      style={inCart
                        ? { background: "#E0FAF4", color: "var(--green)" }
                        : { background: "var(--dark)", color: "white", boxShadow: "2px 2px 0 rgba(26,35,50,0.2)" }
                      }
                    >
                      {inCart ? "✓" : <Plus className="w-4 h-4" strokeWidth={3} />}
                    </button>
                  </div>
                  <div className="mt-2 text-[9px] font-black" style={{ color: accentColor }}>{deal.badge}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
