/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

let currentUrl = "";
let currentAnonKey = "";

const metaEnv = (import.meta as any).env || {};
currentUrl = (metaEnv.VITE_SUPABASE_URL || "").trim();
currentAnonKey = (metaEnv.VITE_SUPABASE_ANON_KEY || "").trim();

const isPlaceholder = (val: string) => {
  const normalized = val.toLowerCase();
  return (
    normalized === "" ||
    normalized.includes("sua_url") ||
    normalized.includes("sua_chave") ||
    normalized.includes("your") ||
    normalized.includes("placeholder")
  );
};

export const checkConfig = (url: string, key: string): boolean => {
  return (
    !!url &&
    !!key &&
    !isPlaceholder(url) &&
    !isPlaceholder(key) &&
    (url.startsWith("https://") || url.startsWith("http://"))
  );
};

// Exports that can be dynamically updated at startup
export let isSupabaseConfigured = checkConfig(currentUrl, currentAnonKey);

export let supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(currentUrl, currentAnonKey, {
      auth: {
        persistSession: false
      }
    })
  : null;

export function getSupabase(): SupabaseClient | null {
  return supabase;
}

export function getIsSupabaseConfigured(): boolean {
  return isSupabaseConfigured;
}

/**
 * Fetches runtime config from the Express server to handle environment secrets configured on Cloud Run.
 * If config is found, reinits the Supabase client.
 */
export async function initializeRuntimeConfig(): Promise<boolean> {
  try {
    const res = await fetch("/api/config");
    if (res.ok) {
      const data = await res.json();
      const runtimeUrl = (data.supabaseUrl || "").trim();
      const runtimeAnonKey = (data.supabaseAnonKey || "").trim();

      if (checkConfig(runtimeUrl, runtimeAnonKey)) {
        currentUrl = runtimeUrl;
        currentAnonKey = runtimeAnonKey;
        isSupabaseConfigured = true;
        supabase = createClient(currentUrl, currentAnonKey, {
          auth: {
            persistSession: false
          }
        });
        return true;
      }
    }
  } catch (err) {
    console.warn("Express server config fetch failed. Using build-time configuration.", err);
  }
  return isSupabaseConfigured;
}
