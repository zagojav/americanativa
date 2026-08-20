"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { CartQuantityBanner } from "@/components/CartQuantityBanner";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { itensBloqueados } from "@/lib/cartRules";

export default function CheckoutPage() {
  const router = useRouter();
  const { itens, totalPreco } = useCart();
  const bloqueado = itensBloqueados(itens).length > 0;

  useEffect(() => {
    if (itens.length === 0) router.replace("/carrinho");
  }, [itens, router]);

  if (itens.length === 0) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-display text-3xl text-vinho">Finalizar compra</h1>

      <div className="mt-6">
        <CartQuantityBanner itens={itens} />
      </div>

      {bloqueado ? (
        <p className="mt-6 text-sm text-vinho/70">
          Ajuste as quantidades no{" "}
          <Link href="/carrinho" className="underline underline-offset-2">
            carrinho
          </Link>{" "}
          ou solicite um orçamento pelo WhatsApp acima para continuar.
        </p>
      ) : (
        <CheckoutForm itens={itens} totalPreco={totalPreco} />
      )}
    </div>
  );
}
