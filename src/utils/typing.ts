import type { CharacterState, Mark } from "../types.ts";

const PUNCTUATION = new Set([
  ",",
  ".",
  ";",
  ":",
  "(",
  ")",
  '"',
  "'",
  "-",
  "/",
  "?",
  "!",
]);

export function isPunctuationChar(char: string): boolean {
  return PUNCTUATION.has(char);
}

export function wpm(correctCharacters: number, elapsedMs: number): number {
  if (elapsedMs <= 0 || correctCharacters <= 0) return 0;
  return correctCharacters / 5 / (elapsedMs / 60_000);
}

export function accuracy(
  correctKeystrokes: number,
  charactersTyped: number,
): number | null {
  if (charactersTyped <= 0) return null;
  return correctKeystrokes / charactersTyped;
}

export function characterState(
  index: number,
  cursor: number,
  marks: Mark[],
  complete: boolean,
): CharacterState {
  if (complete || index < cursor) {
    return marks[index] === "incorrect" ? "incorrect" : "correct";
  }
  if (index === cursor) return "current";
  return "untyped";
}

export function countCorrect(marks: Mark[]): number {
  let count = 0;
  for (const mark of marks) {
    if (mark === "correct") count += 1;
  }
  return count;
}
