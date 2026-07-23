"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Logo";
import { useCart } from "./CartContext";
import { getCategoriasComContagem } from "@/lib/produtos";

const categorias = getCategoriasComContagem();

const linksInstitucionais = [
  { href: "/quem-somos", label: "Quem Somos" },
  { href: "/franquia", label: "Franquia" },
  { href: "/contato", label: "Contato" },
];

export function Header() {
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
          {linksInstitucionais.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-sans text-sm text-vinho hover:text-dourado-dark"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
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
          {linksInstitucionais.map((l) => (
            <Link key={l.href} href={l.href} className="py-2 text-sm text-vinho">
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
