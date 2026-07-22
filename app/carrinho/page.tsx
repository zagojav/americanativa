"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/CartContext";
import { formatarPreco } from "@/components/PriceTag";

export default function CarrinhoPage() {
  const { itens, removerItem, atualizarQuantidade, totalPreco } = useCart();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function finalizarCompra() {
    setErro(null);
    setCarregando(true);
    try {
      const resposta = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itens }),
      });

      if (!resposta.ok) throw new Error("Falha ao iniciar o checkout.");

      const { initPoint } = await resposta.json();
      window.location.href = initPoint;
    } catch {
      setErro(
        "Não foi possível iniciar o pagamento. Verifique se as credenciais do Mercado Pago já foram configuradas."
      );
      setCarregando(false);
    }
  }

  if (itens.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl text-vinho">Seu carrinho está vazio</h1>
        <Link
          href="/produtos"
          className="mt-6 inline-block rounded-md bg-vinho px-6 py-3 text-creme hover:bg-dourado hover:text-vinho"
        >
          Ver produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-3xl text-vinho">Carrinho</h1>

      <div className="mt-8 divide-y divide-dourado/20 border-y border-dourado/20">
        {itens.map((item) => (
          <div key={item.slug} className="flex items-center justify-between gap-4 py-4">
            <div>
              <Link
                href={`/produtos/${item.categoria}/${item.slug}`}
                className="font-display text-lg text-vinho hover:text-dourado-dark"
              >
                {item.nome}
              </Link>
              <p className="text-sm text-vinho/60">{formatarPreco(item.precoUnitario)} / un.</p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                value={item.quantidade}
                onChange={(e) =>
                  atualizarQuantidade(item.slug, Number(e.target.value) || 1)
                }
                className="w-16 rounded border border-dourado/40 px-2 py-1 text-center"
              />
              <span className="w-24 text-right font-medium text-vinho">
                {formatarPreco(item.precoUnitario * item.quantidade)}
              </span>
              <button
                type="button"
                onClick={() => removerItem(item.slug)}
                className="text-sm text-vinho/50 hover:text-vinho"
                aria-label={`Remover ${item.nome}`}
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="font-display text-xl text-vinho">Total</span>
        <span className="font-display text-xl text-vinho">{formatarPreco(totalPreco)}</span>
      </div>

      {erro && <p className="mt-4 text-sm text-red-700">{erro}</p>}

      <button
        type="button"
        onClick={finalizarCompra}
        disabled={carregando}
        className="mt-6 w-full rounded-md bg-vinho px-6 py-3 font-medium uppercase tracking-wide text-creme transition-colors hover:bg-dourado hover:text-vinho disabled:opacity-60"
      >
        {carregando ? "Redirecionando..." : "Finalizar compra"}
      </button>
    </div>
  );
}
