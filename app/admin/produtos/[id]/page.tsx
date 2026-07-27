"use client";

import { use, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Produto } from "@/lib/types";
import { ProdutoForm } from "@/components/admin/ProdutoForm";

export default function EditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [produto, setProduto] = useState<Produto | null | undefined>(undefined);

  useEffect(() => {
    getDoc(doc(db, "produtos", id)).then((snap) => {
      setProduto(snap.exists() ? (snap.data() as Produto) : null);
    });
  }, [id]);

  if (produto === undefined) {
    return <p className="mx-auto max-w-2xl px-4 py-12 text-vinho/60">Carregando...</p>;
  }

  if (produto === null) {
    return <p className="mx-auto max-w-2xl px-4 py-12 text-vinho/60">Produto não encontrado.</p>;
  }

  return <ProdutoForm produtoExistente={produto} docId={id} />;
}
