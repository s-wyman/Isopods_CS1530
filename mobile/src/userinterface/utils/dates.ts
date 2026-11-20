/**
 * Converts between the backend's ISO dates, such as "2026-11-20", and local Date objects.
 * Dates are built from their parts because parsing an ISO string directly treats it as UTC
 * and can shift it by a day.
 */

export function parseIsoDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function formatDate(isoDate: string): string {
  return parseIsoDate(isoDate).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}