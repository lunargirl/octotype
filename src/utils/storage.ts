import { MODES, type Mode, type StatsData, type VocabRecord, type VocabStatus, type DictionaryEntry, type RoundSnapshot } from "../types.ts";

const RECENT_KEY = "octotype:recent";
const VOCAB_KEY = "octotype:vocab";
const STATS_KEY = "octotype:stats";
const MODE_KEY = "octotype:mode";
const SESSION_KEY = "octotype:session";

export const emptyStats = (): StatsData => ({
  bestWpm: 0,
  wpmSum: 0,
  rounds: 0,
  bestAccuracy: 0,
  wordIds: [],
  totalCharactersTyped: 0,
  totalTypingMs: 0,
  sessions: 0,
  recent: [],
});

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadRecent(): string[] {
  const value = readJson<unknown>(RECENT_KEY, []);
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

export function saveRecent(ids: string[]): void {
  localStorage.setItem(RECENT_KEY, JSON.stringify(ids.slice(-500)));
}

export function loadVocab(): Record<string, VocabRecord> {
  const value = readJson<unknown>(VOCAB_KEY, {});
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, VocabRecord>;
}

export function saveVocab(vocab: Record<string, VocabRecord>): void {
  localStorage.setItem(VOCAB_KEY, JSON.stringify(vocab));
}

export function loadMode(): Mode {
  const value = localStorage.getItem(MODE_KEY);
  if (value && (MODES as readonly string[]).includes(value)) return value as Mode;
  return "everything";
}

export function saveMode(mode: Mode): void {
  localStorage.setItem(MODE_KEY, mode);
}

export function loadStats(): StatsData {
  const value = readJson<Partial<StatsData>>(STATS_KEY, {});
  return {
    ...emptyStats(),
    ...value,
    wordIds: Array.isArray(value.wordIds) ? value.wordIds : [],
    recent: Array.isArray(value.recent) ? value.recent : [],
  };
}

export function saveStats(stats: StatsData): void {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function loadReviewIds(): string[] {
  return Object.values(loadVocab())
    .filter((record) => record.status === "review")
    .map((record) => record.id);
}

export function discoverWord(entry: DictionaryEntry): void {
  const vocab = loadVocab();
  const existing = vocab[entry.id];
  if (existing) return;
  vocab[entry.id] = {
    id: entry.id,
    word: entry.word,
    partOfSpeech: entry.partOfSpeech,
    definition: entry.definition,
    status: "discovered",
    updatedAt: Date.now(),
  };
  saveVocab(vocab);
}

export function markWord(entry: DictionaryEntry, status: Exclude<VocabStatus, "discovered">): void {
  const vocab = loadVocab();
  vocab[entry.id] = {
    id: entry.id,
    word: entry.word,
    partOfSpeech: entry.partOfSpeech,
    definition: entry.definition,
    status,
    updatedAt: Date.now(),
  };
  saveVocab(vocab);
}

export function recordRound(snapshot: RoundSnapshot): StatsData {
  const stats = loadStats();
  if (!sessionStorage.getItem(SESSION_KEY)) {
    sessionStorage.setItem(SESSION_KEY, "1");
    stats.sessions += 1;
  }
  const accuracy = snapshot.accuracy ?? 0;
  stats.rounds += 1;
  stats.wpmSum += snapshot.wpm;
  stats.bestWpm = Math.max(stats.bestWpm, snapshot.wpm);
  stats.bestAccuracy = Math.max(stats.bestAccuracy, accuracy);
  if (!stats.wordIds.includes(snapshot.wordId)) stats.wordIds.push(snapshot.wordId);
  stats.totalCharactersTyped += snapshot.charactersTyped;
  stats.totalTypingMs += snapshot.elapsedMs;
  stats.recent = [
    ...stats.recent,
    {
      wpm: snapshot.wpm,
      accuracy,
      at: Date.now(),
      word: snapshot.word,
      mode: snapshot.mode,
    },
  ].slice(-40);
  saveStats(stats);
  return stats;
}
