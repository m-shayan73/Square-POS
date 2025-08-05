"use client";

import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

import { type CartStore, createCartStore } from "@/stores/cart-store";

export type CartStoreApi = ReturnType<typeof createCartStore>;

const CartStoreContext = createContext<CartStoreApi | undefined>(undefined);

interface CartStoreContextProps {
  children: React.ReactNode;
}

export const CartStoreProvider = ({ children }: CartStoreContextProps) => {
  const cartStore = useRef<CartStoreApi | undefined>(undefined);

  if (cartStore.current === undefined) {
    cartStore.current = createCartStore();
  }

  return (
    <CartStoreContext.Provider value={cartStore.current}>
      {children}
    </CartStoreContext.Provider>
  );
};

export const useCartStore = <T,>(selector: (store: CartStore) => T): T => {
  const cartStoreContext = useContext(CartStoreContext);

  if (!cartStoreContext) {
    throw new Error("useCartStore must be used within CartStoreProvider");
  }

  return useStore(cartStoreContext, selector);
};
