export const MODES = [
  "definition",
  "example",
  "dictionary",
  "everything",
  "punctuation",
] as const;

export type Mode = (typeof MODES)[number];

export const MODE_LABELS: Record<Mode, string> = {
  definition: "Definition",
  example: "Example",
  dictionary: "Dictionary",
  everything: "Everything",
  punctuation: "Punctuation",
};

export type CharacterState = "untyped" | "correct" | "incorrect" | "current";

export type Mark = "correct" | "incorrect" | null;

export type VocabStatus = "learned" | "review" | "discovered";

export type Route = "home" | "vocabulary" | "stats";

export interface DictionaryEntry {
  id: string;
  word: string;
  partOfSpeech: string;
  pronunciation: string;
  pronunciationAscii: string;
  definition: string;
  example?: string;
  synonyms?: string[];
  etymology?: string;
  punctuation?: string;
}

export interface VocabRecord {
  id: string;
  word: string;
  partOfSpeech: string;
  definition: string;
  status: VocabStatus;
  updatedAt: number;
}

export interface RecentScore {
  wpm: number;
  accuracy: number;
  at: number;
  word: string;
  mode: Mode;
}

export interface StatsData {
  bestWpm: number;
  wpmSum: number;
  rounds: number;
  bestAccuracy: number;
  wordIds: string[];
  totalCharactersTyped: number;
  totalTypingMs: number;
  sessions: number;
  recent: RecentScore[];
}

export interface RoundSnapshot {
  wpm: number;
  accuracy: number;
  errors: number;
  charactersTyped: number;
  correctCharacters: number;
  incorrectCharacters: number;
  elapsedMs: number;
  mode: Mode;
  wordId: string;
  word: string;
}
