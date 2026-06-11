/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

// ==========================================
// CONFIGURAÇÃO DO FIREBASE
// ==========================================
// Você pode colar os dados do console do Firebase diretamente aqui
// ou configurar as seguintes variáveis de ambiente no seu .env:
// - VITE_FIREBASE_API_KEY
// - VITE_FIREBASE_PROJECT_ID
// - VITE_FIREBASE_AUTH_DOMAIN
// - VITE_FIREBASE_STORAGE_BUCKET
// - VITE_FIREBASE_MESSAGES_SENDER_ID
// - VITE_FIREBASE_APP_ID
// ==========================================

const metaEnv = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: (metaEnv.VITE_FIREBASE_API_KEY || "").trim(),
  authDomain: (metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "").trim(),
  projectId: (metaEnv.VITE_FIREBASE_PROJECT_ID || "").trim(),
  storageBucket: (metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "").trim(),
  messagingSenderId: (metaEnv.VITE_FIREBASE_MESSAGES_SENDER_ID || "").trim(),
  appId: (metaEnv.VITE_FIREBASE_APP_ID || "").trim()
};

const isPlaceholder = (val: string) => {
  if (!val) return true;
  const normalized = val.toLowerCase();
  return (
    normalized === "" ||
    normalized.includes("sua_chave") ||
    normalized.includes("seu_projeto") ||
    normalized.includes("placeholder") ||
    normalized.includes("your")
  );
};

export const checkFirebaseConfig = (config: typeof firebaseConfig): boolean => {
  return (
    !!config.apiKey &&
    !isPlaceholder(config.apiKey) &&
    !!config.projectId &&
    !isPlaceholder(config.projectId)
  );
};

export let isFirebaseConfigured = checkFirebaseConfig(firebaseConfig);

let appInstance: FirebaseApp | null = null;
export let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    appInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(appInstance);
  } catch (error) {
    console.error("Erro ao inicializar o Firebase com variáveis de compilação:", error);
  }
}

export function getDb(): Firestore | null {
  return db;
}

export function getIsFirebaseConfigured(): boolean {
  return isFirebaseConfigured;
}

/**
 * Busca a configuração em tempo de execução a partir do servidor do Express.
 * Útil para quando o aplicativo é implantado no Cloud Run com segredos de ambiente.
 */
export async function initializeRuntimeConfig(): Promise<boolean> {
  try {
    const res = await fetch("/api/config");
    if (res.ok) {
      const data = await res.json();
      
      const runtimeConfig = {
        apiKey: (data.firebaseApiKey || data.apiKey || firebaseConfig.apiKey || "").trim(),
        authDomain: (data.firebaseAuthDomain || firebaseConfig.authDomain || "").trim(),
        projectId: (data.firebaseProjectId || data.projectId || firebaseConfig.projectId || "").trim(),
        storageBucket: (data.firebaseStorageBucket || firebaseConfig.storageBucket || "").trim(),
        messagingSenderId: (data.firebaseMessagingSenderId || firebaseConfig.messagingSenderId || "").trim(),
        appId: (data.firebaseAppId || firebaseConfig.appId || "").trim(),
      };

      if (checkFirebaseConfig(runtimeConfig)) {
        isFirebaseConfigured = true;
        appInstance = getApps().length === 0 ? initializeApp(runtimeConfig) : getApp();
        db = getFirestore(appInstance);
        return true;
      }
    }
  } catch (err) {
    console.warn("Falha ao buscar config do Express. Usando variáveis locais/compilação.", err);
  }
  return isFirebaseConfigured;
}
