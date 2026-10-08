import { useState } from "react";
import type { DictionaryEntry, VocabStatus } from "../types.ts";
import { cx, displayText, formatAccuracy, formatWpm } from "../utils/format.ts";

export function ResultCard({
  wpm,
  accuracy,
  errors,
  entry,
  initialStatus,
  onMark,
}: {
  wpm: number;
  accuracy: number | null;
  errors: number;
  entry: DictionaryEntry;
  initialStatus?: VocabStatus;
  onMark: (status: Exclude<VocabStatus, "discovered">) => void;
}) {
  const [status, setStatus] = useState<VocabStatus | undefined>(initialStatus);

  function choose(next: Exclude<VocabStatus, "discovered">) {
    setStatus(next);
    onMark(next);
  }

  return (
    <section className="rise-in mt-12 text-center" data-testid="result" aria-live="polite">
      <p className="font-mono text-4xl tabular-nums" data-testid="result-wpm">
        {formatWpm(wpm)}
      </p>
      <p className="mt-3 font-mono text-sm text-soft">{formatAccuracy(accuracy)} accuracy</p>
      <p className="mt-1 font-mono text-sm text-soft">
        {errors} {errors === 1 ? "error" : "errors"}
      </p>
      <h2 className="mt-10 font-display text-3xl font-medium uppercase tracking-[0.14em]">{entry.word}</h2>
      <p className="mt-3 font-serif italic text-soft">{entry.partOfSpeech}</p>
      <p className="mx-auto mt-4 max-w-md text-balance font-serif text-lg leading-relaxed">
        {displayText(entry.definition)}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        <StatusButton pressed={status === "learned"} onClick={() => choose("learned")} testId="mark-learned">
          I know this
        </StatusButton>
        <StatusButton pressed={status === "review"} onClick={() => choose("review")} testId="mark-review">
          Show again
        </StatusButton>
      </div>
    </section>
  );
}

function StatusButton({
  pressed,
  onClick,
  testId,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  testId: string;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      data-testid={testId}
      className={cx(
        "min-h-11 border-b px-1 pb-1 font-mono text-[11px] uppercase tracking-[0.16em]",
        pressed ? "border-ink text-ink" : "border-transparent text-soft",
      )}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
