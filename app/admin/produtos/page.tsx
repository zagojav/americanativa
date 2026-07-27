"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Produto } from "@/lib/types";

type ProdutoComId = Produto & { id: string };

export default function AdminProdutosPage() {
  const [produtos, setProdutos] = useState<ProdutoComId[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "produtos"), orderBy("ordem"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProdutos(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Produto) })));
      setCarregando(false);
    });
    return unsubscribe;
  }, []);

  async function handleExcluir(id: string, nome: string) {
    if (!confirm(`Excluir "${nome}"? Essa ação não pode ser desfeita.`)) return;
    await deleteDoc(doc(db, "produtos", id));
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-vinho">Produtos</h1>
        <Link
          href="/admin/produtos/novo"
          className="rounded-md bg-vinho px-4 py-2 text-sm font-medium text-creme hover:bg-dourado hover:text-vinho"
        >
          Novo produto
        </Link>
      </div>

      {carregando ? (
        <p className="mt-8 text-vinho/60">Carregando...</p>
      ) : produtos.length === 0 ? (
        <p className="mt-8 text-vinho/60">Nenhum produto cadastrado ainda.</p>
      ) : (
        <div className="mt-8 space-y-3">
          {produtos.map((produto) => (
            <div
              key={produto.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-dourado/30 bg-white p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-vinho">{produto.nome}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium uppercase tracking-wide ${
                      produto.ativo ? "bg-dourado/20 text-dourado-dark" : "bg-vinho/10 text-vinho/60"
                    }`}
                  >
                    {produto.ativo ? "Ativo" : "Inativo"}
                  </span>
                </div>
                <p className="text-sm text-vinho/60">
                  {produto.categoria}
                  {produto.subcategoria ? ` / ${produto.subcategoria}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  href={`/admin/produtos/${produto.id}`}
                  className="rounded-md border border-vinho px-3 py-1.5 text-sm text-vinho hover:bg-vinho hover:text-creme"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleExcluir(produto.id, produto.nome)}
                  className="rounded-md border border-red-700 px-3 py-1.5 text-sm text-red-700 hover:bg-red-700 hover:text-white"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
