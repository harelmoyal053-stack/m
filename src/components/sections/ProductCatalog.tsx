"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check } from "lucide-react";
import { PRODUCTS, QUICK_LISTS, type Category } from "@/lib/data";
import { useCartStore } from "@/store/cartStore";

const CATS = [
  { id: "all",       label: "הכל",    emoji: "🛍️", color: "var(--dark)" },
  { id: "drinks",    label: "משקאות", emoji: "🥤", color: "var(--blue)" },
  { id: "dairy",     label: "חלב",    emoji: "🥛", color: "var(--yellow)" },
  { id: "pantry",    label: "מזון",   emoji: "🥫", color: "var(--orange)" },
  { id: "produce",   label: "ירקות",  emoji: "🥦", color: "var(--green)" },
  { id: "household", label: "ניקיון", emoji: "🧹", color: "var(--purple)" },
];

// Pastel backgrounds per category
const CAT_BG: Record<string, string> = {
  drinks:    "#DCEEFB",
  dairy:     "#FFF9DB",
  pantry:    "#FFF0E0",
  produce:   "#E0F7F5",
  household: "#F0EBFF",
};

interface Props { searchQuery?: string; }

export default function ProductCatalog({ searchQuery = "" }: Props) {
  const [activeCat, setActiveCat] = useState("all");
  const { items, addItem, removeItem, loadPreset } = useCartStore();
  const inCart = (id: number) => items.some((i) => i.productId === id);

  const catMeta = (id: string) => CATS.find((c) => c.id === id)!;

  const filtered = useMemo(() =>
    PRODUCTS.filter((p) => {
      const matchCat = activeCat === "all" || p.cat === activeCat;
      const matchQ = !searchQuery || p.name.includes(searchQuery) || p.qty.includes(searchQuery);
      return matchCat && matchQ;
    }), [activeCat, searchQuery]);

  return (
    <section className="py-10 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black" style={{ color: "var(--dark)" }}>בחר מוצרים</h2>
          <span className="text-sm font-bold px-3 py-1 rounded-xl" style={{ background: "rgba(26,35,50,0.08)", color: "var(--dark)" }}>
            {filtered.length} מוצרים
          </span>
        </div>

        {/* Quick lists */}
        <div className="flex gap-3 flex-wrap mb-6">
          {QUICK_LISTS.map((ql, i) => {
            const colors = ["var(--blue)", "var(--red)", "var(--purple)"];
            return (
              <motion.button
                key={ql.label}
                whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                onClick={() => loadPreset(ql.ids)}
                className="px-5 py-2.5 font-black text-sm text-white rounded-2xl transition-all"
                style={{ background: colors[i], boxShadow: `3px 3px 0 rgba(26,35,50,0.15)` }}
              >
                {ql.label}
              </motion.button>
            );
          })}
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar">
          {CATS.map((c) => {
            const active = activeCat === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCat(c.id)}
                className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-bold transition-all"
                style={active
                  ? { background: c.color, color: "#fff", boxShadow: `3px 3px 0 rgba(26,35,50,0.15)`, border: "2px solid transparent" }
                  : { background: "#fff", color: "var(--dark)", border: "2px solid rgba(26,35,50,0.1)" }
                }
              >
                {c.emoji} {c.label}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((product, i) => {
              const added = inCart(product.id);
              const minPrice = Math.min(...Object.values(product.prices));
              const cat = catMeta(product.cat);
              const bgColor = CAT_BG[product.cat] || "#F5F5F5";

              return (
                <motion.div
                  key={product.id} layout
                  initial={{ opacity: 0, scale: 0.88, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: -8 }}
                  transition={{ duration: 0.22, delay: i * 0.025 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="relative overflow-hidden cursor-pointer group"
                  style={{
                    background: "#fff",
                    borderRadius: 20,
                    border: added ? `2px solid var(--green)` : "2px solid rgba(26,35,50,0.07)",
                    boxShadow: added ? "4px 4px 0 rgba(0,191,165,0.3)" : "4px 4px 0 rgba(26,35,50,0.08)",
                    transition: "all 0.22s",
                  }}
                >
                  {/* Category color stripe */}
                  <div className="absolute top-0 inset-x-0 h-1" style={{ background: cat.color }} />

                  {/* Image */}
                  <div className="relative h-32 overflow-hidden" style={{ background: bgColor }}>
                    <img
                      src={product.img} alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/400x300/f3f4f6/9ca3af?text=${encodeURIComponent(product.name)}`; }}
                    />
                    {added && (
                      <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ background: "var(--green)", boxShadow: "2px 2px 0 rgba(0,0,0,0.2)" }}
                      >
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                    {product.alternative && (
                      <div className="absolute top-2 right-2 text-[9px] font-black px-2 py-0.5 rounded-full text-white"
                        style={{ background: "var(--orange)" }}>
                        💡 חלופה זולה
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3 pt-3">
                    <div className="font-black text-sm leading-tight mb-0.5" style={{ color: "var(--dark)" }}>{product.name}</div>
                    <div className="text-xs font-medium mb-3" style={{ color: "rgba(26,35,50,0.45)" }}>{product.qty}</div>

                    {product.alternative && (
                      <div className="mb-2 p-2 rounded-xl text-[10px] font-semibold leading-tight"
                        style={{ background: "#FFF0E0", color: "var(--orange)" }}>
                        🔄 {product.alternative.split("—")[0]}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px]" style={{ color: "rgba(26,35,50,0.4)" }}>מ-</div>
                        <div className="text-base font-black" style={{ color: "var(--green)" }}>₪{minPrice.toFixed(2)}</div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => added ? removeItem(product.id) : addItem(product.id)}
                        className="w-9 h-9 rounded-2xl flex items-center justify-center text-white font-black text-lg transition-all"
                        style={added
                          ? { background: "#FFE5E5", color: "var(--red)", boxShadow: "2px 2px 0 rgba(244,67,54,0.2)" }
                          : { background: "var(--dark)", boxShadow: "2px 2px 0 rgba(26,35,50,0.2)" }
                        }
                      >
                        {added ? "×" : <Plus className="w-5 h-5" strokeWidth={3} />}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20" style={{ color: "rgba(26,35,50,0.4)" }}>
            <div className="text-5xl mb-4">🔍</div>
            <div className="font-bold">לא נמצאו מוצרים</div>
          </div>
        )}
      </div>
    </section>
  );
}
