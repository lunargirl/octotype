import { dictionary } from "../data/dictionary.ts";
import type { DictionaryEntry, Mode } from "../types.ts";
import { loadReviewIds } from "./storage.ts";

export interface PickedEntry {
  entry: DictionaryEntry;
  recent: string[];
}

export function isEligible(entry: DictionaryEntry, mode: Mode): boolean {
  if (mode === "example") return Boolean(entry.example);
  if (mode === "punctuation") return Boolean(entry.punctuation);
  return true;
}

export function buildTarget(entry: DictionaryEntry, mode: Mode): string {
  switch (mode) {
    case "definition":
      return entry.definition;
    case "example":
      return entry.example ?? "";
    case "dictionary":
      return `${entry.word} -- ${entry.partOfSpeech} -- ${entry.definition}`;
    case "everything":
      return buildEverything(entry);
    case "punctuation":
      return entry.punctuation ?? "";
  }
}

function buildEverything(entry: DictionaryEntry): string {
  const lines = [
    entry.word.toUpperCase(),
    "",
    entry.partOfSpeech,
    `/${entry.pronunciationAscii}/`,
    "",
    entry.definition,
  ];
  if (entry.example) lines.push("", `"${entry.example}"`);
  if (entry.synonyms && entry.synonyms.length > 0) {
    lines.push("", `synonyms: ${entry.synonyms.join("; ")}`);
  }
  return lines.join("\n");
}

export function pickEntry(options: {
  mode: Mode;
  recent: string[];
  reviewIds?: string[];
  avoidId?: string;
}): PickedEntry {
  const reviewIds = options.reviewIds ?? loadReviewIds();
  let recent = [...options.recent];
  let pool = dictionary.filter(
    (entry) => isEligible(entry, options.mode) && entry.id !== options.avoidId,
  );
  if (pool.length === 0) pool = dictionary.filter((entry) => isEligible(entry, options.mode));

  let available = pool.filter((entry) => !recent.includes(entry.id));
  if (available.length < 10) {
    recent = recent.slice(-10);
    available = pool.filter((entry) => !recent.includes(entry.id));
    if (available.length === 0) available = pool;
  }

  const reviewPool = available.filter((entry) => reviewIds.includes(entry.id));
  const choicePool = reviewPool.length > 0 && Math.random() < 0.3 ? reviewPool : available;
  const entry = choicePool[Math.floor(Math.random() * choicePool.length)];
  return { entry, recent: [...recent, entry.id] };
}

let lastInitial: { at: number; mode: Mode; picked: PickedEntry } | null = null;

export function createInitialRound(mode: Mode, recent: string[]): PickedEntry {
  const now = Date.now();
  if (lastInitial && lastInitial.mode === mode && now - lastInitial.at < 80) {
    return lastInitial.picked;
  }
  const picked = pickEntry({ mode, recent });
  lastInitial = { at: now, mode, picked };
  return picked;
}
