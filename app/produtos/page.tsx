import type { Metadata } from "next";
import Link from "next/link";
import { getCategoriasComContagem, getProdutosPorCategoria } from "@/lib/produtos";
import { ProductCard } from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Produtos",
  description: "Catálogo completo de produtos importados da Bolívia: alimentos, bebidas, vestuário e mais.",
};

export default async function ProdutosPage() {
  const todasCategorias = await getCategoriasComContagem();
  const categorias = todasCategorias.filter((c) => c.totalProdutos > 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="font-display text-4xl text-vinho">Produtos</h1>
      <p className="mt-2 max-w-2xl text-vinho/70">
        Nosso catálogo completo, direto da Bolívia para o Brasil.
      </p>

      <div className="mt-10 space-y-16">
        {await Promise.all(categorias.map(async (categoria) => {
          const produtos = await getProdutosPorCategoria(categoria.slug);
          return (
            <section key={categoria.slug}>
              <div className="flex items-baseline justify-between">
                <h2 className="font-display text-2xl text-vinho">{categoria.label}</h2>
                <Link
                  href={`/produtos/${categoria.slug}`}
                  className="text-sm font-medium text-dourado-dark hover:text-vinho"
                >
                  Ver todos
                </Link>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {produtos.slice(0, 4).map((produto) => (
                  <ProductCard key={produto.slug} produto={produto} />
                ))}
              </div>
            </section>
          );
        }))}
      </div>
    </div>
  );
}
