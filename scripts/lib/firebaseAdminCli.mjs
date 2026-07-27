// Helpers compartilhados pelos scripts de seed (scripts/seed-*.mjs): ler o
// .env.local do projeto e autenticar como admin no Firebase a partir do
// terminal, sem nunca ler nem gravar a senha em nenhum arquivo.

import { readFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import path from "node:path";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const ENTER = 13;
const NEWLINE = 10;
const CTRL_C = 3;
const BACKSPACE = 8;
const DELETE = 127;

export function lerEnvLocal(raizProjeto) {
  const caminho = path.join(raizProjeto, ".env.local");
  const conteudo = readFileSync(caminho, "utf-8");
  const env = {};
  for (const linha of conteudo.split("\n")) {
    const l = linha.trim();
    if (!l || l.startsWith("#")) continue;
    const igual = l.indexOf("=");
    if (igual === -1) continue;
    env[l.slice(0, igual).trim()] = l.slice(igual + 1).trim();
  }
  return env;
}

function perguntarSenha(texto) {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    let senha = "";

    function onData(chunk) {
      for (const byte of chunk) {
        if (byte === ENTER || byte === NEWLINE) {
          stdin.setRawMode?.(false);
          stdin.pause();
          stdin.removeListener("data", onData);
          process.stdout.write("\n");
          resolve(senha);
          return;
        }
        if (byte === CTRL_C) {
          process.exit(1);
        }
        if (byte === BACKSPACE || byte === DELETE) {
          senha = senha.slice(0, -1);
        } else {
          senha += String.fromCharCode(byte);
        }
      }
    }

    process.stdout.write(texto);
    stdin.setRawMode?.(true);
    stdin.resume();
    stdin.on("data", onData);
  });
}

/**
 * Lê .env.local, inicializa o Firebase, pede e-mail/senha do admin no
 * terminal e autentica. Retorna { db } pronto pra usar nos scripts de seed.
 */
export async function iniciarSessaoAdmin(raizProjeto) {
  const env = lerEnvLocal(raizProjeto);
  const firebaseConfig = {
    apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error(
      "Faltam variáveis NEXT_PUBLIC_FIREBASE_* em .env.local — configure o projeto Firebase antes de rodar o seed."
    );
    process.exit(1);
  }

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const email = (await rl.question("E-mail do admin: ")).trim();
  rl.close();
  const senha = await perguntarSenha("Senha do admin: ");

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  await signInWithEmailAndPassword(auth, email, senha);

  return { db };
}
