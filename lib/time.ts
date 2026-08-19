// Egypt-timezone aware date keys (Africa/Cairo).
// Used for daily task reset and monthly points reset.

const CAIRO = "Africa/Cairo";

function cairoParts(d: Date = new Date()) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: CAIRO,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = fmt.formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value || "";
  return { y: get("year"), m: get("month"), day: get("day") };
}

/** e.g. "2026-08-19" in Cairo time */
export function cairoDayKey(d: Date = new Date()): string {
  const { y, m, day } = cairoParts(d);
  return `${y}-${m}-${day}`;
}

/** e.g. "2026-08" in Cairo time */
export function cairoMonthKey(d: Date = new Date()): string {
  const { y, m } = cairoParts(d);
  return `${y}-${m}`;
}
