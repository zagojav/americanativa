import { NextRequest, NextResponse } from "next/server";
import { preferenceClient } from "@/lib/mercadopago";
import { siteConfig } from "@/lib/site-config";

type ItemCarrinho = {
  slug: string;
  nome: string;
  precoUnitario: number;
  quantidade: number;
};

export async function POST(request: NextRequest) {
  const { itens } = (await request.json()) as { itens: ItemCarrinho[] };

  if (!itens || itens.length === 0) {
    return NextResponse.json({ error: "Carrinho vazio." }, { status: 400 });
  }

  try {
    const preferencia = await preferenceClient.create({
      body: {
        items: itens.map((item) => ({
          id: item.slug,
          title: item.nome,
          quantity: item.quantidade,
          unit_price: item.precoUnitario,
          currency_id: "BRL",
        })),
        back_urls: {
          success: `${siteConfig.siteUrl}/carrinho?status=sucesso`,
          failure: `${siteConfig.siteUrl}/carrinho?status=falha`,
          pending: `${siteConfig.siteUrl}/carrinho?status=pendente`,
        },
        auto_return: "approved",
        // TODO: configurar notification_url para receber webhooks do Mercado Pago
        // quando o domínio de produção estiver definido.
      },
    });

    return NextResponse.json({ initPoint: preferencia.init_point });
  } catch (error) {
    console.error("[checkout] Erro ao criar preferência do Mercado Pago:", error);
    return NextResponse.json(
      { error: "Não foi possível iniciar o checkout." },
      { status: 500 }
    );
  }
}
