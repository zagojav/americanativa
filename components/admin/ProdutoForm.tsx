"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { CldUploadWidget } from "next-cloudinary";
import { db } from "@/lib/firebase";
import { getCategorias } from "@/lib/produtos";
import { Produto } from "@/lib/types";

function slugify(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProdutoForm({
  produtoExistente,
  docId,
}: {
  produtoExistente?: Produto;
  docId?: string;
}) {
  const router = useRouter();
  const categorias = getCategorias();
  const modoEdicao = Boolean(produtoExistente);

  const [nome, setNome] = useState(produtoExistente?.nome ?? "");
  const [slug, setSlug] = useState(produtoExistente?.slug ?? "");
  const [categoria, setCategoria] = useState(produtoExistente?.categoria ?? categorias[0]?.slug ?? "");
  const [subcategoria, setSubcategoria] = useState(produtoExistente?.subcategoria ?? "");
  const [descricao, setDescricao] = useState(produtoExistente?.descricao ?? "");
  const [peso, setPeso] = useState(produtoExistente?.peso ?? "");
  const [preco, setPreco] = useState(
    produtoExistente?.precoUnitario != null ? String(produtoExistente.precoUnitario) : ""
  );
  const [ingredientes, setIngredientes] = useState(
    produtoExistente?.ingredientes?.join(", ") ?? ""
  );
  const [cores, setCores] = useState(
    produtoExistente?.variacoes?.find((v) => v.tipo === "cor")?.opcoes.join(", ") ?? ""
  );
  const [ativo, setAtivo] = useState(produtoExistente?.ativo ?? true);
  const [ordem, setOrdem] = useState(String(produtoExistente?.ordem ?? 0));
  const [imagens, setImagens] = useState<string[]>(produtoExistente?.imagens ?? []);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const categoriaSelecionada = categorias.find((c) => c.slug === categoria);
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  function handleNomeChange(valor: string) {
    setNome(valor);
    if (!modoEdicao) setSlug(slugify(valor));
  }

  function removerImagem(indice: number) {
    setImagens((atual) => atual.filter((_, i) => i !== indice));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (!nome.trim() || !slug.trim() || !categoria) {
      setErro("Nome, slug e categoria são obrigatórios.");
      return;
    }

    setSalvando(true);
    try {
      const listaCores = cores
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
      const listaIngredientes = ingredientes
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean);

      const dados: Produto = {
        slug: slug.trim(),
        nome: nome.trim(),
        descricao: descricao.trim(),
        categoria,
        ...(subcategoria ? { subcategoria } : {}),
        ...(peso.trim() ? { peso: peso.trim() } : {}),
        precoUnitario: preco.trim() ? Number(preco) : null,
        imagens,
        ...(listaIngredientes.length > 0 ? { ingredientes: listaIngredientes } : {}),
        ...(listaCores.length > 0
          ? { variacoes: [{ tipo: "cor" as const, opcoes: listaCores }] }
          : {}),
        ativo,
        ordem: Number(ordem) || 0,
      };

      if (modoEdicao && docId) {
        // Edição: atualiza o documento existente, nunca cria um novo.
        await updateDoc(doc(db, "produtos", docId), dados);
      } else {
        // Criação: ID automático do Firestore — cada produto vira um
        // documento novo e independente, mesmo que o slug se repita.
        await addDoc(collection(db, "produtos"), dados);
      }
      router.push("/admin/produtos");
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao salvar o produto.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-5 px-4 py-12">
      <h1 className="font-display text-3xl text-vinho">
        {modoEdicao ? "Editar produto" : "Novo produto"}
      </h1>

      {erro && <p className="text-sm text-red-700">{erro}</p>}

      <div>
        <label className="text-sm font-medium text-vinho">Nome</label>
        <input
          required
          value={nome}
          onChange={(e) => handleNomeChange(e.target.value)}
          className="mt-1 w-full rounded-md border border-dourado/40 px-3 py-2"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-vinho">Slug</label>
        <input
          required
          value={slug}
          onChange={(e) => setSlug(slugify(e.target.value))}
          className="mt-1 w-full rounded-md border border-dourado/40 px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-vinho">Categoria</label>
          <select
            value={categoria}
            onChange={(e) => {
              setCategoria(e.target.value);
              setSubcategoria("");
            }}
            className="mt-1 w-full rounded-md border border-dourado/40 px-3 py-2"
          >
            {categorias.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-vinho">Subcategoria</label>
          <select
            value={subcategoria}
            onChange={(e) => setSubcategoria(e.target.value)}
            disabled={!categoriaSelecionada?.subcategorias?.length}
            className="mt-1 w-full rounded-md border border-dourado/40 px-3 py-2 disabled:bg-creme disabled:text-vinho/50"
          >
            <option value="">Nenhuma</option>
            {categoriaSelecionada?.subcategorias?.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-vinho">Descrição</label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded-md border border-dourado/40 px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-vinho">Peso</label>
          <input
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            placeholder="ex: 120g"
            className="mt-1 w-full rounded-md border border-dourado/40 px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-vinho">Preço (R$)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            placeholder="Vazio = Sob consulta"
            className="mt-1 w-full rounded-md border border-dourado/40 px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-vinho">Ingredientes (separados por vírgula)</label>
        <input
          value={ingredientes}
          onChange={(e) => setIngredientes(e.target.value)}
          className="mt-1 w-full rounded-md border border-dourado/40 px-3 py-2"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-vinho">
          Cores (separadas por vírgula, na mesma ordem das fotos)
        </label>
        <input
          value={cores}
          onChange={(e) => setCores(e.target.value)}
          placeholder="ex: Marrom, Verde Água, Vinho"
          className="mt-1 w-full rounded-md border border-dourado/40 px-3 py-2"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-vinho">Fotos</label>

        {!cloudName ? (
          <p className="mt-1 text-sm text-vinho/60">
            Cloudinary ainda não configurado (variáveis{" "}
            <code>NEXT_PUBLIC_CLOUDINARY_*</code>/<code>CLOUDINARY_API_SECRET</code>{" "}
            em <code>.env.local</code>).
          </p>
        ) : (
          <CldUploadWidget
            signatureEndpoint="/api/cloudinary-signature"
            onSuccess={(result) => {
              const info = result.info;
              if (info && typeof info === "object" && "secure_url" in info) {
                setImagens((atual) => [...atual, info.secure_url as string]);
              }
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="mt-1 rounded-md border border-dourado/40 px-4 py-2 text-sm text-vinho hover:bg-creme"
              >
                Adicionar foto
              </button>
            )}
          </CldUploadWidget>
        )}

        {imagens.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {imagens.map((url, indice) => (
              <div key={url} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element -- URL vem do Cloudinary, sem domínio fixo conhecido de antemão */}
                <img
                  src={url}
                  alt={`Foto ${indice + 1}`}
                  className="h-20 w-20 rounded-md border border-dourado/30 object-cover"
                />
                <button
                  type="button"
                  onClick={() => removerImagem(indice)}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-vinho text-xs text-creme"
                  aria-label="Remover foto"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex items-center gap-2 text-sm font-medium text-vinho">
          <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} />
          Ativo (visível no site)
        </label>
        <div>
          <label className="text-sm font-medium text-vinho">Ordem</label>
          <input
            type="number"
            value={ordem}
            onChange={(e) => setOrdem(e.target.value)}
            className="mt-1 w-full rounded-md border border-dourado/40 px-3 py-2"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={salvando}
        className="w-full rounded-md bg-vinho px-6 py-3 font-medium uppercase tracking-wide text-creme transition-colors hover:bg-dourado hover:text-vinho disabled:opacity-60"
      >
        {salvando ? "Salvando..." : "Salvar produto"}
      </button>
    </form>
  );
}
