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
    subcategorias: [
      { slug: "cunapes-biscoitos", label: "Cuñapés Biscoitos" },
      { slug: "milho", label: "Milho" },
      { slug: "arroz", label: "Arroz" },
      { slug: "doce", label: "Doce" },
    ],
  },
  {
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
      { slug: "oleos-diversos", label: "Óleos" },
      { slug: "hortifruti", label: "Hortifruti" },
    ],
  },
  {
    slug: "vestuario",
    label: "Vestuário",
  },
  {
    slug: "meis-de-abelhas-nativas",
    label: "Méis de Abelhas Nativas",
  },
];
