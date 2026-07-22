import Link from "next/link";
import { getCategoriasComContagem } from "@/lib/produtos";
import { CategoryCard } from "@/components/CategoryCard";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { siteConfig } from "@/lib/site-config";

export default function Home() {
  const categorias = getCategoriasComContagem();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-vinho">
        <PlaceholderImage
          label="banner institucional"
          className="absolute inset-0 h-full w-full opacity-30"
        />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center text-creme">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-dourado">
            {siteConfig.tagline}
          </p>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl">
            {siteConfig.nomeMarca}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-creme/80">
            {siteConfig.descricaoCurta}
          </p>
          <Link
            href="/produtos"
            className="mt-8 inline-block rounded-md bg-dourado px-8 py-3 font-medium text-vinho transition-colors hover:bg-creme"
          >
            Ver produtos
          </Link>
        </div>
      </section>

      {/* O que importamos */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <h2 className="font-display text-3xl text-vinho">O que importamos</h2>
        <p className="mt-2 max-w-2xl text-vinho/70">
          Da Bolívia direto para o Brasil: uma curadoria de alimentos, bebidas
          e vestuário selecionados na origem.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categorias.map((c) => (
            <CategoryCard
              key={c.slug}
              slug={c.slug}
              label={c.label}
              totalProdutos={c.totalProdutos}
            />
          ))}
        </div>
      </section>

      {/* Institucional curto */}
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 sm:items-center">
          <PlaceholderImage label="importadora América Nativa" className="aspect-[4/3] w-full rounded-lg" />
          <div>
            <h2 className="font-display text-3xl text-vinho">
              Importadora América Nativa
            </h2>
            <p className="mt-4 text-vinho/80">
              Mais do que uma loja, somos uma importadora. Selecionamos a dedo
              desde alimentos típicos até vestuário e itens do dia a dia,
              trazendo direto da origem produtos que carregam história,
              qualidade e identidade.
            </p>
            <Link
              href="/quem-somos"
              className="mt-6 inline-block font-medium text-dourado-dark underline underline-offset-4 hover:text-vinho"
            >
              Conheça a América Nativa
            </Link>
          </div>
        </div>
      </section>

      {/* Franquia */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <div className="flex flex-col items-center gap-6 rounded-lg bg-vinho px-6 py-12 text-center text-creme sm:px-16">
          <h2 className="font-display text-3xl">Seja um franqueado</h2>
          <p className="max-w-2xl text-creme/80">
            Leve os sabores da Bolívia para o seu negócio. A América Nativa
            está expandindo por meio de franquias e pontos de venda — junte-se
            a nós.
          </p>
          <Link
            href="/franquia"
            className="rounded-md bg-dourado px-8 py-3 font-medium text-vinho transition-colors hover:bg-creme"
          >
            Quero ser franqueado
          </Link>
        </div>
      </section>
    </div>
  );
}
