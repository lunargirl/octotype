import { useCallback, useState } from "react";
import type { DictionaryEntry, VocabRecord, VocabStatus } from "../types.ts";
import { discoverWord, loadVocab, markWord } from "../utils/storage.ts";

export function useVocabulary() {
  const [vocab, setVocab] = useState<Record<string, VocabRecord>>(() => loadVocab());

  const refresh = useCallback(() => {
    setVocab(loadVocab());
  }, []);

  const discover = useCallback(
    (entry: DictionaryEntry) => {
      discoverWord(entry);
      refresh();
    },
    [refresh],
  );

  const mark = useCallback(
    (entry: DictionaryEntry, status: Exclude<VocabStatus, "discovered">) => {
      markWord(entry, status);
      refresh();
    },
    [refresh],
  );

  const records = Object.values(vocab).sort((a, b) => b.updatedAt - a.updatedAt);
  return {
    vocab,
    records,
    learned: records.filter((record) => record.status === "learned").length,
    review: records.filter((record) => record.status === "review").length,
    discovered: records.length,
    discover,
    mark,
  };
}
