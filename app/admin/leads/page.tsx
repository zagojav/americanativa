"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Lead = {
  id: string;
  produtoNome: string;
  dataHora?: Timestamp;
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "leads"), orderBy("dataHora", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLeads(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Lead));
      setCarregando(false);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl text-vinho">Leads de WhatsApp</h1>
      <p className="mt-1 text-sm text-vinho/60">
        Cliques em &quot;Solicitar orçamento de atacado&quot;, mais recentes primeiro.
      </p>

      {carregando ? (
        <p className="mt-8 text-vinho/60">Carregando...</p>
      ) : leads.length === 0 ? (
        <p className="mt-8 text-vinho/60">Nenhum lead registrado ainda.</p>
      ) : (
        <div className="mt-8 space-y-3">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="flex items-center justify-between rounded-lg border border-dourado/30 bg-white p-4"
            >
              <span className="font-medium text-vinho">{lead.produtoNome}</span>
              <span className="text-xs text-vinho/50">
                {lead.dataHora?.toDate().toLocaleString("pt-BR") ?? ""}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
