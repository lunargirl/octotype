import type { DictionaryEntry } from "../types.ts";
import { cx, displayText } from "../utils/format.ts";

export function DictionaryEntry({ entry, dimmed }: { entry: DictionaryEntry; dimmed?: boolean }) {
  return (
    <article
      className={cx("text-center transition-opacity duration-500", dimmed && "opacity-40")}
      data-testid="dictionary-entry"
    >
      <h1 className="font-display text-[2.6rem] font-medium uppercase leading-none tracking-[0.14em] sm:text-6xl">
        {entry.word}
      </h1>
      <p className="mt-6 font-serif text-lg italic text-soft">{entry.partOfSpeech}</p>
      <p className="mt-1 font-mono text-sm tracking-wide text-soft">{entry.pronunciation}</p>
      <p className="mx-auto mt-7 max-w-md text-balance font-serif text-xl leading-relaxed">
        {displayText(entry.definition)}
      </p>
      {entry.example ? (
        <p className="mx-auto mt-4 max-w-md text-balance font-serif text-lg italic leading-relaxed text-soft">
          “{displayText(entry.example)}”
        </p>
      ) : null}
    </article>
  );
}
