import { useState } from "react";
import type { VocabRecord, VocabStatus } from "../types.ts";
import { cx, displayText } from "../utils/format.ts";

const FILTERS: Array<{ id: VocabStatus; label: string }> = [
  { id: "learned", label: "Learned" },
  { id: "review", label: "To review" },
  { id: "discovered", label: "Discovered" },
];

export function VocabularyPanel({
  records,
  learned,
  review,
  discovered,
}: {
  records: VocabRecord[];
  learned: number;
  review: number;
  discovered: number;
}) {
  const [filter, setFilter] = useState<VocabStatus>("discovered");
  const counts: Record<VocabStatus, number> = { learned, review, discovered };
  const shown = records.filter((record) => filter === "discovered" || record.status === filter);

  return (
    <section>
      <div className="grid grid-cols-3 gap-4 border-b border-rule pb-6">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="min-h-11 text-left"
            aria-pressed={filter === item.id}
            onClick={() => setFilter(item.id)}
          >
            <span className={cx("block font-mono text-[11px] uppercase tracking-[0.16em]", filter === item.id ? "text-ink" : "text-soft")}>
              {item.label}
            </span>
            <span className="mt-2 block font-mono text-3xl tabular-nums">{counts[item.id]}</span>
          </button>
        ))}
      </div>
      {shown.length === 0 ? (
        <p className="mt-10 font-serif text-lg text-soft">Words you finish will gather here.</p>
      ) : (
        <ul>
          {shown.map((record) => (
            <li key={record.id} className="border-b border-rule py-6">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-display text-2xl font-medium uppercase tracking-[0.12em]">{record.word}</h2>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-soft">{record.status}</span>
              </div>
              <p className="mt-2 font-serif italic text-soft">{record.partOfSpeech}</p>
              <p className="mt-3 max-w-lg font-serif text-lg leading-relaxed">{displayText(record.definition)}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
