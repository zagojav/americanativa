"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email, senha);
      router.push("/admin");
    } catch (err) {
      const codigo = (err as { code?: string })?.code ?? "";
      if (codigo.includes("api-key")) {
        setErro(
          "Firebase ainda não está configurado neste ambiente (variáveis NEXT_PUBLIC_FIREBASE_* em .env.local)."
        );
      } else {
        setErro("E-mail ou senha inválidos.");
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4 py-16">
      <h1 className="font-display text-3xl text-vinho">Painel Administrativo</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="text-sm font-medium text-vinho" htmlFor="email">
            E-mail
          </label>
          <input
            required
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-dourado/40 px-3 py-2"
            suppressHydrationWarning
          />
        </div>
        <div>
          <label className="text-sm font-medium text-vinho" htmlFor="senha">
            Senha
          </label>
          <input
            required
            type="password"
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="mt-1 w-full rounded-md border border-dourado/40 px-3 py-2"
            suppressHydrationWarning
          />
        </div>

        {erro && <p className="text-sm text-red-700">{erro}</p>}

        <button
          type="submit"
          disabled={carregando}
          className="w-full rounded-md bg-vinho px-6 py-3 font-medium uppercase tracking-wide text-creme transition-colors hover:bg-dourado hover:text-vinho disabled:opacity-60"
        >
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
