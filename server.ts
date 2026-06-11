/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Load local environmental variables if they exist
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parsing support
  app.use(express.json());

  // 1. Core Config Endpoint for dynamic runtime variables injection
  app.get("/api/config", (req, res) => {
    res.json({
      firebaseApiKey: process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || "",
      firebaseAuthDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || "",
      firebaseProjectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "",
      firebaseStorageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || "",
      firebaseMessagingSenderId: process.env.VITE_FIREBASE_MESSAGES_SENDER_ID || process.env.FIREBASE_MESSAGES_SENDER_ID || "",
      firebaseAppId: process.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || "",
    });
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // 2. Vite Dev Middleware Integration / Static Production Serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
