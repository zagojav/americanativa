"use client";

import { useState } from "react";

export function VariantSelector({
  variacao,
}: {
  variacao: { tipo: "cor" | "tamanho"; opcoes: string[] };
}) {
  const [selecionada, setSelecionada] = useState(variacao.opcoes[0]);

  return (
    <div>
      <p className="text-sm font-medium text-vinho">
        {variacao.tipo === "cor" ? "Cor" : "Tamanho"}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {variacao.opcoes.map((opcao) => (
          <button
            key={opcao}
            type="button"
            onClick={() => setSelecionada(opcao)}
            className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
              selecionada === opcao
                ? "border-vinho bg-vinho text-creme"
                : "border-dourado/40 text-vinho hover:bg-creme"
            }`}
          >
            {opcao}
          </button>
        ))}
      </div>
    </div>
  );
}
