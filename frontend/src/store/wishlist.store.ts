import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
  productIds: string[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggle: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      productIds: [],

      addItem: (productId) => {
        if (!get().productIds.includes(productId)) {
          set({ productIds: [...get().productIds, productId] });
        }
      },

      removeItem: (productId) =>
        set({ productIds: get().productIds.filter((id) => id !== productId) }),

      toggle: (productId) => {
        if (get().productIds.includes(productId)) {
          set({ productIds: get().productIds.filter((id) => id !== productId) });
        } else {
          set({ productIds: [...get().productIds, productId] });
        }
      },

      isInWishlist: (productId) => get().productIds.includes(productId),

      clearWishlist: () => set({ productIds: [] }),
    }),
    { name: 'kitking-wishlist' }
  )
);
