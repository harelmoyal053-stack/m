"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, Zap } from "lucide-react";
import { PRODUCTS, QUICK_LISTS, type Category } from "@/lib/data";
import { useCartStore } from "@/store/cartStore";

const CATS = [
  { id: "all",       label: "הכל",         emoji: "🛍️" },
  { id: "drinks",    label: "משקאות",       emoji: "🥤" },
  { id: "dairy",     label: "חלב",          emoji: "🥛" },
  { id: "pantry",    label: "מזון",          emoji: "🥫" },
  { id: "produce",   label: "ירקות ופירות", emoji: "🥦" },
  { id: "household", label: "ניקיון",        emoji: "🧹" },
];

interface ProductCatalogProps {
  searchQuery?: string;
}

export default function ProductCatalog({ searchQuery = "" }: ProductCatalogProps) {
  const [activeCat, setActiveCat] = useState<string>("all");
  const { items, addItem, removeItem, loadPreset } = useCartStore();
  const inCart = (id: number) => items.some((i) => i.productId === id);

  const filtered = useMemo(() =>
    PRODUCTS.filter((p) => {
      const matchCat = activeCat === "all" || p.cat === activeCat;
      const matchQ = searchQuery === "" || p.name.includes(searchQuery) || p.qty.includes(searchQuery);
      return matchCat && matchQ;
    }), [activeCat, searchQuery]);

  return (
    <section className="py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Quick lists */}
        <div className="mb-8">
          <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#1FAF5A]" /> סלים מוכנים
          </h2>
          <div className="flex gap-3 flex-wrap">
            {QUICK_LISTS.map((ql) => (
              <motion.button
                key={ql.label}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => loadPreset(ql.ids)}
                className="px-5 py-3 bg-white border-2 border-gray-200 hover:border-[#1FAF5A] hover:text-[#1FAF5A] hover:bg-green-50 rounded-2xl text-sm font-bold text-gray-700 shadow-sm transition-all"
              >
                {ql.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
          {CATS.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCat(c.id)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-semibold transition-all ${
                activeCat === c.id
                  ? "bg-[#1FAF5A] text-white shadow-lg shadow-green-200"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-[#1FAF5A] hover:text-[#1FAF5A]"
              }`}
            >
              <span>{c.emoji}</span>{c.label}
            </button>
          ))}
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((product, i) => {
              const added = inCart(product.id);
              const minPrice = Math.min(...Object.values(product.prices));
              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: -8 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                  className={`group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-2 ${
                    added ? "border-[#1FAF5A] shadow-green-100" : "border-transparent hover:border-gray-100"
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-36 overflow-hidden bg-gray-50">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/400x300/f3f4f6/9ca3af?text=${encodeURIComponent(product.name)}`; }}
                    />
                    {added && (
                      <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="absolute top-2 left-2 w-7 h-7 bg-[#1FAF5A] rounded-full flex items-center justify-center shadow-lg"
                      >
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                    {product.alternative && (
                      <div className="absolute top-2 right-2 bg-amber-400 text-amber-900 text-[9px] font-black px-2 py-0.5 rounded-full">
                        💡 חלופה זולה
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <div className="font-bold text-sm text-gray-900 mb-0.5 leading-tight">{product.name}</div>
                    <div className="text-xs text-gray-400 mb-3 font-medium">{product.qty}</div>

                    {/* Alternative suggestion */}
                    {product.alternative && (
                      <div className="mb-2 p-2 bg-amber-50 rounded-xl text-[10px] text-amber-700 font-semibold leading-tight">
                        🔄 {product.alternative}
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-gray-400 block">מ-</span>
                        <span className="text-base font-black text-[#1FAF5A]">₪{minPrice.toFixed(2)}</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                        onClick={() => added ? removeItem(product.id) : addItem(product.id)}
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-lg transition-all shadow-sm ${
                          added
                            ? "bg-red-50 text-red-400 hover:bg-red-100"
                            : "bg-[#1FAF5A] text-white hover:bg-[#18a050] shadow-green-200"
                        }`}
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
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🔍</div>
            <div className="font-semibold">לא נמצאו מוצרים</div>
          </div>
        )}
      </div>
    </section>
  );
}
