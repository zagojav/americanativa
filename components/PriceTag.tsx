export function formatarPreco(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function PriceTag({ precoUnitario }: { precoUnitario: number | null }) {
  if (precoUnitario === null) {
    return (
      <p className="font-display text-2xl text-vinho">Sob consulta</p>
    );
  }
  return (
    <p className="font-display text-2xl text-vinho">
      {formatarPreco(precoUnitario)}
    </p>
  );
}
