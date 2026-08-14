"use client";

import { useEffect, useState } from "react";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import type { CartItem } from "@/lib/cartStore";

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

type PixPendente = {
  id: number;
  qrCode: string;
  qrCodeBase64: string;
};

const PUBLIC_KEY = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;

export function PaymentBrickStep({
  itens,
  totalPreco,
  dadosPessoais,
  endereco,
  onAprovado,
}: {
  itens: CartItem[];
  totalPreco: number;
  dadosPessoais: DadosPessoais;
  endereco: Endereco;
  onAprovado: () => void;
}) {
  const [pix, setPix] = useState<PixPendente | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (PUBLIC_KEY) initMercadoPago(PUBLIC_KEY, { locale: "pt-BR" });
  }, []);

  // Enquanto o Pix está pendente, consulta o status a cada poucos segundos —
  // é o jeito mais simples de saber que o cliente pagou sem depender só do
  // webhook (que pode demorar a chegar, ou nem chegar em dev local).
  useEffect(() => {
    if (!pix) return;

    const intervalo = setInterval(async () => {
      const resposta = await fetch(`/api/pagamentos/${pix.id}`);
      if (!resposta.ok) return;
      const dados = await resposta.json();

      if (dados.status === "approved") {
        clearInterval(intervalo);
        onAprovado();
      } else if (dados.status === "rejected" || dados.status === "cancelled") {
        clearInterval(intervalo);
        setPix(null);
        setErro("O pagamento Pix não foi concluído. Tente novamente.");
      }
    }, 4000);

    const desistir = setTimeout(() => {
      clearInterval(intervalo);
      setPix(null);
      setErro("O tempo para pagar o Pix expirou. Gere um novo código.");
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(intervalo);
      clearTimeout(desistir);
    };
  }, [pix, onAprovado]);

  if (!PUBLIC_KEY) {
    return (
      <p className="text-sm text-red-700">
        Pagamento por Pix/Cartão ainda não está configurado neste ambiente
        (falta a variável NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY).
      </p>
    );
  }

  if (pix) {
    return (
      <div className="space-y-4 rounded-md border border-dourado/40 p-4 text-center">
        <p className="text-sm text-vinho">
          Escaneie o QR code no app do seu banco ou copie o código Pix abaixo:
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element -- imagem base64 gerada em tempo real pelo Mercado Pago, não é um asset otimizável */}
        <img
          src={`data:image/png;base64,${pix.qrCodeBase64}`}
          alt="QR code para pagamento Pix"
          className="mx-auto h-56 w-56"
        />
        <textarea
          readOnly
          value={pix.qrCode}
          onFocus={(e) => e.currentTarget.select()}
          rows={3}
          className="w-full rounded-md border border-dourado/40 px-3 py-2 text-xs text-vinho/80"
        />
        <p className="text-xs text-vinho/60">Aguardando confirmação do pagamento...</p>
      </div>
    );
  }

  return (
    <div>
      {erro && <p className="mb-3 text-sm text-red-700">{erro}</p>}
      <Payment
        initialization={{
          amount: totalPreco,
          payer: {
            email: dadosPessoais.email,
            firstName: dadosPessoais.nome.split(" ")[0],
            lastName: dadosPessoais.nome.split(" ").slice(1).join(" ") || dadosPessoais.nome,
            address: {
              zipCode: endereco.cep,
              streetName: endereco.rua,
              streetNumber: endereco.numero,
              neighborhood: endereco.bairro,
              city: endereco.cidade,
              federalUnit: endereco.estado,
              complement: endereco.complemento,
            },
          },
        }}
        customization={{
          paymentMethods: {
            creditCard: "all",
            bankTransfer: "all",
            ticket: [],
            atm: [],
          },
        }}
        onSubmit={async ({ formData }) => {
          setErro(null);

          const resposta = await fetch("/api/pagamentos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ formData, itens, dadosPessoais, endereco }),
          });
          const dados = await resposta.json();

          if (!resposta.ok) {
            setErro(dados.error ?? "Não foi possível processar o pagamento.");
            throw new Error(dados.error ?? "Falha no pagamento");
          }

          if (dados.status === "approved") {
            onAprovado();
            return;
          }

          if (dados.paymentMethodId === "pix" && dados.qrCodeBase64) {
            setPix({ id: dados.id, qrCode: dados.qrCode, qrCodeBase64: dados.qrCodeBase64 });
            return;
          }

          if (dados.status === "rejected") {
            setErro(
              dados.statusDetail
                ? `Pagamento recusado (${dados.statusDetail}). Tente outro cartão.`
                : "Pagamento recusado. Tente outro cartão."
            );
            throw new Error("Pagamento recusado");
          }

          // Outros status pendentes (ex: cartão em análise) — o cliente será
          // avisado quando o webhook confirmar, sem precisar ficar nesta tela.
          setErro("Seu pagamento está em análise. Avisaremos assim que for confirmado.");
        }}
        onError={(error) => {
          console.error("[PaymentBrickStep] Erro no Payment Brick:", error);
          setErro("Ocorreu um erro ao carregar o pagamento. Tente novamente.");
        }}
      />
    </div>
  );
}
