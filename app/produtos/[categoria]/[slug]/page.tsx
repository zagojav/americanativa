import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduto, getTodosProdutos } from "@/lib/produtos";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { PriceTag } from "@/components/PriceTag";
import { AtacadoBlock } from "@/components/AtacadoBlock";
import { AddToCartButton } from "@/components/AddToCartButton";
import { VariantSelector } from "@/components/VariantSelector";

export function generateStaticParams() {
  return getTodosProdutos().map((p) => ({ categoria: p.categoria, slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string; slug: string }>;
}): Promise<Metadata> {
  const { categoria, slug } = await params;
  const produto = getProduto(categoria, slug);
  if (!produto) return {};
  return {
    title: produto.nome,
    description: produto.descricao,
  };
}

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ categoria: string; slug: string }>;
}) {
  const { categoria, slug } = await params;
  const produto = getProduto(categoria, slug);
  if (!produto) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="grid gap-10 sm:grid-cols-2">
        <PlaceholderImage label={produto.nome} className="aspect-square w-full rounded-lg" />

        <div>
          <h1 className="font-display text-3xl text-vinho">{produto.nome}</h1>
          {produto.peso && <p className="mt-1 text-sm text-vinho/60">{produto.peso}</p>}

          <div className="mt-4">
            <PriceTag precoUnitario={produto.precoUnitario} />
          </div>

          <div className="mt-4">
            <AtacadoBlock nomeProduto={produto.nome} />
          </div>

          {produto.variacoes && produto.variacoes.length > 0 && (
            <div className="mt-6 space-y-4">
              {produto.variacoes.map((variacao) => (
                <VariantSelector key={variacao.tipo} variacao={variacao} />
              ))}
            </div>
          )}

          <div className="mt-6">
            {produto.precoUnitario !== null ? (
              <AddToCartButton
                slug={produto.slug}
                categoria={produto.categoria}
                nome={produto.nome}
                precoUnitario={produto.precoUnitario}
              />
            ) : (
              <p className="text-sm text-vinho/60">
                Produto disponível sob consulta — solicite pelo WhatsApp acima.
              </p>
            )}
          </div>

          <p className="mt-8 leading-relaxed text-vinho/90">{produto.descricao}</p>

          {produto.ingredientes && produto.ingredientes.length > 0 && (
            <div className="mt-6">
              <h2 className="font-display text-lg text-vinho">Ingredientes</h2>
              <ul className="mt-2 list-inside list-disc text-vinho/80">
                {produto.ingredientes.map((ingrediente) => (
                  <li key={ingrediente}>{ingrediente}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
