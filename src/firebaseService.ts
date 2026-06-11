/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDb, getIsFirebaseConfigured } from "./firebaseClient";
import { Photo, Milestone, FuturePlan } from "./types";

export interface LoveDataPayload {
  photos: Photo[];
  milestones: Milestone[];
  plans: FuturePlan[];
  declaration: string;
}

const RECORD_ID = "nosso_universo";
const COLLECTION_NAME = "universo_amor";

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
    },
    operationType,
    path,
  };
  console.warn("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Fetches the shared romantic data from Firestore.
 */
export async function fetchLoveData(): Promise<LoveDataPayload | null> {
  const isConfigured = getIsFirebaseConfigured();
  const db = getDb();

  if (!isConfigured || !db) {
    console.log("Firebase não está configurado. Usando armazenamento local.");
    return null;
  }

  const docPath = `${COLLECTION_NAME}/${RECORD_ID}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, RECORD_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        photos: (data.photos || []) as Photo[],
        milestones: (data.milestones || []) as Milestone[],
        plans: (data.plans || []) as FuturePlan[],
        declaration: (data.declaration || "") as string,
      };
    }
    return null;
  } catch (err: any) {
    handleFirestoreError(err, OperationType.GET, docPath);
    return null;
  }
}

/**
 * Saves or updates love data in Firestore.
 */
export async function saveLoveData(payload: LoveDataPayload): Promise<boolean> {
  const isConfigured = getIsFirebaseConfigured();
  const db = getDb();

  if (!isConfigured || !db) {
    return false;
  }

  const docPath = `${COLLECTION_NAME}/${RECORD_ID}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, RECORD_ID);
    await setDoc(docRef, {
      photos: payload.photos,
      milestones: payload.milestones,
      plans: payload.plans,
      declaration: payload.declaration,
      updated_at: new Date().toISOString(),
    });
    return true;
  } catch (err: any) {
    handleFirestoreError(err, OperationType.WRITE, docPath);
    return false;
  }
}
