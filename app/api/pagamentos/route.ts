import { NextRequest, NextResponse } from "next/server";
import { paymentClient } from "@/lib/mercadopago";
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
  const { formData, itens, dadosPessoais, endereco } = (await request.json()) as {
    formData: Record<string, unknown>;
    itens: ItemCarrinho[];
    dadosPessoais?: DadosPessoais;
    endereco?: Endereco;
  };

  if (!itens || itens.length === 0) {
    return NextResponse.json({ error: "Carrinho vazio." }, { status: 400 });
  }

  // Mesmo reforço de bloqueio de quantidade que app/api/checkout/route.ts —
  // o Payment Brick não sabe dessa regra, então o servidor tem que aplicá-la.
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
    const pagamento = await paymentClient.create({
      body: {
        ...formData,
        notification_url: `${siteConfig.siteUrl}/api/pagamentos/webhook`,
        // O campo metadata do Mercado Pago só garante round-trip confiável
        // pra valores escalares — indo tudo como uma única string JSON, o
        // webhook consegue reconstruir os dados do pedido independente de
        // como a API trata objetos/arrays aninhados aqui.
        metadata: { pedido: JSON.stringify({ itens, dadosPessoais, endereco }) },
      },
    });

    return NextResponse.json({
      id: pagamento.id,
      status: pagamento.status,
      statusDetail: pagamento.status_detail,
      paymentMethodId: pagamento.payment_method_id,
      qrCode: pagamento.point_of_interaction?.transaction_data?.qr_code,
      qrCodeBase64: pagamento.point_of_interaction?.transaction_data?.qr_code_base64,
    });
  } catch (error) {
    console.error("[pagamentos] Erro ao criar pagamento no Mercado Pago:", error);
    return NextResponse.json(
      { error: "Não foi possível processar o pagamento." },
      { status: 500 }
    );
  }
}
