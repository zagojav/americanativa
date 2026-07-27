// Script de migração única: envia o catálogo completo de Horneados Únicos
// (data/produtos-horneados-unicos.json, 31 itens) para a collection
// "produtos" no Firestore. Usa addDoc com ID automático — cada produto vira
// um documento novo e independente, nunca sobrescreve nada existente.
//
// ⚠️ Rode só uma vez: como addDoc sempre cria um documento novo (sem chave
// de idempotência tipo o slug), rodar de novo duplica os 31 produtos. Se
// esses produtos já foram cadastrados antes (por scripts/seed-produtos.mjs
// ou pelo painel /admin/produtos), confira em /admin/produtos antes de
// rodar, pra não ficar com itens repetidos.
//
// Uso: node scripts/seed-horneados-unicos.mjs
// Pede e-mail/senha do admin no terminal — nunca lê nem grava a senha em
// nenhum arquivo.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { addDoc, collection } from "firebase/firestore";
import { iniciarSessaoAdmin } from "./lib/firebaseAdminCli.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const raizProjeto = path.resolve(__dirname, "..");

async function main() {
  const { db } = await iniciarSessaoAdmin(raizProjeto);

  const produtos = JSON.parse(
    readFileSync(path.join(raizProjeto, "data", "produtos-horneados-unicos.json"), "utf-8")
  );

  for (const produto of produtos) {
    const ref = await addDoc(collection(db, "produtos"), produto);
    console.log(`Criado (${ref.id}): ${produto.nome}`);
  }

  console.log(`\nConcluído: ${produtos.length} produtos criados na collection "produtos".`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Erro ao rodar o seed:", err.message ?? err);
  process.exit(1);
});
