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
    { id: "home",   icon: <Home className="w-5 h-5" />,          label: "בית" },
    { id: "deals",  icon: <Flame className="w-5 h-5" />,         label: "מבצעים" },
    { id: "map",    icon: <MapPin className="w-5 h-5" />,        label: "סניפים" },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 safe-area-inset-bottom lg:hidden">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex flex-col items-center gap-1 px-4 py-1 rounded-2xl transition-all ${
              active === tab.id ? "text-[#1FAF5A]" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab.icon}
            <span className="text-[10px] font-semibold">{tab.label}</span>
          </button>
        ))}
        {/* Cart tab */}
        <button onClick={onCartClick} className="relative flex flex-col items-center gap-1 px-4 py-1">
          <div className="relative w-12 h-10 bg-gradient-to-br from-[#1FAF5A] to-[#4BE38A] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-300 -mt-5">
            <ShoppingCart className="w-5 h-5" />
            {items.length > 0 && (
              <span className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {items.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold text-[#1FAF5A]">סל</span>
        </button>
      </div>
    </nav>
  );
}
