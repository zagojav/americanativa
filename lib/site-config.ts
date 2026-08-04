export const siteConfig = {
  nomeMarca: "América Nativa",
  nomeInstitucional: "América Nativa LTDA · by AS Market",
  tagline: "Importação · Exportação · Franquia",
  descricaoCurta:
    "Importadora e distribuidora de produtos da Bolívia para o Brasil: alimentos, bebidas e vestuário selecionados na origem.",
  // TODO: confirmar se este é o número de WhatsApp oficial antes de publicar em produção.
  whatsappNumero: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511985442400",
  email: "contato@americanativa.com.br", // TODO: confirmar e-mail oficial com o cliente
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://americanativa.vercel.app",
  redesSociais: {
    instagram: "https://instagram.com/americanativa", // TODO: confirmar handle real
    facebook: "https://facebook.com/americanativa", // TODO: confirmar handle real
  },
  atacado: {
    quantidadeMinima: 500,
  },
} as const;
