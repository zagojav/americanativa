import { Categoria } from "@/lib/types";

/**
 * Estrutura oficial de categorias confirmada com o cliente.
 *
 * ⚠️ Compliance: o uso do nome e do logo "Horneados Únicos" depende de
 * autorização confirmada do fornecedor/cliente antes de produção — ver
 * também app/distribuicao/horneados-unicos/page.tsx.
 */
export const categorias: Categoria[] = [
  {
    slug: "horneados-unicos",
    label: "Horneados Únicos",
    imagem: "/images/categorias/horneados-unicos.png",
    subcategorias: [
      { slug: "cunapes-biscoitos", label: "Cuñapés Biscoitos" },
      { slug: "milho", label: "Milho" },
      { slug: "arroz", label: "Arroz" },
      { slug: "doce", label: "Doce" },
      { slug: "recheados", label: "Recheados" },
      { slug: "empanadas", label: "Empanadas" },
    ],
  },
  {
    slug: "bebidas",
    label: "Bebidas",
    imagem: "/images/categorias/bebidas.png",
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
    imagem: "/images/categorias/vegetais-graos-oleos.png",
    subcategorias: [
      { slug: "oleos-diversos", label: "Óleos" },
      { slug: "hortifruti", label: "Hortifruti" },
    ],
  },
  {
    slug: "vestuario",
    label: "Vestuário",
    imagem: "/images/categorias/vestuario.png",
    subcategorias: [
      { slug: "la-de-alparca", label: "Lã de Alparca" },
      { slug: "sobretudo", label: "Sobretudo" },
      { slug: "blusas", label: "Blusas" },
      { slug: "cardiga", label: "Cardigã" },
    ],
  },
  {
    slug: "meis-de-abelhas-nativas",
    label: "Méis de Abelhas Nativas",
    imagem: "/images/categorias/meis-de-abelhas-nativas.png",
  },
  {
    slug: "chas",
    label: "Chás",
    imagem: "/images/categorias/chas.png",
    subcategorias: [{ slug: "cha-mate", label: "Chá Mate" }],
  },
];
