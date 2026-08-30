import { create } from "zustand";
import type { CartItem } from "./types";

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (cakeId: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),
  removeItem: (cakeId) =>
    set((state) => ({
      items: state.items.filter((i) => i.cake._id !== cakeId),
    })),
  clear: () => set({ items: [] }),
}));
