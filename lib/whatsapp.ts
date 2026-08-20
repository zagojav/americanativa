import { siteConfig } from "./site-config";

export function linkWhatsapp(mensagem: string): string {
  return `https://wa.me/${siteConfig.whatsappNumero}?text=${encodeURIComponent(mensagem)}`;
}

export function linkWhatsappAtacado(nomeProduto: string): string {
  return linkWhatsapp(
    `Olá! Quero um orçamento de atacado (${siteConfig.atacado.quantidadeMinima}+ unidades). Produto: ${nomeProduto}`
  );
}

export function linkWhatsappGeral(): string {
  return linkWhatsapp("Olá! Gostaria de mais informações sobre os produtos da América Nativa.");
}

function listarItens(itens: { nome: string; quantidade: number }[]): string {
  return itens.map((i) => `${i.nome} (${i.quantidade} un.)`).join(", ");
}

export function linkWhatsappOrcamentoGrande(itens: { nome: string; quantidade: number }[]): string {
  return linkWhatsapp(
    `Olá! Quero um orçamento para este pedido, acima do limite de compra direta: ${listarItens(itens)}.`
  );
}

export function linkWhatsappNegociarQuantidade(itens: { nome: string; quantidade: number }[]): string {
  return linkWhatsapp(
    `Olá! Tenho um pedido que pode ter condições especiais e quero negociar: ${listarItens(itens)}.`
  );
}
