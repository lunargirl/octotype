import { useEffect } from "react";
import { PageFrame } from "../components/PageFrame.tsx";
import { VocabularyPanel } from "../components/VocabularyPanel.tsx";
import { useStats } from "../hooks/useStats.ts";
import { useVocabulary } from "../hooks/useVocabulary.ts";

export function Vocabulary() {
  const vocabulary = useVocabulary();
  const { stats } = useStats();

  useEffect(() => {
    document.title = "Vocabulary · Octotype";
  }, []);

  return (
    <PageFrame route="vocabulary" wpm={stats.rounds > 0 ? stats.bestWpm : null} accuracy={stats.rounds > 0 ? stats.bestAccuracy : null}>
      <VocabularyPanel
        records={vocabulary.records}
        learned={vocabulary.learned}
        review={vocabulary.review}
        discovered={vocabulary.discovered}
      />
    </PageFrame>
  );
}
