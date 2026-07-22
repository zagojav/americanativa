import produtosJson from "@/data/produtos.json";
import { categorias } from "@/data/categorias";
import { Categoria, Produto } from "@/lib/types";

/**
 * Fonte de dados atual: arquivo local data/produtos.json.
 * Escolhido para facilitar edição manual enquanto o catálogo não está fechado.
 *
 * Migração futura para Firebase Firestore (o projeto já usa Firebase em
 * outros produtos do mesmo desenvolvedor):
 *
 *   import { collection, getDocs } from "firebase/firestore";
 *   import { db } from "@/lib/firebase";
 *
 *   export async function getProdutos(): Promise<Produto[]> {
 *     const snapshot = await getDocs(collection(db, "produtos"));
 *     return snapshot.docs.map((doc) => doc.data() as Produto);
 *   }
 *
 * As categorias também migrariam para uma coleção `categorias`, substituindo
 * data/categorias.ts. As funções abaixo já isolam o acesso aos dados, então
 * a migração troca apenas a implementação interna, não os call sites.
 */
const produtos = produtosJson as Produto[];

export function getTodosProdutos(): Produto[] {
  return produtos;
}

export function getProdutosPorCategoria(categoriaSlug: string): Produto[] {
  return produtos.filter((p) => p.categoria === categoriaSlug);
}

export function getProdutosPorSubcategoria(
  categoriaSlug: string,
  subcategoriaSlug: string
): Produto[] {
  return produtos.filter(
    (p) => p.categoria === categoriaSlug && p.subcategoria === subcategoriaSlug
  );
}

export function getProduto(
  categoriaSlug: string,
  slug: string
): Produto | undefined {
  return produtos.find((p) => p.categoria === categoriaSlug && p.slug === slug);
}

export function getProdutoPorSlug(slug: string): Produto | undefined {
  return produtos.find((p) => p.slug === slug);
}

export function getCategorias(): Categoria[] {
  return categorias;
}

export function getCategoria(slug: string): Categoria | undefined {
  return categorias.find((c) => c.slug === slug);
}

/**
 * Retorna as categorias com metadado de contagem de produtos, para uso na
 * navegação: categorias/subcategorias sem produtos devem ser ocultadas ou
 * exibidas como "em breve" (nunca como link ativo vazio).
 */
export function getCategoriasComContagem() {
  return categorias.map((categoria) => {
    const produtosDaCategoria = getProdutosPorCategoria(categoria.slug);
    const subcategorias = categoria.subcategorias?.map((sub) => ({
      ...sub,
      totalProdutos: getProdutosPorSubcategoria(categoria.slug, sub.slug).length,
    }));

    return {
      ...categoria,
      totalProdutos: produtosDaCategoria.length,
      subcategorias,
    };
  });
}
