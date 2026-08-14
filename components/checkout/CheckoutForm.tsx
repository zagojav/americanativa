"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useCart } from "@/components/CartContext";
import type { CartItem } from "@/lib/cartStore";
import { formatarPreco } from "@/components/PriceTag";
import { PaymentBrickStep } from "@/components/checkout/PaymentBrickStep";

type DadosPessoais = {
  nome: string;
  email: string;
  telefone: string;
};

type Endereco = {
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
};

const DADOS_PESSOAIS_VAZIO: DadosPessoais = { nome: "", email: "", telefone: "" };
const ENDERECO_VAZIO: Endereco = {
  cep: "",
  rua: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
};

const ETAPAS = ["Dados pessoais", "Endereço de entrega", "Aceite dos termos", "Método de pagamento"] as const;

const campoClasse = "mt-1 w-full rounded-md border border-dourado/40 px-3 py-2";
const labelClasse = "text-sm font-medium text-vinho";

export function CheckoutForm({ itens, totalPreco }: { itens: CartItem[]; totalPreco: number }) {
  const { limparCarrinho } = useCart();
  const [etapa, setEtapa] = useState(1);
  const [dadosPessoais, setDadosPessoais] = useState<DadosPessoais>(DADOS_PESSOAIS_VAZIO);
  const [endereco, setEndereco] = useState<Endereco>(ENDERECO_VAZIO);
  const [aceiteTermos, setAceiteTermos] = useState(false);
  const [modoPagamento, setModoPagamento] = useState<"brick" | "boleto" | "">("");
  const [enviandoBoleto, setEnviandoBoleto] = useState(false);
  const [erroBoleto, setErroBoleto] = useState<string | null>(null);
  const [pagamentoAprovado, setPagamentoAprovado] = useState(false);

  function avancar(e: FormEvent) {
    e.preventDefault();
    setEtapa((atual) => Math.min(atual + 1, ETAPAS.length));
  }

  function voltar() {
    setEtapa((atual) => Math.max(atual - 1, 1));
  }

  async function finalizarBoleto() {
    setErroBoleto(null);
    setEnviandoBoleto(true);
    try {
      const resposta = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itens, dadosPessoais, endereco, metodoPagamento: "boleto" }),
      });

      if (!resposta.ok) throw new Error("Falha ao iniciar o checkout.");

      const { initPoint } = await resposta.json();
      window.location.href = initPoint;
    } catch {
      setErroBoleto(
        "Não foi possível iniciar o pagamento. Verifique se as credenciais do Mercado Pago já foram configuradas."
      );
      setEnviandoBoleto(false);
    }
  }

  function handlePagamentoAprovado() {
    limparCarrinho();
    setPagamentoAprovado(true);
  }

  if (pagamentoAprovado) {
    return (
      <div className="mt-6 rounded-md border border-dourado/40 bg-white p-6 text-center">
        <h2 className="font-display text-2xl text-vinho">Pagamento aprovado!</h2>
        <p className="mt-2 text-vinho/80">
          Recebemos sua compra e já estamos preparando tudo. Você receberá novidades
          pelo e-mail informado.
        </p>
        <Link
          href="/produtos"
          className="mt-6 inline-block rounded-md bg-vinho px-6 py-3 font-medium uppercase tracking-wide text-creme transition-colors hover:bg-dourado hover:text-vinho"
        >
          Continuar comprando
        </Link>
      </div>
    );
  }

  return (
    <div>
      <ol className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-vinho/60">
        {ETAPAS.map((titulo, indice) => (
          <li
            key={titulo}
            className={indice + 1 === etapa ? "font-semibold text-vinho" : undefined}
          >
            {indice + 1}. {titulo}
          </li>
        ))}
      </ol>

      {etapa === 1 && (
        <form onSubmit={avancar} className="mt-6 space-y-4">
          <div>
            <label className={labelClasse} htmlFor="nome">Nome completo</label>
            <input
              required
              id="nome"
              value={dadosPessoais.nome}
              onChange={(e) => setDadosPessoais({ ...dadosPessoais, nome: e.target.value })}
              className={campoClasse}
            />
          </div>
          <div>
            <label className={labelClasse} htmlFor="email">E-mail</label>
            <input
              required
              type="email"
              id="email"
              value={dadosPessoais.email}
              onChange={(e) => setDadosPessoais({ ...dadosPessoais, email: e.target.value })}
              className={campoClasse}
            />
          </div>
          <div>
            <label className={labelClasse} htmlFor="telefone">Telefone</label>
            <input
              required
              id="telefone"
              value={dadosPessoais.telefone}
              onChange={(e) => setDadosPessoais({ ...dadosPessoais, telefone: e.target.value })}
              className={campoClasse}
            />
          </div>
          <button type="submit" className="w-full rounded-md bg-vinho px-6 py-3 font-medium uppercase tracking-wide text-creme transition-colors hover:bg-dourado hover:text-vinho">
            Continuar
          </button>
        </form>
      )}

      {etapa === 2 && (
        <form onSubmit={avancar} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasse} htmlFor="cep">CEP</label>
              <input
                required
                id="cep"
                value={endereco.cep}
                onChange={(e) => setEndereco({ ...endereco, cep: e.target.value })}
                className={campoClasse}
              />
            </div>
            <div>
              <label className={labelClasse} htmlFor="numero">Número</label>
              <input
                required
                id="numero"
                value={endereco.numero}
                onChange={(e) => setEndereco({ ...endereco, numero: e.target.value })}
                className={campoClasse}
              />
            </div>
          </div>
          <div>
            <label className={labelClasse} htmlFor="rua">Rua</label>
            <input
              required
              id="rua"
              value={endereco.rua}
              onChange={(e) => setEndereco({ ...endereco, rua: e.target.value })}
              className={campoClasse}
            />
          </div>
          <div>
            <label className={labelClasse} htmlFor="complemento">Complemento (opcional)</label>
            <input
              id="complemento"
              value={endereco.complemento}
              onChange={(e) => setEndereco({ ...endereco, complemento: e.target.value })}
              className={campoClasse}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasse} htmlFor="bairro">Bairro</label>
              <input
                required
                id="bairro"
                value={endereco.bairro}
                onChange={(e) => setEndereco({ ...endereco, bairro: e.target.value })}
                className={campoClasse}
              />
            </div>
            <div>
              <label className={labelClasse} htmlFor="cidade">Cidade</label>
              <input
                required
                id="cidade"
                value={endereco.cidade}
                onChange={(e) => setEndereco({ ...endereco, cidade: e.target.value })}
                className={campoClasse}
              />
            </div>
          </div>
          <div>
            <label className={labelClasse} htmlFor="estado">Estado (UF)</label>
            <input
              required
              id="estado"
              maxLength={2}
              placeholder="UF"
              value={endereco.estado}
              onChange={(e) => setEndereco({ ...endereco, estado: e.target.value.toUpperCase() })}
              className={`${campoClasse} max-w-[6rem] uppercase`}
            />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={voltar} className="w-full rounded-md border border-vinho px-6 py-3 font-medium uppercase tracking-wide text-vinho transition-colors hover:bg-vinho hover:text-creme">
              Voltar
            </button>
            <button type="submit" className="w-full rounded-md bg-vinho px-6 py-3 font-medium uppercase tracking-wide text-creme transition-colors hover:bg-dourado hover:text-vinho">
              Continuar
            </button>
          </div>
        </form>
      )}

      {etapa === 3 && (
        <form onSubmit={avancar} className="mt-6 space-y-4">
          <div className="divide-y divide-dourado/20 rounded-md border border-dourado/20">
            {itens.map((item) => (
              <div key={item.slug} className="flex items-center justify-between px-4 py-2 text-sm text-vinho">
                <span>{item.nome} × {item.quantidade}</span>
                <span>{formatarPreco(item.precoUnitario * item.quantidade)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between px-4 py-2 font-medium text-vinho">
              <span>Total</span>
              <span>{formatarPreco(totalPreco)}</span>
            </div>
          </div>

          <label className="flex items-start gap-2 text-sm text-vinho">
            <input
              required
              type="checkbox"
              checked={aceiteTermos}
              onChange={(e) => setAceiteTermos(e.target.checked)}
              className="mt-1"
            />
            <span>
              Li e aceito a{" "}
              <Link href="/politica-de-termos" target="_blank" className="underline underline-offset-2">
                Política de Termos
              </Link>
              .
            </span>
          </label>

          <div className="flex gap-3">
            <button type="button" onClick={voltar} className="w-full rounded-md border border-vinho px-6 py-3 font-medium uppercase tracking-wide text-vinho transition-colors hover:bg-vinho hover:text-creme">
              Voltar
            </button>
            <button type="submit" className="w-full rounded-md bg-vinho px-6 py-3 font-medium uppercase tracking-wide text-creme transition-colors hover:bg-dourado hover:text-vinho">
              Continuar
            </button>
          </div>
        </form>
      )}

      {etapa === 4 && (
        <div className="mt-6 space-y-4">
          {modoPagamento === "" && (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setModoPagamento("brick")}
                  className="rounded-md border border-dourado/40 px-4 py-4 text-left text-vinho hover:border-vinho hover:bg-vinho/5"
                >
                  <span className="block font-medium">Pix ou Cartão</span>
                  <span className="block text-xs text-vinho/60">Pagamento imediato, sem sair do site</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModoPagamento("boleto")}
                  className="rounded-md border border-dourado/40 px-4 py-4 text-left text-vinho hover:border-vinho hover:bg-vinho/5"
                >
                  <span className="block font-medium">Boleto</span>
                  <span className="block text-xs text-vinho/60">Você será redirecionado para gerar o boleto</span>
                </button>
              </div>
              <button type="button" onClick={voltar} className="w-full rounded-md border border-vinho px-6 py-3 font-medium uppercase tracking-wide text-vinho transition-colors hover:bg-vinho hover:text-creme">
                Voltar
              </button>
            </>
          )}

          {modoPagamento === "brick" && (
            <>
              <PaymentBrickStep
                itens={itens}
                totalPreco={totalPreco}
                dadosPessoais={dadosPessoais}
                endereco={endereco}
                onAprovado={handlePagamentoAprovado}
              />
              <button
                type="button"
                onClick={() => setModoPagamento("")}
                className="text-sm text-vinho/60 underline underline-offset-2"
              >
                Escolher outra forma de pagamento
              </button>
            </>
          )}

          {modoPagamento === "boleto" && (
            <>
              {erroBoleto && <p className="text-sm text-red-700">{erroBoleto}</p>}
              <button
                type="button"
                onClick={finalizarBoleto}
                disabled={enviandoBoleto}
                className="w-full rounded-md bg-vinho px-6 py-3 font-medium uppercase tracking-wide text-creme transition-colors hover:bg-dourado hover:text-vinho disabled:opacity-60"
              >
                {enviandoBoleto ? "Redirecionando..." : "Gerar boleto"}
              </button>
              <button
                type="button"
                onClick={() => setModoPagamento("")}
                disabled={enviandoBoleto}
                className="text-sm text-vinho/60 underline underline-offset-2 disabled:opacity-60"
              >
                Escolher outra forma de pagamento
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
