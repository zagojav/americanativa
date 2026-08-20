import { siteConfig } from "./site-config";
import type { CartItem } from "./cartStore";

export function itensBloqueados(itens: CartItem[]): CartItem[] {
  return itens.filter((i) => i.quantidade > siteConfig.atacado.quantidadeMinima);
}

export function itensEmAviso(itens: CartItem[]): CartItem[] {
  return itens.filter(
    (i) =>
      i.quantidade >= siteConfig.atacado.quantidadeAviso &&
      i.quantidade <= siteConfig.atacado.quantidadeMinima
  );
}
