"use client";

import { useEffect, useState } from "react";
import { subscribe, type ToastItem } from "@/lib/toast";

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => subscribe(setItems), []);

  return (
    <div className="fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 pointer-events-none">
      {items.map((t) => (
        <div
          key={t.id}
          role="status"
          className={[
            "pointer-events-auto w-full max-w-sm rounded-xl px-4 py-3 text-sm font-medium shadow-lg animate-fade-in",
            t.variant === "success" && "bg-success text-success-foreground",
            t.variant === "error" && "bg-destructive text-destructive-foreground",
            t.variant === "info" && "bg-card text-card-foreground border",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
