"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { onIdTokenChanged, signOut, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { escreverCookieSessao, limparCookieSessao } from "@/lib/adminSession";

// Único e-mail autorizado a usar o painel admin (o Firebase Auth do projeto
// só deve ter esse usuário criado no console, mas checamos aqui também por
// segurança extra caso outro usuário seja criado por engano).
const EMAIL_ADMIN_AUTORIZADO = "guilherme.rezendezago@gmail.com";

const linksAdmin = [
  { href: "/admin", label: "Pedidos" },
  { href: "/admin/produtos", label: "Produtos" },
  { href: "/admin/leads", label: "Leads" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [usuario, setUsuario] = useState<User | null | undefined>(undefined);
  const [erroConfiguracao, setErroConfiguracao] = useState(false);
  const [naoAutorizado, setNaoAutorizado] = useState(false);
  const naTelaDeLogin = pathname === "/admin/login";

  useEffect(() => {
    try {
      // onIdTokenChanged (não só onAuthStateChanged) dispara também quando o
      // Firebase renova o ID token sozinho (a cada ~1h) — sem isso, o cookie
      // que o proxy.ts lê ficaria com um token expirado depois de um tempo.
      const unsubscribe = onIdTokenChanged(
        getFirebaseAuth(),
        async (user) => {
          if (user && user.email !== EMAIL_ADMIN_AUTORIZADO) {
            setNaoAutorizado(true);
            limparCookieSessao();
            await signOut(getFirebaseAuth());
            setUsuario(null);
            return;
          }
          if (user) {
            escreverCookieSessao(await user.getIdToken());
          } else {
            limparCookieSessao();
          }
          setUsuario(user);
        },
        () => setErroConfiguracao(true)
      );
      return unsubscribe;
    } catch {
      // setState fora do corpo síncrono do efeito, evitando o warning de
      // cascading renders (getFirebaseAuth() pode lançar de forma síncrona
      // se a API key do Firebase estiver ausente/inválida).
      queueMicrotask(() => setErroConfiguracao(true));
    }
  }, []);

  useEffect(() => {
    if (usuario === undefined || erroConfiguracao) return;
    if (!usuario && !naTelaDeLogin) router.replace("/admin/login");
    if (usuario && naTelaDeLogin) router.replace("/admin");
  }, [usuario, naTelaDeLogin, erroConfiguracao, router]);

  if (erroConfiguracao) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center text-vinho/70">
        Firebase ainda não está configurado neste ambiente. Preencha as
        variáveis <code>NEXT_PUBLIC_FIREBASE_*</code> em{" "}
        <code>.env.local</code> para usar o painel administrativo.
      </div>
    );
  }

  if (naTelaDeLogin) {
    return (
      <>
        {naoAutorizado && (
          <p className="mx-auto mt-8 max-w-sm text-center text-sm text-red-700">
            Essa conta não está autorizada a acessar o painel administrativo.
          </p>
        )}
        {children}
      </>
    );
  }

  if (!usuario) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-vinho/60">
        Carregando...
      </div>
    );
  }

  async function handleLogout() {
    limparCookieSessao();
    await signOut(getFirebaseAuth());
    router.push("/admin/login");
  }

  return (
    <div>
      <nav className="flex items-center justify-between border-b border-dourado/30 px-4 py-3">
        <div className="flex gap-4">
          {linksAdmin.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium ${
                pathname === link.href ? "text-vinho" : "text-vinho/60 hover:text-vinho"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <button
          onClick={handleLogout}
          className="rounded-md border border-vinho px-4 py-2 text-sm text-vinho hover:bg-vinho hover:text-creme"
        >
          Sair
        </button>
      </nav>
      {children}
    </div>
  );
}
