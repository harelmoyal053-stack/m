import { create } from "zustand";
import { PRODUCTS, SUPERMARKETS, type Supermarket } from "@/lib/data";

export interface CartItem {
  productId: number;
  qty: number;
}

interface CartState {
  items: CartItem[];
  addItem: (id: number) => void;
  removeItem: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  clearCart: () => void;
  loadPreset: (ids: number[]) => void;
  getTotal: (store: Supermarket) => number;
  getWinner: () => Supermarket | null;
  getSavings: () => number;
  getSplitBasket: () => { storeA: Supermarket; storeB: Supermarket; items: Record<number, Supermarket>; total: number } | null;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (id) =>
    set((s) => {
      if (s.items.find((i) => i.productId === id)) return s;
      return { items: [...s.items, { productId: id, qty: 1 }] };
    }),

  removeItem: (id) =>
    set((s) => ({ items: s.items.filter((i) => i.productId !== id) })),

  updateQty: (id, qty) =>
    set((s) => ({
      items: s.items.map((i) => (i.productId === id ? { ...i, qty: Math.max(1, qty) } : i)),
    })),

  clearCart: () => set({ items: [] }),

  loadPreset: (ids) => set({ items: ids.map((id) => ({ productId: id, qty: 1 })) }),

  getTotal: (store) => {
    const { items } = get();
    return items.reduce((sum, item) => {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      return sum + (product ? product.prices[store] * item.qty : 0);
    }, 0);
  },

  getWinner: () => {
    const { getTotal } = get();
    const totals = SUPERMARKETS.map((s) => ({ id: s.id, total: getTotal(s.id) }));
    if (totals.every((t) => t.total === 0)) return null;
    return totals.sort((a, b) => a.total - b.total)[0].id as Supermarket;
  },

  getSavings: () => {
    const { getTotal } = get();
    const totals = SUPERMARKETS.map((s) => getTotal(s.id)).filter((t) => t > 0);
    if (totals.length < 2) return 0;
    return Math.max(...totals) - Math.min(...totals);
  },

  // Split basket: for each item find the cheapest store, then pick 2 best stores
  getSplitBasket: () => {
    const { items } = get();
    if (items.length < 2) return null;

    const itemAssignments: Record<number, Supermarket> = {};
    items.forEach((item) => {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      if (!product) return;
      let cheapest: Supermarket = "shufersal";
      let min = Infinity;
      (Object.keys(product.prices) as Supermarket[]).forEach((s) => {
        if (product.prices[s] < min) { min = product.prices[s]; cheapest = s; }
      });
      itemAssignments[item.productId] = cheapest;
    });

    // Find top 2 stores by item count
    const counts: Record<string, number> = {};
    Object.values(itemAssignments).forEach((s) => { counts[s] = (counts[s] || 0) + 1; });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const storeA = (sorted[0]?.[0] ?? "shufersal") as Supermarket;
    const storeB = (sorted[1]?.[0] ?? "rami") as Supermarket;

    const total = items.reduce((sum, item) => {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      if (!product) return sum;
      const store = itemAssignments[item.productId];
      return sum + product.prices[store] * item.qty;
    }, 0);

    return { storeA, storeB, items: itemAssignments, total };
  },
}));
