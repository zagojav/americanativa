// Script de migração única: envia o catálogo de data/produtos.json para a
// collection "produtos" no Firestore, adicionando ativo=true e ordem=índice.
// Rodar manualmente depois de configurar .env.local e criar o usuário admin
// no Firebase Console (ver README.md, seção "Firebase — configuração").
//
// Uso: node scripts/seed-produtos.mjs
// Pede e-mail/senha do admin no terminal — nunca lê nem grava a senha em
// nenhum arquivo, então é seguro rodar sem risco de vazar credencial no Git.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { doc, setDoc } from "firebase/firestore";
import { iniciarSessaoAdmin } from "./lib/firebaseAdminCli.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const raizProjeto = path.resolve(__dirname, "..");

async function main() {
  const { db } = await iniciarSessaoAdmin(raizProjeto);

  const produtos = JSON.parse(
    readFileSync(path.join(raizProjeto, "data", "produtos.json"), "utf-8")
  );

  for (const [indice, produto] of produtos.entries()) {
    await setDoc(doc(db, "produtos", produto.slug), {
      ...produto,
      ativo: true,
      ordem: indice,
    });
    console.log(`Gravado: ${produto.slug}`);
  }

  console.log(`\nConcluído: ${produtos.length} produtos gravados na collection "produtos".`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Erro ao rodar o seed:", err.message ?? err);
  process.exit(1);
});
