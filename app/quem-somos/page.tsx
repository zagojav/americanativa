import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { BrandMotif } from "@/components/BrandMotif";

export const metadata: Metadata = {
  title: "Quem Somos",
  description:
    "Conheça a América Nativa, importadora que leva os melhores produtos da América do Sul até você.",
};

export default function QuemSomosPage() {
  return (
    <div className="relative overflow-hidden">
      <BrandMotif />
      <div className="relative mx-auto max-w-3xl px-4 py-16">
        <h1 className="font-display text-4xl text-vinho">Quem Somos</h1>

        <div className="mt-8 flex aspect-[16/9] w-full items-center justify-center rounded-lg border border-dourado/30 bg-vinho/5">
          <Logo className="h-32 w-32" />
        </div>

        <div className="mt-8 space-y-6 text-lg leading-relaxed text-vinho/90">
          <p>
            A América Nativa nasceu do propósito de conectar pessoas e empresas à
            riqueza incomparável da América do Sul, aproximando mercados, culturas e
            oportunidades por meio de produtos que traduzem a autenticidade, a
            tradição e a diversidade do nosso continente.
          </p>
          <p>
            Mais do que uma distribuidora, somos uma empresa especializada em
            importação e exportação, comprometida em construir pontes entre
            produtores, parceiros comerciais e consumidores. Atuamos com excelência
            para transformar fronteiras em oportunidades, oferecendo soluções
            completas em comércio exterior, logística e despacho aduaneiro, sempre
            com agilidade, segurança e eficiência.
          </p>
          <p>
            Cada operação é conduzida com responsabilidade, transparência e profundo
            respeito às legislações nacionais e internacionais. Entendemos que cada
            cliente possui necessidades únicas e, por isso, desenvolvemos soluções
            personalizadas que agregam valor, impulsionam negócios e fortalecem
            relações de confiança duradouras.
          </p>
          <p>
            Nosso compromisso vai além da entrega de produtos e serviços. Acreditamos
            em um modelo de negócios sustentável, pautado pela responsabilidade
            ambiental, pelo desenvolvimento social e pela valorização das pessoas que
            fazem parte de toda a cadeia de negócios.
          </p>
          <p>
            Na América Nativa, cada produto transporta uma história, cada parceria
            fortalece conexões e cada negociação representa uma oportunidade de
            aproximar o melhor da América do Sul de novos mercados.
          </p>
          <p className="font-semibold">América Nativa.</p>
          <p className="font-semibold">
            Conectamos fronteiras, aproximamos culturas e levamos a autenticidade da
            América do Sul para o mundo.
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
    </div>
  );
}
