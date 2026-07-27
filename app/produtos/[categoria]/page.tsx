import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCategoria,
  getCategorias,
  getProdutosPorCategoria,
  getProdutosPorSubcategoria,
} from "@/lib/produtos";
import { ProductCard } from "@/components/ProductCard";

export async function generateStaticParams() {
  return getCategorias().map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string }>;
}): Promise<Metadata> {
  const { categoria: categoriaSlug } = await params;
  const categoria = getCategoria(categoriaSlug);
  if (!categoria) return {};
  return {
    title: categoria.label,
    description: `Produtos da categoria ${categoria.label}, América Nativa.`,
  };
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria: categoriaSlug } = await params;
  const categoria = getCategoria(categoriaSlug);
  if (!categoria) notFound();

  const produtos = await getProdutosPorCategoria(categoriaSlug);

  const subcategoriasComContagem = categoria.subcategorias
    ? await Promise.all(
        categoria.subcategorias.map(async (sub) => ({
          ...sub,
          total: (await getProdutosPorSubcategoria(categoriaSlug, sub.slug)).length,
        }))
      )
    : undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="font-display text-4xl text-vinho">{categoria.label}</h1>

      {subcategoriasComContagem && subcategoriasComContagem.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {subcategoriasComContagem.map((sub) => {
            if (sub.total === 0) {
              return (
                <span
                  key={sub.slug}
                  className="cursor-not-allowed rounded-full border border-dourado/20 px-4 py-1.5 text-sm text-vinho/40"
                >
                  {sub.label} (em breve)
                </span>
              );
            }
            return (
              <a
                key={sub.slug}
                href={`#${sub.slug}`}
                className="rounded-full border border-dourado/40 px-4 py-1.5 text-sm text-vinho hover:bg-vinho hover:text-creme"
              >
                {sub.label}
              </a>
            );
          })}
        </div>
      )}

      {produtos.length === 0 ? (
        <p className="mt-10 text-vinho/60">
          Nenhum produto cadastrado nesta categoria no momento.
        </p>
      ) : subcategoriasComContagem && subcategoriasComContagem.length > 0 ? (
        <div className="mt-10 space-y-12">
          {await Promise.all(subcategoriasComContagem.map(async (sub) => {
            const produtosSub = await getProdutosPorSubcategoria(categoriaSlug, sub.slug);
            if (produtosSub.length === 0) return null;
            return (
              <section key={sub.slug} id={sub.slug}>
                <h2 className="font-display text-xl text-vinho">{sub.label}</h2>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {produtosSub.map((produto) => (
                    <ProductCard key={produto.slug} produto={produto} />
                  ))}
                </div>
              </section>
            );
          }))}
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {produtos.map((produto) => (
            <ProductCard key={produto.slug} produto={produto} />
          ))}
        </div>
      )}
    </div>
  );
}
