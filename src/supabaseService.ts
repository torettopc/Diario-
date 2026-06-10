/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from "./supabaseClient";
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
 * Returns null if Supabase is not configured or if the record doesn't exist.
 */
export async function fetchLoveData(): Promise<LoveDataPayload | null> {
  if (!isSupabaseConfigured || !supabase) {
    console.log("Supabase is not configured. Using local storage instead.");
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("love_universe")
      .select("photos, milestones, plans, declaration")
      .eq("id", RECORD_ID)
      .maybeSingle();

    if (error) {
      console.error("Error fetching data from Supabase:", error.message);
      return null;
    }

    if (data) {
      return {
        photos: data.photos as Photo[],
        milestones: data.milestones as Milestone[],
        plans: data.plans as FuturePlan[],
        declaration: data.declaration as string,
      };
    }
  } catch (err) {
    console.error("Failed to fetch love data:", err);
  }

  return null;
}

/**
 * Saves or updates the love data payload in Supabase.
 */
export async function saveLoveData(payload: LoveDataPayload): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    return false;
  }

  try {
    const { error } = await supabase
      .from("love_universe")
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
      console.error("Error saving data to Supabase:", error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Failed to save love data:", err);
    return false;
  }
}

/**
 * Helper to get the SQL setup code to assist the user.
 */
export const SUPABASE_SQL_SETUP = `-- Execute este comando no SQL Editor do seu projeto Supabase:

CREATE TABLE IF NOT EXISTS love_universe (
  id TEXT PRIMARY KEY,
  photos JSONB,
  milestones JSONB,
  plans JSONB,
  declaration TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS (Row Level Security)
ALTER TABLE love_universe ENABLE ROW LEVEL SECURITY;

-- Criar política de acesso público total (para facilitar o compartilhamento)
CREATE POLICY "Acesso publico geral" 
  ON love_universe 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);`;
