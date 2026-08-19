"use client";

import { useEffect, type ReactNode } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  hideClose?: boolean;
}

export function Modal({ open, onClose, title, children, hideClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !hideClose) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, hideClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      onClick={() => !hideClose && onClose()}
    >
      <div
        className="w-full max-w-md rounded-t-3xl bg-card p-6 text-card-foreground shadow-2xl animate-fade-in sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {(title || !hideClose) && (
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">{title}</h3>
            {!hideClose && (
              <button
                onClick={onClose}
                aria-label="إغلاق"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-secondary"
              >
                ✕
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
