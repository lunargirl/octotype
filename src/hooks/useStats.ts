import { useCallback, useState } from "react";
import type { RoundSnapshot, StatsData } from "../types.ts";
import { loadStats, recordRound } from "../utils/storage.ts";

export function useStats() {
  const [stats, setStats] = useState<StatsData>(() => loadStats());
  const record = useCallback((snapshot: RoundSnapshot) => {
    setStats(recordRound(snapshot));
  }, []);
  return { stats, record };
}
