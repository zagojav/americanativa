"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Logo";
import { useCart } from "./CartContext";
import type { getCategoriasComContagem } from "@/lib/produtos";

type CategoriaComContagem = Awaited<ReturnType<typeof getCategoriasComContagem>>[number];

export function Header({ categorias }: { categorias: CategoriaComContagem[] }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const { totalItens } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-dourado/30 bg-creme/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-10 w-10" priority />
          <span className="font-display text-lg text-vinho leading-none">
            América Nativa
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          <Link href="/" className="font-sans text-sm text-vinho hover:text-dourado-dark">
            Início
          </Link>
          <Link href="/quem-somos" className="font-sans text-sm text-vinho hover:text-dourado-dark">
            Quem Somos
          </Link>
          <div className="group relative">
            <button className="font-sans text-sm text-vinho hover:text-dourado-dark">
              Produtos
            </button>
            <div className="invisible absolute left-0 top-full grid w-64 grid-cols-1 gap-1 rounded-md border border-dourado/30 bg-white p-3 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
              {categorias
                .filter((c) => c.totalProdutos > 0)
                .map((c) => (
                  <Link
                    key={c.slug}
                    href={`/produtos/${c.slug}`}
                    className="rounded px-3 py-2 text-sm text-vinho hover:bg-creme"
                  >
                    {c.label}
                  </Link>
                ))}
              <Link
                href="/produtos"
                className="mt-1 rounded border-t border-dourado/20 px-3 py-2 text-sm font-medium text-dourado-dark"
              >
                Ver catálogo completo
              </Link>
            </div>
          </div>
          <Link href="/contato" className="font-sans text-sm text-vinho hover:text-dourado-dark">
            Contato
          </Link>
          <Link href="/franquia" className="font-sans text-sm text-vinho hover:text-dourado-dark">
            Franquia
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/entrar"
            aria-label="Entrar ou criar conta"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-vinho/30 text-vinho/70 hover:border-vinho hover:text-vinho"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
              <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.42 0-8 2.24-8 5v2h16v-2c0-2.76-3.58-5-8-5Z" />
            </svg>
          </Link>
          <Link
            href="/carrinho"
            className="relative rounded-md border border-vinho px-3 py-1.5 text-sm text-vinho hover:bg-vinho hover:text-creme"
          >
            Carrinho
            {totalItens > 0 && (
              <span className="ml-2 rounded-full bg-dourado px-2 py-0.5 text-xs font-semibold text-vinho">
                {totalItens}
              </span>
            )}
          </Link>
          <button
            className="lg:hidden text-vinho"
            aria-label="Abrir menu"
            onClick={() => setMenuAberto((v) => !v)}
          >
            {menuAberto ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {menuAberto && (
        <nav className="flex flex-col gap-1 border-t border-dourado/20 px-4 py-3 lg:hidden">
          <Link href="/" className="py-2 text-sm text-vinho">
            Início
          </Link>
          <Link href="/quem-somos" className="py-2 text-sm text-vinho">
            Quem Somos
          </Link>
          <Link href="/produtos" className="py-2 text-sm text-vinho">
            Produtos
          </Link>
          {categorias
            .filter((c) => c.totalProdutos > 0)
            .map((c) => (
              <Link
                key={c.slug}
                href={`/produtos/${c.slug}`}
                className="py-2 pl-4 text-sm text-vinho/80"
              >
                {c.label}
              </Link>
            ))}
          <Link href="/contato" className="py-2 text-sm text-vinho">
            Contato
          </Link>
          <Link href="/franquia" className="py-2 text-sm text-vinho">
            Franquia
          </Link>
        </nav>
      )}
    </header>
  );
}
