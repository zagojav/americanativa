import Image from "next/image";
import Link from "next/link";
import { Produto } from "@/lib/types";
import { PlaceholderImage } from "./PlaceholderImage";
import { PriceTag } from "./PriceTag";

export function ProductCard({ produto }: { produto: Produto }) {
  return (
    <Link
      href={`/produtos/${produto.categoria}/${produto.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-dourado/30 bg-white transition-shadow hover:shadow-lg"
    >
      {produto.imagens[0] ? (
        <div className="relative aspect-square w-full">
          <Image
            src={produto.imagens[0]}
            alt={produto.nome}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover"
          />
        </div>
      ) : (
        <PlaceholderImage label={produto.nome} className="aspect-square w-full" />
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-lg text-vinho group-hover:text-dourado-dark">
          {produto.nome}
        </h3>
        {produto.peso && <p className="text-xs text-vinho/60">{produto.peso}</p>}
        <div className="mt-auto pt-2">
          <PriceTag precoUnitario={produto.precoUnitario} />
        </div>
      </div>
    </Link>
  );
}
