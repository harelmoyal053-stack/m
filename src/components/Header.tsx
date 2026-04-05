"use client";
import { useState } from "react";
import { ShoppingCart, Search, Menu, X, Zap } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { PRODUCTS } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  onCartClick: () => void;
  onSearch: (q: string) => void;
}

export default function Header({ onCartClick, onSearch }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<typeof PRODUCTS>([]);
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);

  const handleQuery = (v: string) => {
    setQuery(v);
    onSearch(v);
    setSuggestions(v.length > 0 ? PRODUCTS.filter((p) => p.name.includes(v)).slice(0, 5) : []);
  };

  const nav = ["השוואת סלים", "מבצעים", "סניפים קרובים"];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#1FAF5A] to-[#4BE38A] flex items-center justify-center shadow-lg shadow-green-200">
            <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-black text-xl text-gray-900 tracking-tight hidden sm:block">SmartBasket</span>
        </div>

        {/* Search */}
        <div className="flex-1 relative max-w-lg mx-auto">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleQuery(e.target.value)}
            onBlur={() => setTimeout(() => setSuggestions([]), 200)}
            placeholder="חפש מוצר..."
            className="w-full pr-10 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-right placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1FAF5A]/30 focus:border-[#1FAF5A] transition-all"
          />
          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
              >
                {suggestions.map((p) => (
                  <button
                    key={p.id}
                    onMouseDown={() => { addItem(p.id); setQuery(""); setSuggestions([]); }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-right"
                  >
                    <img src={p.img} alt={p.name} className="w-10 h-10 rounded-xl object-cover" onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/40x40/e5e7eb/6b7280?text=${p.name[0]}`; }} />
                    <div>
                      <div className="font-semibold text-sm text-gray-800">{p.name}</div>
                      <div className="text-xs text-gray-400">{p.qty}</div>
                    </div>
                    <div className="mr-auto text-xs font-bold text-[#1FAF5A]">+ הוסף</div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav - desktop */}
        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => (
            <button key={n} className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#1FAF5A] hover:bg-green-50 rounded-xl transition-all">{n}</button>
          ))}
        </nav>

        {/* Cart button */}
        <button
          onClick={onCartClick}
          className="relative shrink-0 w-10 h-10 bg-[#1FAF5A] hover:bg-[#18a050] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-200 transition-all hover:scale-105 active:scale-95"
        >
          <ShoppingCart className="w-5 h-5" />
          {items.length > 0 && (
            <span className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {items.length}
            </span>
          )}
        </button>

        {/* Mobile menu */}
        <button className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-gray-100 bg-white overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {nav.map((n) => (
                <button key={n} className="w-full text-right px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">{n}</button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
