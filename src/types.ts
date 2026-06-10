/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Photo {
  id: string;
  title: string;
  caption: string;
  defaultImage: string; // Unsplash romantic aesthetics matching the specific memory
  userImage?: string;   // Base64 string if uploaded by user
  placementHint: string; // Describes the original photo uploaded by the user to help them
}

export interface Milestone {
  id: string;
  date: string; // e.g., "25/12/2025"
  title: string;
  description: string;
  iconType: "heart" | "star" | "cup" | "map" | "smile" | "camera";
}

export interface FuturePlan {
  id: string;
  text: string;
  completed: boolean;
  category: "viagem" | "casa" | "lazer" | "outro";
}
