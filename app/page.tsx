import Link from "next/link";
import { getCategoriasComContagem } from "@/lib/produtos";
import { CategoryCard } from "@/components/CategoryCard";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { BannerCarousel, type BannerSlide } from "@/components/BannerCarousel";
import { BrandMotif } from "@/components/BrandMotif";

const banners: BannerSlide[] = [
  {
    desktopSrc: "/images/banners/01-quem-somos-desktop.png",
    mobileSrc: "/images/banners/01-quem-somos-mobile.png",
    alt: "América Nativa — o melhor da América do Sul, até você",
    href: "/quem-somos",
  },
  {
    desktopSrc: "/images/banners/02-institucional-desktop.png",
    mobileSrc: "/images/banners/02-institucional-mobile.png",
    alt: "América Nativa LTDA — Importação, Exportação e Franquia",
  },
  {
    desktopSrc: "/images/banners/03-horneados-desktop.png",
    mobileSrc: "/images/banners/03-horneados-mobile.png",
    alt: "Sabores únicos da Bolívia",
    href: "/distribuicao/horneados-unicos",
  },
  {
    desktopSrc: "/images/banners/04-produtos-desktop.png",
    mobileSrc: "/images/banners/04-produtos-mobile.png",
    alt: "Tesouros da Bolívia — vestuário e produtos autênticos",
    href: "/produtos",
  },
  {
    desktopSrc: "/images/banners/05-franquia-desktop.png",
    mobileSrc: "/images/banners/05-franquia-mobile.png",
    alt: "Seja um franqueado América Nativa",
    href: "/franquia",
  },
];

export default function Home() {
  const categorias = getCategoriasComContagem();

  return (
    <div className="flex flex-col">
      <BannerCarousel slides={banners} />

      {/* O que importamos */}
      <section className="relative overflow-hidden">
        <BrandMotif />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-16">
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
