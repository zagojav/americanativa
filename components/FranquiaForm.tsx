"use client";

import { FormEvent, useState } from "react";

export function FranquiaForm() {
  const [status, setStatus] = useState<"idle" | "enviando" | "enviado" | "erro">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("enviando");

    const form = e.currentTarget;
    const dados = Object.fromEntries(new FormData(form).entries());

    try {
      const resposta = await fetch("/api/franquia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      if (!resposta.ok) throw new Error();
      setStatus("enviado");
      form.reset();
    } catch {
      setStatus("erro");
    }
  }

  if (status === "enviado") {
    return (
      <p className="rounded-md border border-dourado/40 bg-white p-4 text-vinho">
        Recebemos seu interesse! Nossa equipe vai entrar em contato em breve.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-vinho" htmlFor="nome">Nome</label>
        <input required id="nome" name="nome" className="mt-1 w-full rounded-md border border-dourado/40 px-3 py-2" />
      </div>
      <div>
        <label className="text-sm font-medium text-vinho" htmlFor="telefone">Telefone</label>
        <input required id="telefone" name="telefone" className="mt-1 w-full rounded-md border border-dourado/40 px-3 py-2" />
      </div>
      <div>
        <label className="text-sm font-medium text-vinho" htmlFor="email">E-mail</label>
        <input required type="email" id="email" name="email" className="mt-1 w-full rounded-md border border-dourado/40 px-3 py-2" />
      </div>
      <div>
        <label className="text-sm font-medium text-vinho" htmlFor="cidade">Cidade de interesse</label>
        <input id="cidade" name="cidade" className="mt-1 w-full rounded-md border border-dourado/40 px-3 py-2" />
      </div>
      <div>
        <label className="text-sm font-medium text-vinho" htmlFor="mensagem">Mensagem</label>
        <textarea id="mensagem" name="mensagem" rows={4} className="mt-1 w-full rounded-md border border-dourado/40 px-3 py-2" />
      </div>

      {status === "erro" && (
        <p className="text-sm text-red-700">Não foi possível enviar. Tente novamente.</p>
      )}

      <button
        type="submit"
        disabled={status === "enviando"}
        className="w-full rounded-md bg-vinho px-6 py-3 font-medium uppercase tracking-wide text-creme transition-colors hover:bg-dourado hover:text-vinho disabled:opacity-60"
      >
        {status === "enviando" ? "Enviando..." : "Quero ser franqueado"}
      </button>
    </form>
  );
}
