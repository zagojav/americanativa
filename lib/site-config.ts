export const siteConfig = {
  nomeMarca: "América Nativa",
  nomeInstitucional: "América Nativa LTDA · by AS Market",
  tagline: "Importação · Exportação · Franquia",
  descricaoCurta:
    "Importadora e distribuidora de produtos da Bolívia para o Brasil: alimentos, bebidas e vestuário selecionados na origem.",
  // TODO: confirmar se este é o número de WhatsApp oficial antes de publicar em produção.
  whatsappNumero: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511985442400",
  email: "americanativa7@gmail.com", // TODO: confirmar e-mail oficial com o cliente
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://americanativa.vercel.app",
  redesSociais: {
    instagram: "https://instagram.com/americanativa", // TODO: confirmar handle real
    facebook: "https://facebook.com/americanativa", // TODO: confirmar handle real
  },
  atacado: {
    // A partir daqui (inclusive) mostramos aviso de condições especiais,
    // sem bloquear a compra — ver lib/cartRules.ts.
    quantidadeAviso: 450,
    // Acima disto (exclusive) o avanço no checkout é bloqueado e o cliente
    // é direcionado para orçamento via WhatsApp.
    quantidadeMinima: 500,
  },
} as const;
