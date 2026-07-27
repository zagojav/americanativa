import { NextRequest, NextResponse } from "next/server";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { enviarNotificacaoPorEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const dados = await request.json();

  try {
    await addDoc(collection(db, "pedidos_orcamento"), {
      tipo: "contato",
      nome: dados.nome ?? "",
      email: dados.email ?? "",
      telefone: dados.telefone ?? "",
      mensagem: dados.mensagem ?? "",
      criadoEm: serverTimestamp(),
    });

    // Aviso por e-mail é só um extra: se o Gmail não estiver configurado ou
    // o envio falhar, o pedido já está salvo no Firestore de qualquer jeito.
    enviarNotificacaoPorEmail("Nova mensagem de contato, América Nativa", {
      Nome: dados.nome ?? "",
      "E-mail": dados.email ?? "",
      Telefone: dados.telefone ?? "",
      Mensagem: dados.mensagem ?? "",
    }).catch((error) => console.error("[contato] Erro ao enviar e-mail:", error));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contato] Erro ao gravar no Firestore:", error);
    return NextResponse.json(
      { error: "Não foi possível enviar sua mensagem." },
      { status: 500 }
    );
  }
}
