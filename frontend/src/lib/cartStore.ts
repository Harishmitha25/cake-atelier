import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Cake } from "./types";

export interface CartItem {
  cake: Cake;
  quantity: number;
  size?: string;
  flavor?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (cake: Cake, options?: { size?: string; flavor?: string; quantity?: number }) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clear: () => void;
}

export function lineKey(cakeId: string, size?: string, flavor?: string) {
  return `${cakeId}::${size ?? ""}::${flavor ?? ""}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (cake, options) =>
        set((state) => {
          const size = options?.size;
          const flavor = options?.flavor;
          const quantity = options?.quantity ?? 1;
          const key = lineKey(cake._id, size, flavor);
          const existing = state.items.find((i) => lineKey(i.cake._id, i.size, i.flavor) === key);
          if (existing) {
            return {
              items: state.items.map((i) =>
                lineKey(i.cake._id, i.size, i.flavor) === key
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { cake, quantity, size, flavor }] };
        }),
      removeItem: (key) =>
        set((state) => ({
          items: state.items.filter((i) => lineKey(i.cake._id, i.size, i.flavor) !== key),
        })),
      updateQuantity: (key, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => lineKey(i.cake._id, i.size, i.flavor) !== key)
              : state.items.map((i) =>
                  lineKey(i.cake._id, i.size, i.flavor) === key ? { ...i, quantity } : i
                ),
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
