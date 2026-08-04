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
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, getFirebaseAuth } from "@/lib/firebase";
import { mensagemErroAuth } from "@/lib/authErrors";
import { PasswordInput } from "@/components/PasswordInput";

/** Formata dígitos de telefone brasileiro como "XX XXXXX-XXXX" (celular,
 * 11 dígitos) ou "XX XXXX-XXXX" (fixo, 10 dígitos) enquanto o usuário digita. */
function formatarTelefone(valor: string): string {
  const digitos = valor.replace(/\D/g, "").slice(0, 11);
  const ddd = digitos.slice(0, 2);
  const resto = digitos.slice(2);
  if (resto.length <= 4) return [ddd, resto].filter(Boolean).join(" ");
  const separador = resto.length > 8 ? 5 : 4;
  const primeiraParte = resto.slice(0, separador);
  const segundaParte = resto.slice(separador);
  return `${ddd} ${primeiraParte}${segundaParte ? `-${segundaParte}` : ""}`;
}

function telefoneValido(valor: string): boolean {
  const digitos = valor.replace(/\D/g, "");
  return digitos.length === 10 || digitos.length === 11;
}

export default function EntrarPage() {
  const [usuario, setUsuario] = useState<User | null | undefined>(undefined);
  const [modo, setModo] = useState<"entrar" | "criar-conta">("entrar");
  const [etapa, setEtapa] = useState<"formulario" | "confirmar-telefone">("formulario");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const senhasDivergem =
    modo === "criar-conta" && confirmarSenha.length > 0 && senha !== confirmarSenha;

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

    if (modo === "criar-conta") {
      if (senhasDivergem) return;
      if (!telefoneValido(telefone)) {
        setErro("Informe um telefone válido com DDD.");
        return;
      }
      setEtapa("confirmar-telefone");
      return;
    }

    setCarregando(true);
    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email, senha);
    } catch (err) {
      const codigo = (err as { code?: string })?.code ?? "";
      setErro(mensagemErroAuth(codigo) ?? "");
    } finally {
      setCarregando(false);
    }
  }

  async function handleConfirmarCriarConta() {
    setErro("");
    setCarregando(true);
    try {
      const credencial = await createUserWithEmailAndPassword(getFirebaseAuth(), email, senha);
      await setDoc(doc(db, "usuarios", credencial.user.uid), {
        email,
        telefone: formatarTelefone(telefone),
        criadoEm: serverTimestamp(),
      });
    } catch (err) {
      const codigo = (err as { code?: string })?.code ?? "";
      setErro(mensagemErroAuth(codigo) ?? "Erro ao processar, tenta de novo.");
      setEtapa("formulario");
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
    } catch (err) {
      const codigo = (err as { code?: string })?.code ?? "";
      const mensagem = mensagemErroAuth(codigo);
      if (mensagem) setErro(mensagem);
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
          <PasswordInput
            required
            id="senha"
            minLength={6}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="mt-1 w-full rounded-md border border-dourado/40 px-3 py-2"
          />
        </div>

        {modo === "criar-conta" && (
          <div>
            <label className="text-sm font-medium text-vinho" htmlFor="confirmar-senha">
              Confirmar senha
            </label>
            <PasswordInput
              required
              id="confirmar-senha"
              minLength={6}
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className="mt-1 w-full rounded-md border border-dourado/40 px-3 py-2"
            />
            {senhasDivergem && (
              <p className="mt-1 text-sm text-red-700">As senhas não coincidem.</p>
            )}
          </div>
        )}

        {modo === "criar-conta" && (
          <div>
            <label className="text-sm font-medium text-vinho" htmlFor="telefone">
              Telefone
            </label>
            <input
              required
              type="tel"
              id="telefone"
              placeholder="XX XXXXX-XXXX"
              value={telefone}
              onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
              className="mt-1 w-full rounded-md border border-dourado/40 px-3 py-2"
            />
          </div>
        )}

        {erro && <p className="text-sm text-red-700">{erro}</p>}

        <button
          type="submit"
          disabled={carregando || senhasDivergem}
          className="w-full rounded-md bg-vinho px-6 py-3 font-medium uppercase tracking-wide text-creme transition-colors hover:bg-dourado hover:text-vinho disabled:opacity-60"
        >
          {carregando ? "Enviando..." : modo === "criar-conta" ? "Criar conta" : "Entrar"}
        </button>
      </form>

      <button
        onClick={() => {
          setErro("");
          setEtapa("formulario");
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

      {etapa === "confirmar-telefone" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-vinho/40 px-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-xl">
            <p className="text-vinho/80">O telefone</p>
            <p className="mt-2 font-display text-2xl text-vinho">{telefone}</p>
            <p className="mt-2 text-vinho/80">está correto?</p>

            {erro && <p className="mt-4 text-sm text-red-700">{erro}</p>}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setEtapa("formulario")}
                disabled={carregando}
                className="flex-1 rounded-md border border-vinho px-4 py-3 text-sm font-medium text-vinho hover:bg-creme disabled:opacity-60"
              >
                Alterar
              </button>
              <button
                type="button"
                onClick={handleConfirmarCriarConta}
                disabled={carregando}
                className="flex-1 rounded-md bg-vinho px-4 py-3 text-sm font-medium text-creme hover:bg-dourado hover:text-vinho disabled:opacity-60"
              >
                {carregando ? "Confirmando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
