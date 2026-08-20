import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// E-mails autorizados a usar o painel admin (mesma lista de
// app/admin/layout.tsx — mantidos em sincronia manualmente, já que um
// arquivo roda no servidor e o outro no cliente).
const EMAILS_ADMIN_AUTORIZADOS = ["guilherme.rezendezago@gmail.com", "americanativa7@gmail.com"];

/**
 * Barreira de servidor pra /admin/*: sem isso, qualquer um que digite a URL
 * via acesso direto (sem passar pelo JS do cliente) chega a ver a casca da
 * página antes do guard React rodar. Aqui a gente barra antes disso.
 *
 * O cookie "admin_session" guarda o ID token atual do Firebase Auth
 * (escrito por app/admin/login/page.tsx e mantido fresco por
 * app/admin/layout.tsx via onIdTokenChanged). Validamos ele de verdade
 * contra a API do Firebase a cada requisição — um valor forjado, expirado
 * ou de outra conta é rejeitado, então isso não é só cosmético.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get("admin_session")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    // Firebase não configurado neste ambiente: deixa o guard client-side
    // mostrar a mensagem de "não configurado" em vez de travar tudo aqui.
    return NextResponse.next();
  }

  try {
    const resposta = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      }
    );

    if (!resposta.ok) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const dados = await resposta.json();
    const email: string | undefined = dados.users?.[0]?.email;
    if (!email || !EMAILS_ADMIN_AUTORIZADOS.includes(email)) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
