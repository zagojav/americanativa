import Image from "next/image";
import Link from "next/link";
import { PlaceholderImage } from "./PlaceholderImage";

export function CategoryCard({
  slug,
  label,
  totalProdutos,
  imagem,
}: {
  slug: string;
  label: string;
  totalProdutos: number;
  imagem?: string;
}) {
  const disponivel = totalProdutos > 0;

  const conteudo = (
    <>
      {imagem ? (
        <div className="relative aspect-[4/3] w-full">
          <Image src={imagem} alt={label} fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover" />
        </div>
      ) : (
        <PlaceholderImage label={label} className="aspect-[4/3] w-full" />
      )}
      <div className="flex items-center justify-between p-4">
        <h3 className="font-display text-lg text-vinho">{label}</h3>
        {!disponivel && (
          <span className="text-xs uppercase tracking-wide text-vinho/50">
            Em breve
          </span>
        )}
      </div>
    </>
  );

  if (!disponivel) {
    return (
      <div className="flex cursor-not-allowed flex-col overflow-hidden rounded-lg border border-dourado/20 bg-white opacity-60">
        {conteudo}
      </div>
    );
  }

  return (
    <Link
      href={`/produtos/${slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-dourado/30 bg-white transition-shadow hover:shadow-lg"
    >
      {conteudo}
    </Link>
  );
}
