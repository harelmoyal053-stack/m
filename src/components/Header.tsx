"use client";
import { useState } from "react";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
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

  const nav = ["השוואת סלים", "מבצעים", "סניפים"];

  return (
    <header className="sticky top-0 z-50" style={{ background: "var(--dark2)", borderBottom: "3px solid var(--dark)" }}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">

        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-base text-white"
            style={{ background: "var(--green)" }}>SB</div>
          <span className="font-black text-lg text-white tracking-tight hidden sm:block">SmartBasket</span>
        </div>

        {/* Color dots — design system accent */}
        <div className="hidden lg:flex items-center gap-1.5 mr-2">
          {["var(--red)","var(--yellow)","var(--green)","var(--blue)","var(--orange)"].map((c) => (
            <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 relative max-w-md mx-auto">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#8AAFC8" }} />
          <input
            type="text" value={query}
            onChange={(e) => handleQuery(e.target.value)}
            onBlur={() => setTimeout(() => setSuggestions([]), 200)}
            placeholder="חפש מוצר..."
            className="w-full pr-10 pl-4 py-2.5 text-sm text-right placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-all"
            style={{ background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: 12, color: "white" }}
          />
          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                className="absolute top-full mt-2 w-full rounded-2xl overflow-hidden z-50"
                style={{ background: "var(--surface)", border: "2px solid var(--dark)", boxShadow: "4px 4px 0 var(--dark)" }}
              >
                {suggestions.map((p) => (
                  <button key={p.id} onMouseDown={() => { addItem(p.id); setQuery(""); setSuggestions([]); }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-right">
                    <img src={p.img} alt={p.name} className="w-9 h-9 rounded-xl object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/36x36/e5e7eb/6b7280?text=${p.name[0]}`; }} />
                    <div className="flex-1">
                      <div className="font-bold text-sm" style={{ color: "var(--dark)" }}>{p.name}</div>
                      <div className="text-xs text-gray-400">{p.qty}</div>
                    </div>
                    <span className="text-xs font-black px-2 py-1 rounded-lg text-white" style={{ background: "var(--green)" }}>+ הוסף</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => (
            <button key={n} className="px-3 py-2 text-sm font-semibold rounded-xl transition-all hover:bg-white/10 text-gray-300 hover:text-white">{n}</button>
          ))}
        </nav>

        {/* Cart */}
        <button onClick={onCartClick}
          className="relative shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold transition-all hover:scale-105 active:scale-95"
          style={{ background: "var(--green)", boxShadow: "3px 3px 0 rgba(0,0,0,0.3)" }}>
          <ShoppingCart className="w-5 h-5" />
          {items.length > 0 && (
            <span className="absolute -top-1.5 -left-1.5 w-5 h-5 text-white text-[10px] font-black rounded-full flex items-center justify-center"
              style={{ background: "var(--red)" }}>
              {items.length}
            </span>
          )}
        </button>

        <button className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-white hover:bg-white/10 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden" style={{ background: "var(--dark)", borderTop: "2px solid rgba(255,255,255,0.1)" }}>
            <div className="px-4 py-3 flex flex-col gap-1">
              {nav.map((n) => (
                <button key={n} className="w-full text-right px-3 py-2.5 text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors">{n}</button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
