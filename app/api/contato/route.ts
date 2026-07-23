import { NextRequest, NextResponse } from "next/server";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contato] Erro ao gravar no Firestore:", error);
    return NextResponse.json(
      { error: "Não foi possível enviar sua mensagem." },
      { status: 500 }
    );
  }
}
