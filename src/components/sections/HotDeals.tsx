"use client";
import { motion } from "framer-motion";
import { Flame, Plus } from "lucide-react";
import { PRODUCTS, SUPERMARKETS, HOT_DEALS } from "@/lib/data";
import { useCartStore } from "@/store/cartStore";

export default function HotDeals() {
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);

  return (
    <section className="py-12 px-4 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2">
            <Flame className="w-7 h-7 text-orange-500" /> מבצעים חמים
          </h2>
          <span className="text-sm font-semibold text-gray-400">{HOT_DEALS.length} מבצעים פעילים</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {HOT_DEALS.map((deal, i) => {
            const product = PRODUCTS.find((p) => p.id === deal.productId)!;
            const storeMeta = SUPERMARKETS.find((s) => s.id === deal.store)!;
            const originalPrice = product.prices[deal.store];
            const pctOff = Math.round((1 - deal.salePrice / originalPrice) * 100);
            const inCart = items.some((x) => x.productId === product.id);

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 group"
              >
                <div className="relative h-28 overflow-hidden">
                  <img src={product.img} alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/300x200/f3f4f6/9ca3af?text=${encodeURIComponent(product.name)}`; }}
                  />
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    -{pctOff}%
                  </div>
                  <div className="absolute top-2 left-2 text-[9px] font-black px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: storeMeta.color }}>
                    {storeMeta.name}
                  </div>
                </div>
                <div className="p-3">
                  <div className="font-bold text-xs text-gray-900 mb-0.5 leading-tight">{product.name}</div>
                  <div className="text-[10px] text-gray-400 mb-2">{product.qty}</div>
                  <div className="flex items-end justify-between gap-1">
                    <div>
                      <div className="text-[10px] text-gray-400 line-through">₪{originalPrice.toFixed(2)}</div>
                      <div className="text-base font-black text-[#1FAF5A]">₪{deal.salePrice.toFixed(2)}</div>
                    </div>
                    <button
                      onClick={() => addItem(product.id)}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                        inCart ? "bg-green-100 text-[#1FAF5A]" : "bg-[#1FAF5A] text-white hover:bg-[#18a050] shadow-sm"
                      }`}
                    >
                      {inCart ? "✓" : <Plus className="w-4 h-4" strokeWidth={3} />}
                    </button>
                  </div>
                  <div className="mt-2 text-[9px] font-bold text-orange-500">{deal.badge}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
