import type { Route } from "../types.ts";
import { cx, formatAccuracy, formatWpm } from "../utils/format.ts";

const LINKS: Array<{ href: string; route: Route; label: string }> = [
  { href: "#/", route: "home", label: "Type" },
  { href: "#/vocabulary", route: "vocabulary", label: "Vocabulary" },
  { href: "#/stats", route: "stats", label: "Stats" },
];

export function StatsBar({
  route,
  wpm,
  accuracy,
}: {
  route: Route;
  wpm: number | null;
  accuracy: number | null;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
      <div>
        <a href="#/" className="font-display text-lg font-medium tracking-[0.28em] sm:text-xl">
          OCTOTYPE
        </a>
        <nav className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em]">
          {LINKS.map((link) => (
            <a
              key={link.route}
              href={link.href}
              className={cx(
                "border-b pb-1",
                route === link.route ? "border-ink text-ink" : "border-transparent text-soft",
              )}
              aria-current={route === link.route ? "page" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="text-right font-mono tabular-nums">
        <p className="text-sm tracking-wide" data-testid="live-wpm">
          {wpm == null ? "—" : `${formatWpm(wpm)} WPM`}
        </p>
        <p className="mt-1 text-sm text-soft" data-testid="live-accuracy">
          {formatAccuracy(accuracy)}
        </p>
      </div>
    </header>
  );
}
