import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Cake } from "./types";

interface CartItem {
  cake: Cake;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (cake: Cake) => void;
  removeItem: (cakeId: string) => void;
  updateQuantity: (cakeId: string, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (cake) =>
        set((state) => {
          const existing = state.items.find((i) => i.cake._id === cake._id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.cake._id === cake._id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { cake, quantity: 1 }] };
        }),
      removeItem: (cakeId) =>
        set((state) => ({ items: state.items.filter((i) => i.cake._id !== cakeId) })),
      updateQuantity: (cakeId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.cake._id !== cakeId)
              : state.items.map((i) => (i.cake._id === cakeId ? { ...i, quantity } : i)),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "cake-atelier-cart" }
  )
);

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.cake.price * i.quantity, 0);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}
