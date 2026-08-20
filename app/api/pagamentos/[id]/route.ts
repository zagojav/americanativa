import { NextRequest, NextResponse } from "next/server";
import { paymentClient } from "@/lib/mercadopago";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const pagamento = await paymentClient.get({ id });
    return NextResponse.json({
      status: pagamento.status,
      statusDetail: pagamento.status_detail,
    });
  } catch (error) {
    console.error("[pagamentos] Erro ao consultar pagamento no Mercado Pago:", error);
    return NextResponse.json(
      { error: "Não foi possível consultar o pagamento." },
      { status: 500 }
    );
  }
}
