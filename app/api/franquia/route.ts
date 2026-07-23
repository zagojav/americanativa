import { NextRequest, NextResponse } from "next/server";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(request: NextRequest) {
  const dados = await request.json();

  try {
    await addDoc(collection(db, "pedidos_orcamento"), {
      tipo: "franquia",
      nome: dados.nome ?? "",
      email: dados.email ?? "",
      telefone: dados.telefone ?? "",
      cidadeInteresse: dados.cidade ?? "",
      mensagem: dados.mensagem ?? "",
      criadoEm: serverTimestamp(),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[franquia] Erro ao gravar no Firestore:", error);
    return NextResponse.json(
      { error: "Não foi possível enviar seu interesse." },
      { status: 500 }
    );
  }
}
