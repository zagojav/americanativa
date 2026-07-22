import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const dados = await request.json();

  // TODO: conectar a um serviço de e-mail (ex: Resend) quando tivermos a chave.
  // TODO: migrar para salvar em Firestore (coleção "leads_franquia") quando o
  // projeto estiver integrado ao Firebase, como os demais produtos do desenvolvedor.
  console.log("[franquia] Novo interesse em franquia recebido:", dados);

  return NextResponse.json({ ok: true });
}
