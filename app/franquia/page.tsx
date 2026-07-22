import type { Metadata } from "next";
import { FranquiaForm } from "@/components/FranquiaForm";
import { PlaceholderImage } from "@/components/PlaceholderImage";

export const metadata: Metadata = {
  title: "Franquia",
  description: "Seja um franqueado América Nativa e leve os sabores da Bolívia para o seu negócio.",
};

export default function FranquiaPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="grid gap-10 sm:grid-cols-2 sm:items-center">
        <div>
          <h1 className="font-display text-4xl text-vinho">Seja um franqueado</h1>
          <p className="mt-4 text-lg text-vinho/80">
            Leve os sabores da Bolívia para o seu negócio. A América Nativa
            está expandindo por meio de franquias e pontos de venda — junte-se
            a nós.
          </p>

          {/* Texto final e condições comerciais ainda dependem de informação
              do cliente — conteúdo abaixo é provisório. */}
          <div className="mt-6 rounded-md border border-dourado/40 bg-white p-4 text-sm text-vinho/70">
            <p className="font-medium text-vinho">Conteúdo provisório</p>
            <p className="mt-1">
              Investimento inicial, condições comerciais, suporte oferecido e
              modelo de royalties ainda serão confirmados com o cliente antes
              da publicação definitiva desta página.
            </p>
          </div>
        </div>
        <PlaceholderImage label="ponto de venda / franquia" className="aspect-[4/3] w-full rounded-lg" />
      </div>

      <div className="mt-16 max-w-xl">
        <h2 className="font-display text-2xl text-vinho">Quero saber mais</h2>
        <div className="mt-6">
          <FranquiaForm />
        </div>
      </div>
    </div>
  );
}
