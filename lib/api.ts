"use client";

import { auth } from "@/lib/firebase/client";

export interface ApiError {
  error: string;
}

/**
 * Authenticated fetch to our Next.js server routes.
 * Attaches the current Firebase ID token as a Bearer token.
 */
export async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : null;

  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // ignore
  }

  if (!res.ok) {
    const message =
      (data && (data.error as string)) || "حدث خطأ في الخادم، حاول مرة أخرى.";
    throw new Error(message);
  }
  return data as T;
}
