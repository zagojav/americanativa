"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

export default function EntrarPage() {
  const [usuario, setUsuario] = useState<User | null | undefined>(undefined);
  const [modo, setModo] = useState<"entrar" | "criar-conta">("entrar");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    try {
      return onAuthStateChanged(getFirebaseAuth(), setUsuario, () => setUsuario(null));
    } catch {
      queueMicrotask(() => setUsuario(null));
    }
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      if (modo === "criar-conta") {
        await createUserWithEmailAndPassword(getFirebaseAuth(), email, senha);
      } else {
        await signInWithEmailAndPassword(getFirebaseAuth(), email, senha);
      }
    } catch {
      setErro(
        modo === "criar-conta"
          ? "Não foi possível criar a conta. Confira o e-mail e a senha (mínimo 6 caracteres)."
          : "E-mail ou senha inválidos."
      );
    } finally {
      setCarregando(false);
    }
  }

  async function handleLogout() {
    await signOut(getFirebaseAuth());
  }

  async function handleGoogleLogin() {
    setErro("");
    setCarregando(true);
    try {
      await signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider());
    } catch {
      setErro("Não foi possível entrar com o Google.");
    } finally {
      setCarregando(false);
    }
  }

  if (usuario) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4 py-16 text-center">
        <h1 className="font-display text-3xl text-vinho">Minha conta</h1>
        <p className="mt-4 text-vinho/80">Você está conectado como {usuario.email}.</p>
        <button
          onClick={handleLogout}
          className="mt-8 rounded-md border border-vinho px-6 py-3 text-sm font-medium text-vinho hover:bg-vinho hover:text-creme"
        >
          Sair
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4 py-16">
      <h1 className="font-display text-3xl text-vinho">
        {modo === "criar-conta" ? "Criar conta" : "Entrar"}
      </h1>

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
            minLength={6}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="mt-1 w-full rounded-md border border-dourado/40 px-3 py-2"
          />
        </div>

        {erro && <p className="text-sm text-red-700">{erro}</p>}

        <button
          type="submit"
          disabled={carregando}
          className="w-full rounded-md bg-vinho px-6 py-3 font-medium uppercase tracking-wide text-creme transition-colors hover:bg-dourado hover:text-vinho disabled:opacity-60"
        >
          {carregando ? "Enviando..." : modo === "criar-conta" ? "Criar conta" : "Entrar"}
        </button>
      </form>

      <button
        onClick={() => {
          setErro("");
          setModo(modo === "criar-conta" ? "entrar" : "criar-conta");
        }}
        className="mt-6 text-sm text-dourado-dark underline underline-offset-4 hover:text-vinho"
      >
        {modo === "criar-conta" ? "Já tenho conta, entrar" : "Não tenho conta, criar uma"}
      </button>

      <div className="mt-6 flex items-center gap-3 text-xs uppercase tracking-wide text-vinho/40">
        <div className="h-px flex-1 bg-dourado/30" />
        ou
        <div className="h-px flex-1 bg-dourado/30" />
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={carregando}
        className="mt-6 w-full rounded-md border border-dourado/40 px-6 py-3 text-sm font-medium text-vinho transition-colors hover:bg-creme disabled:opacity-60"
      >
        Entrar com Google
      </button>
    </div>
  );
}
