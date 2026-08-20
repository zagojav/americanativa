import { NextRequest, NextResponse } from "next/server";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { WebhookSignatureValidator } from "mercadopago";
import { db } from "@/lib/firebase";
import { paymentClient } from "@/lib/mercadopago";

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const body = await request.json().catch(() => null);
  const dataId = url.searchParams.get("data.id") ?? body?.data?.id;

  if (!dataId) {
    return NextResponse.json({ ok: true });
  }

  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (secret) {
    try {
      WebhookSignatureValidator.validate({
        xSignature: request.headers.get("x-signature"),
        xRequestId: request.headers.get("x-request-id"),
        dataId,
        secret,
      });
    } catch (error) {
      console.error("[pagamentos/webhook] Assinatura inválida:", error);
      return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 });
    }
  } else {
    // Sem MERCADOPAGO_WEBHOOK_SECRET configurado (ex: ainda em desenvolvimento
    // local), aceitamos sem validar assinatura — mas isso nunca deve
    // acontecer em produção, daí o aviso alto.
    console.warn(
      "[pagamentos/webhook] MERCADOPAGO_WEBHOOK_SECRET não configurado. Notificação aceita sem validar assinatura."
    );
  }

  try {
    const pagamento = await paymentClient.get({ id: String(dataId) });

    if (pagamento.status === "approved") {
      const pedido = JSON.parse((pagamento.metadata?.pedido as string) ?? "{}");

      await addDoc(collection(db, "pedidos"), {
        mercadoPagoPaymentId: pagamento.id,
        status: pagamento.status,
        valor: pagamento.transaction_amount,
        metodoPagamento: pagamento.payment_method_id,
        itens: pedido.itens ?? [],
        dadosPessoais: pedido.dadosPessoais ?? null,
        endereco: pedido.endereco ?? null,
        criadoEm: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error("[pagamentos/webhook] Erro ao processar notificação:", error);
  }

  // Sempre 200: o Mercado Pago reenvia notificações que não recebem esse
  // status, e um erro nosso já foi logado acima — não faz sentido gerar
  // retentativas em cima disso.
  return NextResponse.json({ ok: true });
}
