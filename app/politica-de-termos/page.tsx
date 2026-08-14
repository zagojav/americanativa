import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Termos",
  description: "Termos e condições de compra da América Nativa.",
};

export default function PoliticaDeTermosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-4xl text-vinho">Política de Termos</h1>

      {/* Conteúdo definitivo ainda depende de redação jurídica do cliente
          — mesmo padrão de placeholder usado em app/franquia/page.tsx. */}
      <div className="mt-6 rounded-md border border-dourado/40 bg-white p-4 text-sm text-vinho/70">
        <p className="font-medium text-vinho">Conteúdo provisório</p>
        <p className="mt-1">
          O texto definitivo desta política (condições de compra, trocas,
          devoluções e privacidade) ainda será redigido e publicado aqui.
        </p>
      </div>
    </div>
  );
}
