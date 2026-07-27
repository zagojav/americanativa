"use client";

import Image from "next/image";
import { useState } from "react";

export function ProdutoGaleriaComCor({
  nome,
  imagens,
  cores,
}: {
  nome: string;
  imagens: string[];
  cores: string[];
}) {
  const [indice, setIndice] = useState(0);

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-lg">
        <Image
          src={imagens[indice]}
          alt={`${nome} - ${cores[indice]}`}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-vinho">Cor</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {cores.map((cor, i) => (
            <button
              key={cor}
              type="button"
              onClick={() => setIndice(i)}
              className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                i === indice
                  ? "border-vinho bg-vinho text-creme"
                  : "border-dourado/40 text-vinho hover:bg-creme"
              }`}
            >
              {cor}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
