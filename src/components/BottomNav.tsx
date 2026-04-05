"use client";
import { ShoppingCart, Flame, MapPin, Home } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

interface BottomNavProps {
  active: string;
  onChange: (tab: string) => void;
  onCartClick: () => void;
}

export default function BottomNav({ active, onChange, onCartClick }: BottomNavProps) {
  const items = useCartStore((s) => s.items);
  const tabs = [
    { id: "home",  icon: <Home className="w-5 h-5" />,  label: "בית" },
    { id: "deals", icon: <Flame className="w-5 h-5" />, label: "מבצעים" },
    { id: "map",   icon: <MapPin className="w-5 h-5" />, label: "סניפים" },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 lg:hidden" style={{ background: "var(--dark2)", borderTop: "2px solid rgba(255,255,255,0.08)" }}>
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-4">
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button key={tab.id} onClick={() => onChange(tab.id)}
              className="flex flex-col items-center gap-1 px-4 py-1 rounded-2xl transition-all"
              style={{ color: isActive ? "var(--green)" : "rgba(255,255,255,0.4)" }}>
              {tab.icon}
              <span className="text-[10px] font-bold">{tab.label}</span>
            </button>
          );
        })}

        {/* Cart button — raised */}
        <button onClick={onCartClick} className="relative flex flex-col items-center gap-1">
          <div className="relative w-12 h-11 rounded-2xl flex items-center justify-center text-white font-black -mt-6 transition-all hover:scale-105 active:scale-95"
            style={{ background: "var(--green)", boxShadow: "0 -2px 0 rgba(0,191,165,0.5), 3px 3px 0 rgba(0,0,0,0.3)" }}>
            <ShoppingCart className="w-5 h-5" />
            {items.length > 0 && (
              <span className="absolute -top-1.5 -left-1.5 w-5 h-5 text-white text-[10px] font-black rounded-full flex items-center justify-center"
                style={{ background: "var(--red)" }}>
                {items.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold" style={{ color: "var(--green)" }}>סל</span>
        </button>
      </div>
    </nav>
  );
}
