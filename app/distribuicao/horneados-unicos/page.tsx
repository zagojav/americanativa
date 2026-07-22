import type { Metadata } from "next";
import Link from "next/link";
import { PlaceholderImage } from "@/components/PlaceholderImage";

// ⚠️ Compliance: o uso do nome e do logo "Horneados Únicos" depende de
// autorização confirmada do fornecedor/cliente antes de esta página ir ao ar
// em produção. Não substituir os placeholders abaixo por imagens geradas por
// IA — usar apenas os arquivos reais enviados pelo cliente.

export const metadata: Metadata = {
  title: "Horneados Únicos",
  description:
    "América Nativa é distribuidora oficial dos Horneados Únicos no Brasil — tradição familiar boliviana à base de queijo e amido de yuca.",
};

export default function HorneadosUnicosPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="flex justify-center">
        {/* Logo placeholder — substituir pelo arquivo real do fornecedor */}
        <PlaceholderImage label="logo Horneados Únicos" className="h-32 w-32 rounded-full" />
      </div>

      <h1 className="mt-8 text-center font-display text-4xl text-vinho">
        Horneados Únicos
      </h1>

      <div className="mx-auto mt-8 max-w-2xl space-y-6 text-lg leading-relaxed text-vinho/90">
        <p>
          Os Horneados Únicos nascem da tradição familiar de Luz Marina,
          produzidos artesanalmente na Bolívia com receitas passadas entre
          gerações. Cada lote é feito à base de queijo e amido de yuca,
          garantindo o sabor autêntico e a textura crocante que consagraram a
          marca no país de origem.
        </p>
        <p>
          A América Nativa é distribuidora oficial dos Horneados Únicos no
          Brasil, responsável por trazer diretamente da Bolívia essa linha de
          produtos com toda a qualidade e o cuidado que o processo exige. Do
          forno boliviano até a sua mesa, mantemos o compromisso com a
          autenticidade de cada receita.
        </p>
      </div>

      {/* Galeria — fotos reais pendentes de envio pelo cliente */}
      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <PlaceholderImage label="Horneados Únicos — foto 1" className="aspect-square w-full rounded-lg" />
        <PlaceholderImage label="Horneados Únicos — foto 2" className="aspect-square w-full rounded-lg" />
        <PlaceholderImage label="Horneados Únicos — foto 3" className="aspect-square w-full rounded-lg" />
      </div>

      <div className="mt-12 flex justify-center">
        <Link
          href="/produtos/horneados-unicos"
          className="rounded-md bg-vinho px-8 py-3 font-medium uppercase tracking-wide text-creme transition-colors hover:bg-dourado hover:text-vinho"
        >
          Ver produtos Horneados Únicos
        </Link>
      </div>
    </div>
  );
}
