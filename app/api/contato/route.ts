import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const dados = await request.json();

  // TODO: conectar a um serviço de e-mail (ex: Resend) quando tivermos a chave.
  // TODO: migrar para salvar em Firestore (coleção "contatos") quando o projeto
  // estiver integrado ao Firebase, como os demais produtos do desenvolvedor.
  console.log("[contato] Nova mensagem recebida:", dados);

  return NextResponse.json({ ok: true });
}
