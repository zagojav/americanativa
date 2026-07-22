import type { Metadata } from "next";
import Link from "next/link";
import { PlaceholderImage } from "@/components/PlaceholderImage";

export const metadata: Metadata = {
  title: "Quem Somos",
  description:
    "Conheça a América Nativa, importadora que leva os melhores produtos da América do Sul até você.",
};

export default function QuemSomosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-4xl text-vinho">Quem Somos</h1>

      <PlaceholderImage label="equipe / origem dos produtos" className="mt-8 aspect-[16/9] w-full rounded-lg" />

      <div className="mt-8 space-y-6 text-lg leading-relaxed text-vinho/90">
        <p>
          A América Nativa nasceu de um propósito simples: aproximar pessoas
          dos melhores produtos da América do Sul, levando até você o que
          cada região tem de mais autêntico.
        </p>
        <p>
          Mais do que uma loja, somos uma importadora. Selecionamos a dedo
          desde alimentos típicos até vestuário e itens do dia a dia, trazendo
          direto da origem produtos que carregam história, qualidade e
          identidade.
        </p>
        <p>
          Trabalhamos para que o melhor do continente chegue até a sua casa ou
          o seu negócio com confiança — seja uma compra única ou um pedido em
          grande quantidade.
        </p>
        <p>
          América Nativa é mais que comércio: é a ponte entre a riqueza da
          América do Sul e você.
        </p>
      </div>

      <div className="mt-12 rounded-lg border border-dourado/40 bg-white p-6">
        {/* TODO: confirmar texto de franquia com o cliente */}
        <p className="text-vinho/80">
          Estamos expandindo por meio de franquias e pontos de venda.{" "}
          <Link href="/franquia" className="font-medium text-dourado-dark underline underline-offset-4 hover:text-vinho">
            Saiba mais sobre como se tornar um franqueado
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
