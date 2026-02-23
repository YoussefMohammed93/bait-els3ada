import { create } from "zustand";
import { useEffect, useMemo } from "react";
import { persist } from "zustand/middleware";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useConvexAuth } from "convex/react";

export interface CartItem {
  productId: Id<"products">;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  sessionId: string;
  addItem: (productId: Id<"products">, quantity?: number) => void;
  removeItem: (productId: Id<"products">) => void;
  updateQuantity: (productId: Id<"products">, quantity: number) => void;
  clearCart: () => void;
  setItems: (items: CartItem[]) => void;
  setSessionId: (id: string) => void;
}

const generateSessionId = () => {
  return (
    "guest_" +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      sessionId: "",
      addItem: (productId, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find((item) => item.productId === productId);
        if (existingItem) {
          set({
            items: items.map((item) =>
              item.productId === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            ),
          });
        } else {
          set({ items: [...items, { productId, quantity }] });
        }
      },
      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.productId !== productId),
        });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item,
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      setItems: (items) => set({ items }),
      setSessionId: (id) => set({ sessionId: id }),
    }),
    {
      name: "bait-els3ada-cart",
    },
  ),
);

export const useCart = () => {
  const store = useCartStore();
  const updateItemsMutation = useMutation(api.cart.updateItems);
  const syncCartMutation = useMutation(api.cart.syncCart);

  // Initialize Session ID
  useEffect(() => {
    if (!store.sessionId) {
      store.setSessionId(generateSessionId());
    }
  }, [store]);

  // Sync session cart on mount if guest
  useEffect(() => {
    if (store.sessionId) {
      updateItemsMutation({
        sessionId: store.sessionId,
        items: store.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      }).catch(console.error);
    }
  }, [store.items, store.sessionId, updateItemsMutation]);

  const { isAuthenticated } = useConvexAuth();

  // Sync guest cart to user on login
  useEffect(() => {
    if (isAuthenticated && store.sessionId && store.items.length > 0) {
      syncCartMutation({ sessionId: store.sessionId }).catch(console.error);
    }
  }, [isAuthenticated, store.sessionId, store.items.length, syncCartMutation]);

  const totalItems = useMemo(() => {
    return store.items.reduce((acc, item) => acc + item.quantity, 0);
  }, [store.items]);

  return {
    ...store,
    totalItems,
  };
};
