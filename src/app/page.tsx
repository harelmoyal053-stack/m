"use client";
import { useRef, useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/sections/Hero";
import ProductCatalog from "@/components/sections/ProductCatalog";
import CartPanel from "@/components/sections/CartPanel";
import ComparisonDashboard from "@/components/sections/ComparisonDashboard";
import HotDeals from "@/components/sections/HotDeals";
import StoreMap from "@/components/sections/StoreMap";
import BottomNav from "@/components/BottomNav";
import { useCartStore } from "@/store/cartStore";

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const productsRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const items = useCartStore((s) => s.items);

  const handleCompare = () => {
    setShowComparison(true);
    setTimeout(() => comparisonRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const handleScrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <Header
        onCartClick={() => setCartOpen(true)}
        onSearch={(q) => { setSearchQuery(q); handleScrollToProducts(); }}
      />

      <Hero onScrollToProducts={handleScrollToProducts} />

      <div ref={productsRef}>
        <ProductCatalog searchQuery={searchQuery} />
      </div>

      {/* Compare CTA banner */}
      {items.length > 0 && !showComparison && (
        <div className="sticky bottom-20 lg:bottom-4 z-30 flex justify-center px-4 mb-4">
          <button
            onClick={handleCompare}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#1FAF5A] to-[#4BE38A] text-white font-black text-lg rounded-2xl shadow-2xl shadow-green-300 hover:scale-105 active:scale-95 transition-all animate-bounce"
            style={{ animationIterationCount: 3 }}
          >
            ⚡ השווה {items.length} מוצרים עכשיו
          </button>
        </div>
      )}

      <div ref={comparisonRef}>
        {showComparison && <ComparisonDashboard />}
      </div>

      <HotDeals />
      <StoreMap />

      <CartPanel
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCompare={handleCompare}
      />

      <BottomNav
        active={activeTab}
        onChange={setActiveTab}
        onCartClick={() => setCartOpen(true)}
      />
    </div>
  );
}
