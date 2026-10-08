export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function formatWpm(wpm: number | null): string {
  if (wpm == null || !Number.isFinite(wpm) || wpm <= 0) return "—";
  return String(Math.round(wpm));
}

export function formatAccuracy(accuracy: number | null): string {
  if (accuracy == null || !Number.isFinite(accuracy)) return "—";
  return `${(accuracy * 100).toFixed(1)}%`;
}

export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export function formatCount(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function displayText(text: string): string {
  return text.replaceAll(" -- ", " — ").replaceAll("'", "\u2019");
}
