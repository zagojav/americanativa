"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { linkWhatsappAtacado } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/site-config";

// Bloco informativo fixo — não implementa nenhum bloqueio de quantidade,
// apenas orienta o cliente a pedir orçamento via WhatsApp para pedidos maiores.
export function AtacadoBlock({ nomeProduto }: { nomeProduto: string }) {
  function registrarLead() {
    // Fire-and-forget: o link já abre em nova aba, então não precisa
    // bloquear a navegação esperando a gravação no Firestore.
    addDoc(collection(db, "leads"), {
      produtoNome: nomeProduto,
      dataHora: serverTimestamp(),
    }).catch(() => {});
  }

  return (
    <div className="rounded-lg border border-dourado/40 bg-vinho/5 p-4">
      <p className="text-sm text-vinho">
        <strong>Atacado:</strong> pedidos a partir de{" "}
        {siteConfig.atacado.quantidadeMinima} unidades deste produto têm preço
        especial. Solicite seu orçamento pelo WhatsApp.
      </p>
      <a
        href={linkWhatsappAtacado(nomeProduto)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={registrarLead}
        className="mt-3 inline-flex items-center gap-2 rounded-md bg-vinho px-4 py-2 text-sm font-medium text-creme transition-colors hover:bg-dourado hover:text-vinho"
      >
        Solicitar orçamento de atacado
      </a>
    </div>
  );
}
