"use client";

import type { CartItem } from "@/lib/cartStore";
import { itensBloqueados, itensEmAviso } from "@/lib/cartRules";
import { linkWhatsappNegociarQuantidade, linkWhatsappOrcamentoGrande } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/site-config";

export function CartQuantityBanner({ itens }: { itens: CartItem[] }) {
  const bloqueados = itensBloqueados(itens);
  if (bloqueados.length > 0) {
    return (
      <div className="rounded-md border border-red-300 bg-red-50 p-4">
        <p className="text-sm text-red-800">
          Pedidos com mais de {siteConfig.atacado.quantidadeMinima} unidades do mesmo
          produto precisam de orçamento:{" "}
          {bloqueados.map((i) => `${i.nome} (${i.quantidade} un.)`).join(", ")}.
        </p>
        <a
          href={linkWhatsappOrcamentoGrande(bloqueados)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-2 rounded-md bg-vinho px-4 py-2 text-sm font-medium text-creme transition-colors hover:bg-dourado hover:text-vinho"
        >
          Pedir orçamento no WhatsApp
        </a>
      </div>
    );
  }

  const emAviso = itensEmAviso(itens);
  if (emAviso.length > 0) {
    return (
      <div className="rounded-md border border-yellow-300 bg-yellow-50 p-4">
        <p className="text-sm text-yellow-900">
          Pedidos a partir de {siteConfig.atacado.quantidadeAviso} unidades podem ter
          condições especiais. Quer negociar?{" "}
          <a
            href={linkWhatsappNegociarQuantidade(emAviso)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-2"
          >
            Fale com a gente no WhatsApp.
          </a>
        </p>
      </div>
    );
  }

  return null;
}
