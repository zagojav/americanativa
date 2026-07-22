import { Categoria } from "@/lib/types";

/**
 * Estrutura oficial de categorias confirmada com o cliente.
 *
 * Nota de nomenclatura: o grupo que o cliente chama de "Produtos" usa o slug
 * "alimentos" na URL (em vez de "produtos") para não colidir com a rota
 * /produtos (catálogo geral). O rótulo exibido continua "Produtos".
 * TODO: confirmar com o cliente se esse rótulo deve virar "Alimentos" para
 * evitar ambiguidade com o nome da própria loja.
 */
export const categorias: Categoria[] = [
  {
    slug: "alimentos",
    label: "Produtos",
    subcategorias: [
      { slug: "cunapes-biscoitos", label: "Cuñapés Biscoitos" },
      { slug: "milho", label: "Milho" },
      { slug: "arroz", label: "Arroz" },
      { slug: "doce", label: "Doce" },
    ],
  },
  {
    // Rótulo exibido renomeado de "Carta de Bebidas" para "Bebidas" a pedido do cliente.
    slug: "bebidas",
    label: "Bebidas",
    subcategorias: [
      { slug: "vinhos", label: "Vinhos" },
      { slug: "fermentados", label: "Fermentados" },
      { slug: "cervejas-artesanais", label: "Cervejas Artesanais" },
      { slug: "espumantes", label: "Espumantes" },
    ],
  },
  {
    slug: "vegetais-graos-oleos",
    label: "Vegetais, Grãos e Óleos diversos",
    subcategorias: [
      { slug: "oleos-diversos", label: "Óleos diversos (Vegetais, Industriais, Automotivo)" },
      // Sem produtos cadastrados no momento — deve renderizar como "em breve".
      { slug: "hortifruti", label: "Hortifruti" },
    ],
  },
  {
    slug: "vestuario",
    label: "Vestuário",
    subcategorias: [{ slug: "la-de-alpaca", label: "Lã de Alpaca" }],
  },
  {
    slug: "meis-de-abelhas-nativa",
    label: "Méis de Abelhas Nativa",
  },
  {
    // Distribuição oficial de terceiro — ver /distribuicao/horneados-unicos.
    // Nome e logo dependem de autorização confirmada do cliente antes de produção.
    slug: "horneados-unicos",
    label: "Horneados Únicos",
  },
];
