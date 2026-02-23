import { create } from "zustand";
import { useCartStore } from "./use-cart";
import { persist } from "zustand/middleware";
import { api } from "@/convex/_generated/api";
import { useEffect, useCallback } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useConvexAuth, useQuery } from "convex/react";

interface WishlistState {
  items: Id<"products">[];
  setItems: (items: Id<"products">[]) => void;
  addItemLocal: (productId: Id<"products">) => void;
  removeItemLocal: (productId: Id<"products">) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      setItems: (items) => set({ items }),
      addItemLocal: (productId) => {
        const { items } = get();
        if (!items.includes(productId)) {
          set({ items: [...items, productId] });
        }
      },
      removeItemLocal: (productId) => {
        set({ items: get().items.filter((id) => id !== productId) });
      },
    }),
    {
      name: "bait-els3ada-wishlist",
    },
  ),
);

export const useWishlist = () => {
  const store = useWishlistStore();
  const { sessionId } = useCartStore(); // Use same sessionId as cart
  const { isAuthenticated } = useConvexAuth();

  const toggleMutation = useMutation(api.favorites.toggle);
  const syncMutation = useMutation(api.favorites.syncFavorites);
  const backendFavorites = useQuery(api.favorites.get, {
    sessionId: sessionId || undefined,
  });

  // Update local store when backend data changes
  useEffect(() => {
    if (backendFavorites) {
      store.setItems(backendFavorites.map((p) => p._id));
    }
  }, [backendFavorites, store]);

  // Sync guest favorites on login
  useEffect(() => {
    if (isAuthenticated && sessionId) {
      syncMutation({ sessionId }).catch(console.error);
    }
  }, [isAuthenticated, sessionId, syncMutation, store]);

  const toggleItem = useCallback(
    async (productId: Id<"products">) => {
      // Optimistic update
      const exists = store.items.includes(productId);
      if (exists) {
        store.removeItemLocal(productId);
      } else {
        store.addItemLocal(productId);
      }

      try {
        return await toggleMutation({
          productId,
          sessionId: sessionId || undefined,
        });
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
        // Revert optimistic update on error
        if (exists) {
          store.addItemLocal(productId);
        } else {
          store.removeItemLocal(productId);
        }
        return !exists;
      }
    },
    [store, toggleMutation, sessionId],
  );

  const isInWishlist = useCallback(
    (productId: Id<"products">) => {
      return store.items.includes(productId);
    },
    [store.items],
  );

  return {
    items: store.items,
    toggleItem,
    isInWishlist,
    isLoading: backendFavorites === undefined,
    favoriteProducts: backendFavorites || [],
  };
};
