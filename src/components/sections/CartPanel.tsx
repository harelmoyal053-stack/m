"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Trash2, Plus, Minus, Mic, ScanBarcode, X, BarChart3 } from "lucide-react";
import { PRODUCTS } from "@/lib/data";
import { useCartStore } from "@/store/cartStore";

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCompare: () => void;
}

export default function CartPanel({ isOpen, onClose, onCompare }: CartPanelProps) {
  const { items, removeItem, updateQty, clearCart, getTotal } = useCartStore();
  const cartProducts = items.map((i) => ({ ...i, product: PRODUCTS.find((p) => p.id === i.productId)! })).filter((i) => i.product);
  const minTotal = Math.min(...(["shufersal","rami","yohananof"] as const).map((s) => getTotal(s)));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50" style={{ background: "rgba(13,21,32,0.6)", backdropFilter: "blur(4px)" }}
            onClick={onClose} />

          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed top-0 left-0 h-full w-full max-w-sm z-50 flex flex-col"
            style={{ background: "var(--bg)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5" style={{ background: "var(--dark2)", borderBottom: "3px solid var(--dark)" }}>
              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "var(--green)", boxShadow: "3px 3px 0 rgba(0,191,165,0.4)" }}>
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-black text-lg leading-tight">הסל שלי</div>
                  <div className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>{items.length} מוצרים</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button onClick={clearCart} className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105"
                    style={{ background: "rgba(244,67,54,0.15)", color: "var(--red)" }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all hover:bg-white/10">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Voice / Barcode */}
            <div className="flex gap-3 p-4" style={{ background: "#fff", borderBottom: "1.5px solid rgba(26,35,50,0.08)" }}>
              {[{ icon: <Mic className="w-4 h-4" />, label: "קלט קולי" }, { icon: <ScanBarcode className="w-4 h-4" />, label: "סריקת ברקוד" }].map((b) => (
                <button key={b.label} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-bold transition-all hover:scale-102"
                  style={{ background: "rgba(26,35,50,0.05)", border: "1.5px solid rgba(26,35,50,0.1)", color: "var(--dark)" }}>
                  <span style={{ color: "var(--green)" }}>{b.icon}</span> {b.label}
                </button>
              ))}
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence initial={false}>
                {cartProducts.length === 0 ? (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-48 text-center">
                    <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-4"
                      style={{ background: "rgba(26,35,50,0.06)", boxShadow: "3px 3px 0 rgba(26,35,50,0.06)" }}>
                      <ShoppingCart className="w-8 h-8" style={{ color: "rgba(26,35,50,0.25)" }} />
                    </div>
                    <div className="font-bold" style={{ color: "var(--dark)" }}>הסל ריק</div>
                    <div className="text-sm mt-1" style={{ color: "rgba(26,35,50,0.4)" }}>הוסף מוצרים מהקטלוג</div>
                  </motion.div>
                ) : (
                  cartProducts.map(({ product, qty }) => (
                    <motion.div key={product.id} layout
                      initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -32 }}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-white"
                      style={{ border: "1.5px solid rgba(26,35,50,0.07)", boxShadow: "3px 3px 0 rgba(26,35,50,0.06)" }}
                    >
                      <img src={product.img} alt={product.name} className="w-14 h-14 rounded-2xl object-cover shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/56x56/f3f4f6/9ca3af?text=${product.name[0]}`; }} />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm truncate" style={{ color: "var(--dark)" }}>{product.name}</div>
                        <div className="text-xs font-medium" style={{ color: "rgba(26,35,50,0.4)" }}>{product.qty}</div>
                        {product.alternative && (
                          <div className="text-[10px] font-bold mt-0.5" style={{ color: "var(--orange)" }}>💡 {product.alternative.split("—")[0]}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button onClick={() => updateQty(product.id, qty - 1)}
                          className="w-7 h-7 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                          style={{ background: "rgba(26,35,50,0.08)" }}>
                          <Minus className="w-3.5 h-3.5" style={{ color: "var(--dark)" }} />
                        </button>
                        <span className="w-6 text-center text-sm font-black" style={{ color: "var(--dark)" }}>{qty}</span>
                        <button onClick={() => updateQty(product.id, qty + 1)}
                          className="w-7 h-7 rounded-xl flex items-center justify-center text-white transition-all hover:scale-110"
                          style={{ background: "var(--green)", boxShadow: "2px 2px 0 rgba(0,191,165,0.3)" }}>
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button onClick={() => removeItem(product.id)}
                        className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-all hover:scale-110"
                        style={{ background: "#FFE5E5", color: "var(--red)" }}>
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 space-y-3 bg-white" style={{ borderTop: "2px solid rgba(26,35,50,0.08)" }}>
                <div className="flex items-center justify-between px-1">
                  <span className="font-medium text-sm" style={{ color: "rgba(26,35,50,0.5)" }}>מינימום אפשרי</span>
                  <span className="text-2xl font-black" style={{ color: "var(--green)" }}>₪{minTotal.toFixed(2)}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { onCompare(); onClose(); }}
                  className="w-full py-4 font-black text-lg text-white rounded-2xl flex items-center justify-center gap-2 transition-all"
                  style={{ background: "var(--dark)", boxShadow: "4px 4px 0 rgba(26,35,50,0.25)" }}
                >
                  <BarChart3 className="w-5 h-5" style={{ color: "var(--green)" }} />
                  השווה מחירים ({items.length} מוצרים)
                </motion.button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
