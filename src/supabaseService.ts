/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getSupabase, getIsSupabaseConfigured } from "./supabaseClient";
import { Photo, Milestone, FuturePlan } from "./types";

export interface LoveDataPayload {
  photos: Photo[];
  milestones: Milestone[];
  plans: FuturePlan[];
  declaration: string;
}

const RECORD_ID = "nosso_universo";

/**
 * Fetches the shared romantic data from Supabase.
 * Returns null if the record doesn't exist yet on a healthy database connection.
 * Throws an error on actual API/network failures.
 */
export async function fetchLoveData(): Promise<LoveDataPayload | null> {
  const isConfigured = getIsSupabaseConfigured();
  const client = getSupabase();

  if (!isConfigured || !client) {
    console.log("Supabase is not configured. Using local storage instead.");
    return null;
  }

  try {
    const { data, error } = await client
      .from("universo_amor")
      .select("photos, milestones, plans, declaration")
      .eq("id", RECORD_ID)
      .maybeSingle();

    if (error) {
      // Check if it is a standard empty rows response or similar (PostgREST single response error)
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(`Database query error: ${error.message} (Code: ${error.code})`);
    }

    if (data) {
      return {
        photos: data.photos as Photo[],
        milestones: data.milestones as Milestone[],
        plans: data.plans as FuturePlan[],
        declaration: data.declaration as string,
      };
    }
  } catch (err: any) {
    console.warn("Failed to fetch love data from Supabase:", err);
    throw err;
  }

  return null;
}

/**
 * Saves or updates the love data payload in Supabase.
 * Throws an error on API/network failures.
 */
export async function saveLoveData(payload: LoveDataPayload): Promise<boolean> {
  const isConfigured = getIsSupabaseConfigured();
  const client = getSupabase();

  if (!isConfigured || !client) {
    return false;
  }

  try {
    const { error } = await client
      .from("universo_amor")
      .upsert({
        id: RECORD_ID,
        photos: payload.photos,
        milestones: payload.milestones,
        plans: payload.plans,
        declaration: payload.declaration,
        updated_at: new Date().toISOString()
      }, {
        onConflict: "id"
      });

    if (error) {
      throw new Error(`Error saving data to Supabase: ${error.message} (Code: ${error.code})`);
    }

    return true;
  } catch (err: any) {
    console.warn("Failed to save love data to Supabase:", err);
    throw err;
  }
}

/**
 * Helper to get the SQL setup code to assist the user.
 */
export const SUPABASE_SQL_SETUP = `-- Execute este comando no SQL Editor do seu projeto Supabase:

CREATE TABLE IF NOT EXISTS universo_amor (
  id TEXT PRIMARY KEY,
  photos JSONB,
  milestones JSONB,
  plans JSONB,
  declaration TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS (Row Level Security)
ALTER TABLE universo_amor ENABLE ROW LEVEL SECURITY;

-- Criar política de acesso público total (para facilitar o compartilhamento)
CREATE POLICY "Acesso publico geral" 
  ON universo_amor 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);`;
