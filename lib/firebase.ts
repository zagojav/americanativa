import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getFirebaseApp() {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

// Firestore não valida a API key na inicialização, então pode ser exportado
// direto — usado tanto pelas rotas de servidor (contato/franquia) quanto
// pelo painel admin no navegador.
export const db = getFirestore(getFirebaseApp());

// Auth valida a API key assim que é criado (lança se estiver ausente ou
// inválida), então fica atrás de uma função: só é chamada dentro de efeitos
// e handlers do painel admin no navegador, nunca no carregamento do módulo —
// caso contrário o build quebra em qualquer rota que importe este arquivo,
// mesmo sem usar autenticação (ex: as rotas de contato/franquia).
export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}
