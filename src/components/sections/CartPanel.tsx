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

  const minTotal = Math.min(...["shufersal", "rami", "yohananof"].map((s) => getTotal(s as never)));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-[#1FAF5A] to-[#4BE38A]">
              <div className="flex items-center gap-3 text-white">
                <ShoppingCart className="w-6 h-6" />
                <div>
                  <div className="font-black text-lg leading-tight">הסל שלי</div>
                  <div className="text-green-100 text-sm">{items.length} מוצרים</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button onClick={clearCart} className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button onClick={onClose} className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Voice / Barcode placeholders */}
            <div className="flex gap-3 p-4 border-b border-gray-100">
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-2xl text-sm font-semibold text-gray-600 transition-colors">
                <Mic className="w-4 h-4 text-[#1FAF5A]" /> קלט קולי
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-2xl text-sm font-semibold text-gray-600 transition-colors">
                <ScanBarcode className="w-4 h-4 text-[#1FAF5A]" /> סריקת ברקוד
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence initial={false}>
                {cartProducts.length === 0 ? (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-48 text-gray-400"
                  >
                    <ShoppingCart className="w-12 h-12 mb-3 text-gray-200" />
                    <div className="font-semibold">הסל ריק</div>
                    <div className="text-sm mt-1">הוסף מוצרים מהקטלוג</div>
                  </motion.div>
                ) : (
                  cartProducts.map(({ product, qty }) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
                      className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3"
                    >
                      <img src={product.img} alt={product.name}
                        className="w-14 h-14 rounded-2xl object-cover shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/56x56/f3f4f6/9ca3af?text=${product.name[0]}`; }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-gray-900 truncate">{product.name}</div>
                        <div className="text-xs text-gray-400">{product.qty}</div>
                        {product.alternative && (
                          <div className="text-[10px] text-amber-600 font-semibold mt-0.5">💡 {product.alternative.split("—")[0]}</div>
                        )}
                      </div>
                      {/* Qty controls */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button onClick={() => updateQty(product.id, qty - 1)}
                          className="w-7 h-7 rounded-xl bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors">
                          <Minus className="w-3.5 h-3.5 text-gray-600" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-gray-900">{qty}</span>
                        <button onClick={() => updateQty(product.id, qty + 1)}
                          className="w-7 h-7 rounded-xl bg-[#1FAF5A] hover:bg-[#18a050] flex items-center justify-center transition-colors">
                          <Plus className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                      <button onClick={() => removeItem(product.id)}
                        className="w-7 h-7 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 transition-colors shrink-0">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t border-gray-100 space-y-3 bg-white">
                <div className="flex items-center justify-between px-1">
                  <span className="text-gray-500 font-medium">מינימום אפשרי:</span>
                  <span className="text-2xl font-black text-[#1FAF5A]">₪{minTotal.toFixed(2)}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { onCompare(); onClose(); }}
                  className="w-full py-4 bg-gradient-to-r from-[#1FAF5A] to-[#4BE38A] text-white font-black text-lg rounded-2xl shadow-lg shadow-green-200 flex items-center justify-center gap-2 hover:shadow-xl transition-all"
                >
                  <BarChart3 className="w-5 h-5" />
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
