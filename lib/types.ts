export type Produto = {
  slug: string;
  nome: string; // manter nome original em espanhol quando aplicável
  descricao: string; // português
  ingredientes?: string[]; // português, quando aplicável
  categoria: string; // slug da categoria (ver data/categorias.ts)
  subcategoria?: string; // slug da subcategoria
  peso?: string;
  precoUnitario: number | null; // null = "sob consulta"
  imagens: string[];
  variacoes?: { tipo: "cor" | "tamanho"; opcoes: string[] }[];
  ativo: boolean;
  ordem: number;
};

export type Subcategoria = {
  slug: string;
  label: string;
};

export type Categoria = {
  slug: string;
  label: string;
  descricao?: string;
  subcategorias?: Subcategoria[];
};
