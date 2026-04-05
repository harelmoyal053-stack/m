"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Split, Share2, TrendingDown } from "lucide-react";
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
  const minTotal = Math.min(...allTotals.map((s) => s.total));

  const handleShare = () => {
    if (!winner) return;
    const winnerMeta = SUPERMARKETS.find((s) => s.id === winner)!;
    const lines = cartProducts.map(({ product, qty }) =>
      `• ${product.name} ×${qty} — ₪${(product.prices[winner] * qty).toFixed(2)}`).join("\n");
    const msg = `🛒 רשימת הקניות שלי - SmartBasket\n\n${lines}\n\nסה"כ ב${winnerMeta.name}: ₪${getTotal(winner).toFixed(2)}\n💰 חיסכון: ₪${savings.toFixed(2)}\n\nhttps://harelmoyal053-stack.github.io/m/`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  if (items.length === 0) return null;

  return (
    <section className="py-12 px-4" style={{ background: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl text-sm font-black text-white mb-4"
            style={{ background: "var(--dark)", boxShadow: "3px 3px 0 rgba(26,35,50,0.2)" }}
          >
            <Trophy className="w-4 h-4" style={{ color: "var(--yellow)" }} /> תוצאות ההשוואה
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-black mb-2" style={{ color: "var(--dark)" }}
          >
            {winner ? `${SUPERMARKETS.find((s) => s.id === winner)?.name} מנצחת! 🏆` : "בחר מוצרים"}
          </motion.h2>
          {savings > 0 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-base font-medium" style={{ color: "rgba(26,35,50,0.55)" }}>
              תחסוך <span className="font-black text-xl" style={{ color: "var(--green)" }}>₪{savings.toFixed(2)}</span> לעומת הרשת היקרה
            </motion.p>
          )}
        </div>

        {/* Tip banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
          className="tip-glow mb-8 flex items-center gap-4 p-4 rounded-3xl"
          style={{ background: "#FFFBEA", border: "2px solid var(--yellow)", boxShadow: "4px 4px 0 rgba(255,193,7,0.25)" }}
        >
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0"
            style={{ background: "var(--yellow)", boxShadow: "3px 3px 0 rgba(0,0,0,0.1)" }}>💡</div>
          <div>
            <div className="font-black text-sm" style={{ color: "var(--dark)" }}>טיפ חכם לחיסכון</div>
            <div className="text-xs font-medium mt-0.5" style={{ color: "rgba(26,35,50,0.6)" }}>מותג פרטי יחסוך לכם עוד ~15%! חפש את סימון ״מותג פרטי״ ליד כל מוצר.</div>
          </div>
        </motion.div>

        {/* Split toggle */}
        {split && (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setSplitMode(!splitMode)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all"
              style={splitMode
                ? { background: "var(--blue)", color: "white", boxShadow: "3px 3px 0 rgba(21,101,192,0.3)" }
                : { background: "#fff", color: "var(--dark)", border: "2px solid rgba(26,35,50,0.12)", boxShadow: "3px 3px 0 rgba(26,35,50,0.08)" }
              }
            >
              <Split className="w-4 h-4" />
              {splitMode ? "🔀 סל מפוצל — פעיל" : "פיצול סל בין 2 רשתות"}
            </button>
          </div>
        )}

        {/* Split basket */}
        <AnimatePresence>
          {splitMode && split && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="p-5 rounded-3xl" style={{ background: "#EFF4FF", border: "2px solid var(--blue)", boxShadow: "4px 4px 0 rgba(21,101,192,0.15)" }}>
                <h3 className="font-black text-lg mb-4 flex items-center gap-2" style={{ color: "var(--dark)" }}>
                  <Split className="w-5 h-5" style={{ color: "var(--blue)" }} /> סל מפוצל — מקסימום חיסכון
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {[split.storeA, split.storeB].map((storeId) => {
                    const s = SUPERMARKETS.find((x) => x.id === storeId)!;
                    const storeItems = cartProducts.filter(({ product }) => split.items[product.id] === storeId);
                    return (
                      <div key={storeId} className="rounded-2xl p-4 bg-white" style={{ border: `2px solid ${s.color}33`, boxShadow: "3px 3px 0 rgba(26,35,50,0.06)" }}>
                        <div className="font-black text-base mb-3" style={{ color: s.color }}>{s.name}</div>
                        {storeItems.map(({ product, qty }) => (
                          <div key={product.id} className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                            <span style={{ color: "var(--dark)" }}>{product.name}</span>
                            <span className="font-bold" style={{ color: "var(--dark)" }}>₪{(product.prices[storeId] * qty).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white" style={{ border: "2px solid var(--green)", boxShadow: "3px 3px 0 rgba(0,191,165,0.2)" }}>
                  <span className="font-bold" style={{ color: "var(--dark)" }}>סה"כ מפוצל</span>
                  <span className="text-2xl font-black" style={{ color: "var(--green)" }}>₪{split.total.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop table */}
        <div className="hidden lg:block rounded-3xl overflow-hidden mb-8" style={{ background: "#fff", border: "2px solid rgba(26,35,50,0.08)", boxShadow: "5px 5px 0 rgba(26,35,50,0.07)" }}>
          {/* Table header */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-0 border-b-2 border-gray-100">
            <div className="px-5 py-3 text-xs font-black uppercase tracking-wider" style={{ color: "rgba(26,35,50,0.4)" }}>מוצר</div>
            {SUPERMARKETS.map((s) => (
              <div key={s.id} className="px-3 py-3 text-center text-xs font-black uppercase" style={{ color: s.color, borderRight: "1px solid #f3f4f6" }}>{s.name}</div>
            ))}
          </div>

          {cartProducts.map(({ product, qty }, i) => {
            const prices = SUPERMARKETS.map((s) => product.prices[s.id] * qty);
            const minP = Math.min(...prices);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-0 border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-3 px-5 py-3">
                  <img src={product.img} alt={product.name} className="w-10 h-10 rounded-xl object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/40x40/f3f4f6/9ca3af?text=${product.name[0]}`; }} />
                  <div>
                    <div className="font-bold text-sm" style={{ color: "var(--dark)" }}>{product.name}</div>
                    <div className="text-xs" style={{ color: "rgba(26,35,50,0.4)" }}>{product.qty} × {qty}</div>
                  </div>
                </div>
                {SUPERMARKETS.map((s) => {
                  const price = product.prices[s.id] * qty;
                  const isBest = price === minP;
                  return (
                    <div key={s.id} className="flex items-center justify-center px-3 py-3" style={{ borderRight: "1px solid #f3f4f6" }}>
                      <span
                        className="px-3 py-1.5 rounded-xl text-sm font-bold"
                        style={isBest
                          ? { background: s.color, color: "white", boxShadow: `2px 2px 0 ${s.color}55` }
                          : { background: "#f5f5f5", color: "rgba(26,35,50,0.5)" }
                        }
                      >
                        ₪{price.toFixed(2)}{isBest ? " ✓" : ""}
                      </span>
                    </div>
                  );
                })}
              </motion.div>
            );
          })}

          {/* Totals */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-0" style={{ background: "var(--dark)", borderTop: "2px solid rgba(255,255,255,0.1)" }}>
            <div className="px-5 py-4 font-black text-white">סה"כ</div>
            {SUPERMARKETS.map((s) => {
              const total = getTotal(s.id);
              const isWin = s.id === winner;
              return (
                <div key={s.id} className="flex flex-col items-center justify-center px-3 py-4" style={{ borderRight: "1px solid rgba(255,255,255,0.08)" }}>
                  <span className="text-xl font-black" style={{ color: isWin ? s.color : "rgba(255,255,255,0.4)" }}>
                    ₪{total.toFixed(2)}
                  </span>
                  {isWin && <span className="text-[10px] font-bold mt-0.5" style={{ color: "var(--yellow)" }}>🏆 הכי זול</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile cards */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {allTotals.map((s, i) => {
            const isWin = s.id === winner;
            const pct = maxTotal > 0 ? ((s.total - minTotal) / (maxTotal - minTotal || 1)) * 100 : 0;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className={`relative rounded-3xl overflow-visible ${isWin ? "winner-pulse" : ""}`}
                style={{
                  background: "#fff",
                  border: `2.5px solid ${isWin ? s.color : "rgba(26,35,50,0.08)"}`,
                  boxShadow: isWin ? `5px 5px 0 ${s.color}33` : "4px 4px 0 rgba(26,35,50,0.07)",
                }}
              >
                {isWin && (
                  <div className="badge-bounce absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black text-white whitespace-nowrap"
                    style={{ background: "var(--yellow)", color: "var(--dark)", boxShadow: "2px 2px 0 rgba(0,0,0,0.15)" }}>
                    🏆 הכי זול!
                  </div>
                )}
                {/* Colored top bar */}
                <div className="h-2 rounded-t-3xl" style={{ background: s.color }} />
                <div className="p-5 pt-4">
                  <div className="font-black text-xl mb-0.5" style={{ color: s.color }}>{s.name}</div>
                  <div className="text-xs font-medium mb-4" style={{ color: "rgba(26,35,50,0.45)" }}>{s.tagline}</div>
                  <div className="text-4xl font-black mb-1" style={{ color: "var(--dark)" }}>₪{s.total.toFixed(2)}</div>
                  {!isWin && <div className="text-xs font-bold" style={{ color: "var(--red)" }}>+₪{(s.total - minTotal).toFixed(2)} יקר יותר</div>}
                  {isWin && savings > 0 && <div className="text-xs font-bold" style={{ color: "var(--green)" }}>חיסכון ₪{savings.toFixed(2)} ✓</div>}

                  {/* Price bar */}
                  <div className="mt-4 h-2 rounded-full overflow-hidden" style={{ background: "rgba(26,35,50,0.08)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${100 - pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 + 0.3 }}
                      className="h-full rounded-full"
                      style={{ background: s.color }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] font-semibold" style={{ color: "rgba(26,35,50,0.4)" }}>
                    <span>⏱ {s.arrival}</span>
                    <span>{items.length} מוצרים</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* WhatsApp share */}
        {winner && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex justify-center">
            <button
              onClick={handleShare}
              className="flex items-center gap-3 px-8 py-4 font-black text-lg text-white rounded-2xl transition-all hover:scale-105 active:scale-95"
              style={{ background: "#25D366", boxShadow: "4px 4px 0 rgba(37,211,102,0.4)" }}
            >
              <Share2 className="w-5 h-5" />
              📱 שתף בוואטסאפ
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
