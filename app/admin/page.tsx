"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

type PedidoOrcamento = {
  id: string;
  tipo: "contato" | "franquia";
  nome?: string;
  email?: string;
  telefone?: string;
  cidadeInteresse?: string;
  mensagem?: string;
  criadoEm?: Timestamp;
};

export default function AdminDashboardPage() {
  const [pedidos, setPedidos] = useState<PedidoOrcamento[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "pedidos_orcamento"), orderBy("criadoEm", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPedidos(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as PedidoOrcamento)
      );
      setCarregando(false);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-display text-3xl text-vinho">Pedidos recebidos</h1>

      {carregando ? (
        <p className="mt-8 text-vinho/60">Carregando...</p>
      ) : pedidos.length === 0 ? (
        <p className="mt-8 text-vinho/60">Nenhum pedido recebido ainda.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="rounded-lg border border-dourado/30 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide ${
                    pedido.tipo === "franquia"
                      ? "bg-dourado/20 text-dourado-dark"
                      : "bg-vinho/10 text-vinho"
                  }`}
                >
                  {pedido.tipo === "franquia" ? "Franquia" : "Contato"}
                </span>
                <span className="text-xs text-vinho/50">
                  {pedido.criadoEm?.toDate().toLocaleString("pt-BR") ?? ""}
                </span>
              </div>
              <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1 text-sm text-vinho/90 sm:grid-cols-2">
                <div>
                  <dt className="inline font-medium">Nome: </dt>
                  <dd className="inline">{pedido.nome}</dd>
                </div>
                <div>
                  <dt className="inline font-medium">E-mail: </dt>
                  <dd className="inline">{pedido.email}</dd>
                </div>
                <div>
                  <dt className="inline font-medium">Telefone: </dt>
                  <dd className="inline">{pedido.telefone}</dd>
                </div>
                {pedido.cidadeInteresse && (
                  <div>
                    <dt className="inline font-medium">Cidade: </dt>
                    <dd className="inline">{pedido.cidadeInteresse}</dd>
                  </div>
                )}
              </dl>
              {pedido.mensagem && (
                <p className="mt-2 text-sm text-vinho/80">{pedido.mensagem}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
