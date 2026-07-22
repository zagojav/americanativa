"use client";

import { useState } from "react";
import { useCart } from "./CartContext";

export function AddToCartButton({
  slug,
  categoria,
  nome,
  precoUnitario,
}: {
  slug: string;
  categoria: string;
  nome: string;
  precoUnitario: number;
}) {
  const { adicionarItem } = useCart();
  const [adicionado, setAdicionado] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        adicionarItem({ slug, categoria, nome, precoUnitario });
        setAdicionado(true);
        setTimeout(() => setAdicionado(false), 1800);
      }}
      className="w-full rounded-md bg-vinho px-6 py-3 text-sm font-medium uppercase tracking-wide text-creme transition-colors hover:bg-dourado hover:text-vinho"
    >
      {adicionado ? "Adicionado ao carrinho" : "Adicionar ao carrinho"}
    </button>
  );
}
