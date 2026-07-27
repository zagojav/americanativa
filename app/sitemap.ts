import type { MetadataRoute } from "next";
import { getCategorias, getTodosProdutos } from "@/lib/produtos";
import { siteConfig } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paginasEstaticas = [
    "",
    "/quem-somos",
    "/produtos",
    "/distribuicao/horneados-unicos",
    "/franquia",
    "/contato",
  ].map((rota) => ({
    url: `${siteConfig.siteUrl}${rota}`,
    lastModified: new Date(),
  }));

  const paginasCategoria = getCategorias().map((categoria) => ({
    url: `${siteConfig.siteUrl}/produtos/${categoria.slug}`,
    lastModified: new Date(),
  }));

  const produtos = await getTodosProdutos();
  const paginasProduto = produtos.map((produto) => ({
    url: `${siteConfig.siteUrl}/produtos/${produto.categoria}/${produto.slug}`,
    lastModified: new Date(),
  }));

  return [...paginasEstaticas, ...paginasCategoria, ...paginasProduto];
}
