"use client";

export type ToastVariant = "success" | "error" | "info";

export interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

type Listener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
const listeners = new Set<Listener>();
let counter = 0;

function emit() {
  for (const l of listeners) l([...toasts]);
}

export function subscribe(l: Listener) {
  listeners.add(l);
  l([...toasts]);
  return () => listeners.delete(l);
}

export function toast(message: string, variant: ToastVariant = "info") {
  const id = ++counter;
  toasts = [...toasts, { id, message, variant }];
  emit();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, 4000);
}

export const toastSuccess = (m: string) => toast(m, "success");
export const toastError = (m: string) => toast(m, "error");
export const toastInfo = (m: string) => toast(m, "info");
