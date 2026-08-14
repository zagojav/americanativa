import { NextRequest, NextResponse } from "next/server";
import { preferenceClient } from "@/lib/mercadopago";
import { siteConfig } from "@/lib/site-config";

type ItemCarrinho = {
  slug: string;
  nome: string;
  precoUnitario: number;
  quantidade: number;
};

type DadosPessoais = {
  nome: string;
  email: string;
  telefone: string;
};

type Endereco = {
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
};

export async function POST(request: NextRequest) {
  const { itens, dadosPessoais, endereco, metodoPagamento } = (await request.json()) as {
    itens: ItemCarrinho[];
    dadosPessoais?: DadosPessoais;
    endereco?: Endereco;
    metodoPagamento?: string;
  };

  if (!itens || itens.length === 0) {
    return NextResponse.json({ error: "Carrinho vazio." }, { status: 400 });
  }

  // Reforço do bloqueio de quantidade também no servidor: uma checagem só no
  // cliente é contornável chamando esta rota direto.
  const itemAcimaDoLimite = itens.find(
    (item) => item.quantidade > siteConfig.atacado.quantidadeMinima
  );
  if (itemAcimaDoLimite) {
    return NextResponse.json(
      {
        error: `Pedidos com mais de ${siteConfig.atacado.quantidadeMinima} unidades do mesmo produto precisam de orçamento pelo WhatsApp.`,
      },
      { status: 400 }
    );
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
        ...(dadosPessoais
          ? {
              payer: {
                name: dadosPessoais.nome,
                email: dadosPessoais.email,
                phone: { number: dadosPessoais.telefone },
              },
            }
          : {}),
        ...(endereco
          ? {
              shipments: {
                receiver_address: {
                  zip_code: endereco.cep,
                  street_name: [endereco.rua, endereco.bairro].filter(Boolean).join(", "),
                  street_number: endereco.numero,
                  floor: endereco.complemento,
                  city_name: endereco.cidade,
                  state_name: endereco.estado,
                },
              },
            }
          : {}),
        ...(metodoPagamento ? { metadata: { metodoPagamento } } : {}),
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
