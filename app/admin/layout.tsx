"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [usuario, setUsuario] = useState<User | null | undefined>(undefined);
  const [erroConfiguracao, setErroConfiguracao] = useState(false);
  const naTelaDeLogin = pathname === "/admin/login";

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(getFirebaseAuth(), setUsuario, () =>
        setErroConfiguracao(true)
      );
      return unsubscribe;
    } catch {
      setErroConfiguracao(true);
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
        Firebase ainda não está configurado neste ambiente — preencha as
        variáveis <code>NEXT_PUBLIC_FIREBASE_*</code> em{" "}
        <code>.env.local</code> para usar o painel administrativo.
      </div>
    );
  }

  if (naTelaDeLogin) return <>{children}</>;

  if (!usuario) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-vinho/60">
        Carregando...
      </div>
    );
  }

  return <>{children}</>;
}
