import { useEffect } from "react";
import { PageFrame } from "../components/PageFrame.tsx";
import { useStats } from "../hooks/useStats.ts";
import { useVocabulary } from "../hooks/useVocabulary.ts";
import { formatAccuracy, formatCount, formatDuration, formatWpm } from "../utils/format.ts";

export function Stats() {
  const { stats } = useStats();
  const { learned } = useVocabulary();
  const average = stats.rounds > 0 ? stats.wpmSum / stats.rounds : null;

  useEffect(() => {
    document.title = "Stats · Octotype";
  }, []);

  const rows = [
    ["Best pace", stats.rounds > 0 ? `${formatWpm(stats.bestWpm)} WPM` : "—"],
    ["Average pace", average == null ? "—" : `${formatWpm(average)} WPM`],
    ["Best accuracy", stats.rounds > 0 ? formatAccuracy(stats.bestAccuracy) : "—"],
    ["Words encountered", formatCount(stats.wordIds.length)],
    ["Characters typed", formatCount(stats.totalCharactersTyped)],
    ["Time typing", formatDuration(stats.totalTypingMs)],
    ["Sessions", formatCount(stats.sessions)],
    ["Learned", formatCount(learned)],
  ];

  return (
    <PageFrame route="stats" wpm={stats.rounds > 0 ? stats.bestWpm : null} accuracy={stats.rounds > 0 ? stats.bestAccuracy : null}>
      <section>
        <h1 className="font-display text-4xl font-medium tracking-wide">Stats</h1>
        <dl className="mt-10">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-6 border-t border-rule py-4">
              <dt className="font-serif text-lg">{label}</dt>
              <dd className="font-mono text-sm tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-12 border-t border-rule pt-8">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-soft">Recent pace</h2>
          <Sparkline scores={stats.recent.map((score) => score.wpm)} />
        </div>
      </section>
    </PageFrame>
  );
}

function Sparkline({ scores }: { scores: number[] }) {
  if (scores.length < 2) {
    return <p className="mt-6 font-serif text-lg text-soft">A line appears after two finished passages.</p>;
  }

  const width = 560;
  const height = 96;
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const span = max - min || 1;
  const points = scores
    .map((score, index) => {
      const x = (index / (scores.length - 1)) * width;
      const y = height - 10 - ((score - min) / span) * (height - 20);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="mt-6 h-24 w-full text-ink"
      role="img"
      aria-label="Recent words per minute"
    >
      <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points={points} />
    </svg>
  );
}
