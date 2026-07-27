import { collection, getDocs, query, where } from "firebase/firestore";
import { unstable_cache } from "next/cache";
import { categorias } from "@/data/categorias";
import produtosJson from "@/data/produtos.json";
import { db } from "@/lib/firebase";
import { Categoria, Produto } from "@/lib/types";

/**
 * Catálogo de fallback: usado quando o Firestore ainda não foi configurado
 * (sem projeto real em .env.local) ou quando a collection "produtos" ainda
 * está vazia (antes de rodar scripts/seed-produtos.mjs). Sem isso, o site
 * inteiro (menu, home, páginas de categoria) aparece vazio até o Firebase
 * estar 100% configurado — o fallback garante que o catálogo continua
 * funcionando normalmente nesse meio-tempo, e para de ser usado assim que a
 * collection "produtos" tiver pelo menos um documento ativo.
 */
const produtosFallback: Produto[] = (produtosJson as Omit<Produto, "ativo" | "ordem">[]).map(
  (produto, indice) => ({ ...produto, ativo: true, ordem: indice })
);

/**
 * Fonte de dados: collection "produtos" no Firestore, gerenciada pelo painel
 * /admin/produtos. Chamado a partir de Server Components (mesmo padrão já
 * usado nas rotas de contato/franquia, que gravam no Firestore no servidor).
 *
 * Cacheado com revalidate curto (unstable_cache) pra não bater no Firestore
 * a cada requisição — uma edição no admin demora até 60s pra aparecer no site.
 */
async function buscarProdutosAtivos(): Promise<Produto[]> {
  try {
    const snapshot = await getDocs(
      query(collection(db, "produtos"), where("ativo", "==", true))
    );
    if (snapshot.empty) return produtosFallback;
    return snapshot.docs
      .map((doc) => doc.data() as Produto)
      .sort((a, b) => a.ordem - b.ordem);
  } catch {
    return produtosFallback;
  }
}

export const getTodosProdutos = unstable_cache(
  buscarProdutosAtivos,
  ["produtos-ativos"],
  { revalidate: 60 }
);

export async function getProdutosPorCategoria(categoriaSlug: string): Promise<Produto[]> {
  const produtos = await getTodosProdutos();
  return produtos.filter((p) => p.categoria === categoriaSlug);
}

export async function getProdutosPorSubcategoria(
  categoriaSlug: string,
  subcategoriaSlug: string
): Promise<Produto[]> {
  const produtos = await getTodosProdutos();
  return produtos.filter(
    (p) => p.categoria === categoriaSlug && p.subcategoria === subcategoriaSlug
  );
}

export async function getProduto(
  categoriaSlug: string,
  slug: string
): Promise<Produto | undefined> {
  const produtos = await getTodosProdutos();
  return produtos.find((p) => p.categoria === categoriaSlug && p.slug === slug);
}

export async function getProdutoPorSlug(slug: string): Promise<Produto | undefined> {
  const produtos = await getTodosProdutos();
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
export async function getCategoriasComContagem() {
  const produtos = await getTodosProdutos();

  return categorias.map((categoria) => {
    const produtosDaCategoria = produtos.filter((p) => p.categoria === categoria.slug);
    const subcategorias = categoria.subcategorias?.map((sub) => ({
      ...sub,
      totalProdutos: produtosDaCategoria.filter((p) => p.subcategoria === sub.slug).length,
    }));

    return {
      ...categoria,
      totalProdutos: produtosDaCategoria.length,
      subcategorias,
    };
  });
}
