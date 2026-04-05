"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, TrendingDown, Split, Share2, Info } from "lucide-react";
import { PRODUCTS, SUPERMARKETS, type Supermarket } from "@/lib/data";
import { useCartStore } from "@/store/cartStore";

export default function ComparisonDashboard() {
  const { items, getTotal, getWinner, getSavings, getSplitBasket } = useCartStore();
  const [splitMode, setSplitMode] = useState(false);
  const cartProducts = items.map((i) => ({ ...i, product: PRODUCTS.find((p) => p.id === i.productId)! })).filter((x) => x.product);

  const winner = getWinner();
  const savings = getSavings();
  const split = getSplitBasket();

  const allTotals = SUPERMARKETS.map((s) => ({ ...s, total: getTotal(s.id) })).sort((a, b) => a.total - b.total);
  const maxTotal = Math.max(...allTotals.map((s) => s.total));

  // WhatsApp share
  const handleShare = () => {
    if (!winner) return;
    const winnerMeta = SUPERMARKETS.find((s) => s.id === winner)!;
    const lines = cartProducts.map(({ product, qty }) =>
      `• ${product.name} (${product.qty}) × ${qty} — ₪${(product.prices[winner] * qty).toFixed(2)}`
    ).join("\n");
    const msg = `🛒 רשימת הקניות שלי - SmartBasket\n\n${lines}\n\n✅ סה"כ ב${winnerMeta.name}: ₪${getTotal(winner).toFixed(2)}\n💰 חיסכון: ₪${savings.toFixed(2)} לעומת היקר ביותר!\n\nhttps://harelmoyal053-stack.github.io/m/`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  if (items.length === 0) return null;

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-green-50 text-[#1FAF5A] px-5 py-2 rounded-full text-sm font-bold mb-4 border border-green-200">
            <Trophy className="w-4 h-4" /> תוצאות ההשוואה
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
            {winner ? `${SUPERMARKETS.find((s) => s.id === winner)?.name} מנצחת! 🏆` : "בחר מוצרים להשוואה"}
          </motion.h2>
          {savings > 0 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg text-gray-500 font-medium">
              תחסוך <span className="text-[#1FAF5A] font-black text-xl">₪{savings.toFixed(2)}</span> לעומת הרשת היקרה ביותר
            </motion.p>
          )}
        </div>

        {/* Smart Savings Tip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
          className="tip-glow mb-8 p-4 bg-gradient-to-l from-amber-50 to-yellow-50 border border-amber-200 rounded-3xl flex items-start gap-4"
        >
          <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0 text-xl">💡</div>
          <div>
            <div className="font-black text-amber-900 mb-1">טיפ חכם לחיסכון</div>
            <div className="text-sm text-amber-700 font-medium">רכישת מותג פרטי תחסוך לכם עוד ~15% על סל זה! חפש את תווית "פרטי" לצד המוצרים.</div>
          </div>
        </motion.div>

        {/* Split basket toggle */}
        {split && (
          <div className="flex items-center justify-center mb-8">
            <button
              onClick={() => setSplitMode(!splitMode)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl border-2 font-bold text-sm transition-all ${
                splitMode ? "bg-[#1FAF5A] border-[#1FAF5A] text-white shadow-lg shadow-green-200" : "bg-white border-gray-200 text-gray-700 hover:border-[#1FAF5A] hover:text-[#1FAF5A]"
              }`}
            >
              <Split className="w-4 h-4" />
              {splitMode ? "🔀 מצב סל מפוצל — פעיל" : "פיצול סל בין 2 רשתות"}
            </button>
          </div>
        )}

        {/* Split basket view */}
        <AnimatePresence>
          {splitMode && split && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-gradient-to-l from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl p-6">
                <h3 className="font-black text-gray-900 text-xl mb-2 flex items-center gap-2">
                  <Split className="w-5 h-5 text-blue-500" /> אסטרטגיית סל מפוצל
                </h3>
                <p className="text-gray-500 text-sm mb-5">קנה כל מוצר ברשת הזולה ביותר עבורו — ותחסוך מקסימום!</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  {[split.storeA, split.storeB].map((storeId) => {
                    const storeMeta = SUPERMARKETS.find((s) => s.id === storeId)!;
                    const storeItems = cartProducts.filter(({ product }) => split.items[product.id] === storeId);
                    return (
                      <div key={storeId} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <div className="font-black text-base mb-3" style={{ color: storeMeta.color }}>{storeMeta.name}</div>
                        {storeItems.map(({ product, qty }) => (
                          <div key={product.id} className="flex justify-between text-sm py-1.5 border-b border-gray-50">
                            <span className="text-gray-700">{product.name}</span>
                            <span className="font-bold text-gray-900">₪{(product.prices[storeId] * qty).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-green-200">
                  <span className="font-bold text-gray-700">סה"כ מפוצל</span>
                  <span className="text-2xl font-black text-[#1FAF5A]">₪{split.total.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comparison table header */}
        <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-3 px-4 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
          <div className="text-right">מוצר</div>
          {SUPERMARKETS.map((s) => (
            <div key={s.id} className="text-center" style={{ color: s.color }}>{s.name}</div>
          ))}
        </div>

        {/* Items rows (desktop table) */}
        <div className="hidden lg:block bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm mb-8">
          {cartProducts.map(({ product, qty }, i) => {
            const prices = SUPERMARKETS.map((s) => product.prices[s.id] * qty);
            const minP = Math.min(...prices);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-3 items-center px-4 py-3 ${i % 2 === 0 ? "bg-gray-50/50" : "bg-white"}`}
              >
                <div className="flex items-center gap-3">
                  <img src={product.img} alt={product.name} className="w-10 h-10 rounded-xl object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/40x40/f3f4f6/9ca3af?text=${product.name[0]}`; }} />
                  <div>
                    <div className="font-bold text-sm text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-400">{product.qty} × {qty}</div>
                  </div>
                </div>
                {SUPERMARKETS.map((s, si) => {
                  const price = product.prices[s.id] * qty;
                  const isBest = price === minP;
                  return (
                    <div key={s.id} className="text-center">
                      <span className={`inline-block px-3 py-1.5 rounded-xl text-sm font-bold ${isBest ? "text-white shadow-sm" : "text-gray-600 bg-gray-100"}`}
                        style={isBest ? { backgroundColor: s.color } : {}}>
                        ₪{price.toFixed(2)}
                        {isBest && " ✓"}
                      </span>
                    </div>
                  );
                })}
              </motion.div>
            );
          })}

          {/* Totals row */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-3 items-center px-4 py-4 border-t-2 border-gray-200 bg-gray-50">
            <div className="font-black text-gray-900">סה"כ</div>
            {SUPERMARKETS.map((s) => {
              const total = getTotal(s.id);
              const isWinner = s.id === winner;
              return (
                <div key={s.id} className="text-center">
                  <span className={`text-xl font-black ${isWinner ? "" : "text-gray-400"}`} style={isWinner ? { color: s.color } : {}}>
                    ₪{total.toFixed(2)}
                    {isWinner && " 🏆"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile cards */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {allTotals.map((s, i) => {
            const isWinnerCard = s.id === winner;
            const pct = maxTotal > 0 ? (s.total / maxTotal) * 100 : 0;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className={`relative rounded-3xl overflow-hidden border-2 transition-all ${isWinnerCard ? "winner-glow" : "border-gray-100"}`}
                style={isWinnerCard ? { borderColor: s.color } : {}}
              >
                {isWinnerCard && (
                  <div className="badge-bounce absolute top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-black px-4 py-1 rounded-full whitespace-nowrap shadow-lg z-10">
                    🏆 הכי זול!
                  </div>
                )}
                <div className="pt-10 pb-5 px-5 text-center text-white" style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}cc)` }}>
                  <div className="text-2xl font-black">{s.name}</div>
                  <div className="text-sm opacity-80 mt-1">{s.tagline}</div>
                  <div className="text-4xl font-black mt-4">₪{s.total.toFixed(2)}</div>
                  {!isWinnerCard && maxTotal > 0 && (
                    <div className="text-sm opacity-80 mt-1">+₪{(s.total - Math.min(...allTotals.map((x) => x.total))).toFixed(2)} יקר יותר</div>
                  )}
                  {isWinnerCard && savings > 0 && (
                    <div className="mt-3 inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
                      חיסכון ₪{savings.toFixed(2)}
                    </div>
                  )}
                </div>
                <div className="bg-white p-4 space-y-2">
                  {/* Progress bar */}
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: i * 0.1 + 0.3 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: s.color }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{s.arrival} הגעה</span>
                    <span>{items.length} מוצרים</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* WhatsApp share */}
        {winner && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="flex justify-center"
          >
            <button
              onClick={handleShare}
              className="flex items-center gap-3 px-8 py-4 bg-[#25D366] hover:bg-[#1da851] text-white font-black text-lg rounded-2xl shadow-xl shadow-green-200 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
            >
              <Share2 className="w-5 h-5" />
              📱 שתף את הרשימה בוואטסאפ
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
