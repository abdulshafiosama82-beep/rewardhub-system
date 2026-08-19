import "server-only";
import {
  initializeApp,
  getApps,
  getApp,
  cert,
  type App,
} from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

/**
 * Firebase Admin SDK — runs ONLY on the server.
 * Requires a service account, provided via environment variables:
 *   FIREBASE_PROJECT_ID
 *   FIREBASE_CLIENT_EMAIL
 *   FIREBASE_PRIVATE_KEY   (with \n newlines escaped)
 *
 * Generate these in Firebase Console:
 *   Project Settings > Service accounts > Generate new private key
 */

let cached: { app: App; auth: Auth; db: Firestore } | null = null;

export function isAdminConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  );
}

export function getAdmin() {
  if (cached) return cached;

  if (!isAdminConfigured()) {
    throw new Error(
      "Firebase Admin غير مُهيّأ. أضف المتغيرات FIREBASE_PROJECT_ID و FIREBASE_CLIENT_EMAIL و FIREBASE_PRIVATE_KEY في إعدادات المشروع.",
    );
  }

  const privateKey = (process.env.FIREBASE_PRIVATE_KEY as string).replace(
    /\\n/g,
    "\n",
  );

  const app: App = getApps().length
    ? getApp()
    : initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID as string,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
          privateKey,
        }),
      });

  cached = {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
  };
  return cached;
}
