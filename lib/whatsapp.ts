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
