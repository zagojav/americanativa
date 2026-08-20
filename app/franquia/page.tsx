import type { Metadata } from "next";
import { FranquiaForm } from "@/components/FranquiaForm";
import { Logo } from "@/components/Logo";

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
            está expandindo por meio de franquias e pontos de venda. Junte-se
            a nós.
          </p>
        </div>
        <div className="flex aspect-[4/3] w-full items-center justify-center rounded-lg border border-dourado/30 bg-vinho/5">
          <Logo className="h-32 w-32" />
        </div>
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
