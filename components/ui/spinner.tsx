export function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent ${className}`}
      role="status"
      aria-label="جارٍ التحميل"
    />
  );
}

export function FullPageSpinner({ label = "جارٍ التحميل..." }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-muted-foreground">
      <Spinner className="h-8 w-8" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
