import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Id } from "@/convex/_generated/dataModel";

interface WishlistState {
  items: Id<"products">[];
  toggleItem: (productId: Id<"products">) => boolean; // returns true if added, false if removed
  isInWishlist: (productId: Id<"products">) => boolean;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (productId) => {
        const { items } = get();
        const exists = items.includes(productId);

        if (exists) {
          set({ items: items.filter((id) => id !== productId) });
          return false;
        } else {
          set({ items: [...items, productId] });
          return true;
        }
      },
      isInWishlist: (productId) => {
        return get().items.includes(productId);
      },
    }),
    {
      name: "bait-els3ada-wishlist",
    },
  ),
);
