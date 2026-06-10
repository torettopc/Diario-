/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from "@supabase/supabase-js";

const metaEnv = (import.meta as any).env || {};
const supabaseUrl = (metaEnv.VITE_SUPABASE_URL || "").trim();
const supabaseAnonKey = (metaEnv.VITE_SUPABASE_ANON_KEY || "").trim();

const isPlaceholder = (val: string) => {
  const normalized = val.toLowerCase();
  return (
    normalized === "" ||
    normalized.includes("sua_url") ||
    normalized.includes("sua_chave") ||
    normalized.includes("your_") ||
    normalized.includes("your") ||
    normalized.includes("placeholder") ||
    normalized.includes("sua_url_do_supabase_aqui") ||
    normalized.includes("sua_chave_anon_do_supabase_aqui")
  );
};

// Check if credentials are set, are not placeholders, and have a valid URL format
export const isSupabaseConfigured = 
  !!supabaseUrl && 
  !!supabaseAnonKey && 
  !isPlaceholder(supabaseUrl) && 
  !isPlaceholder(supabaseAnonKey) &&
  (supabaseUrl.startsWith("https://") || supabaseUrl.startsWith("http://"));

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false
      }
    })
  : null;
