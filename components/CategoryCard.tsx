import Link from "next/link";
import { PlaceholderImage } from "./PlaceholderImage";

export function CategoryCard({
  slug,
  label,
  totalProdutos,
}: {
  slug: string;
  label: string;
  totalProdutos: number;
}) {
  const disponivel = totalProdutos > 0;

  const conteudo = (
    <>
      <PlaceholderImage label={label} className="aspect-[4/3] w-full" />
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
