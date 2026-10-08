import { useEffect, useState } from "react";
import type { Mark } from "../types.ts";
import { accuracy, countCorrect, wpm } from "../utils/typing.ts";

interface TypingState {
  target: string;
  index: number;
  marks: Mark[];
  startedAt: number | null;
  endedAt: number | null;
  charactersTyped: number;
  correctKeystrokes: number;
  incorrectCharacters: number;
}

function createState(target: string): TypingState {
  return {
    target,
    index: 0,
    marks: Array.from({ length: target.length }, () => null),
    startedAt: null,
    endedAt: null,
    charactersTyped: 0,
    correctKeystrokes: 0,
    incorrectCharacters: 0,
  };
}

function typeInto(state: TypingState, char: string): TypingState {
  if (state.endedAt != null || state.index >= state.target.length) return state;
  const correct = char === state.target[state.index];
  const marks = state.marks.slice();
  marks[state.index] = correct ? "correct" : "incorrect";
  const index = state.index + 1;
  const now = Date.now();
  return {
    ...state,
    marks,
    index,
    startedAt: state.startedAt ?? now,
    endedAt: index >= state.target.length ? now : null,
    charactersTyped: state.charactersTyped + 1,
    correctKeystrokes: state.correctKeystrokes + (correct ? 1 : 0),
    incorrectCharacters: state.incorrectCharacters + (correct ? 0 : 1),
  };
}

function erase(state: TypingState): TypingState {
  if (state.endedAt != null || state.index === 0) return state;
  const marks = state.marks.slice();
  marks[state.index - 1] = null;
  return { ...state, index: state.index - 1, marks };
}

export function useTyping(target: string, resetKey: number) {
  const [state, setState] = useState(() => createState(target));
  const [generation, setGeneration] = useState({ target, resetKey });
  const [now, setNow] = useState(0);

  if (generation.target !== target || generation.resetKey !== resetKey) {
    setGeneration({ target, resetKey });
    setState(createState(target));
  }

  const status: "idle" | "typing" | "complete" =
    state.endedAt != null ? "complete" : state.startedAt != null ? "typing" : "idle";

  useEffect(() => {
    if (status !== "typing") return;
    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, 200);
    return () => window.clearInterval(id);
  }, [status]);

  const endStamp =
    state.endedAt ?? (state.startedAt != null && now >= state.startedAt ? now : state.startedAt);
  const elapsedMs = state.startedAt == null || endStamp == null ? 0 : endStamp - state.startedAt;
  const correctCharacters = countCorrect(state.marks);

  return {
    target: state.target,
    index: state.index,
    marks: state.marks,
    status,
    elapsedMs,
    charactersTyped: state.charactersTyped,
    correctCharacters,
    incorrectCharacters: state.incorrectCharacters,
    errors: state.incorrectCharacters,
    wpm: wpm(correctCharacters, elapsedMs),
    accuracy: accuracy(state.correctKeystrokes, state.charactersTyped),
    completion: state.target.length === 0 ? 0 : state.index / state.target.length,
    startedAt: state.startedAt,
    typeChar: (char: string) => setState((current) => typeInto(current, char)),
    backspace: () => setState((current) => erase(current)),
  };
}
