"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import * as cartStore from "@/lib/cartStore";
import type { CartItem } from "@/lib/cartStore";

export type { CartItem };

type CartContextValue = {
  itens: CartItem[];
  adicionarItem: (item: Omit<CartItem, "quantidade">, quantidade?: number) => void;
  removerItem: (slug: string) => void;
  atualizarQuantidade: (slug: string, quantidade: number) => void;
  limparCarrinho: () => void;
  totalItens: number;
  totalPreco: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const itens = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot
  );

  const totalItens = useMemo(
    () => itens.reduce((soma, i) => soma + i.quantidade, 0),
    [itens]
  );
  const totalPreco = useMemo(
    () => itens.reduce((soma, i) => soma + i.quantidade * i.precoUnitario, 0),
    [itens]
  );

  return (
    <CartContext.Provider
      value={{
        itens,
        adicionarItem: cartStore.adicionarItem,
        removerItem: cartStore.removerItem,
        atualizarQuantidade: cartStore.atualizarQuantidade,
        limparCarrinho: cartStore.limparCarrinho,
        totalItens,
        totalPreco,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de <CartProvider>");
  return ctx;
}
