import type { Mark } from "../types.ts";
import { cx } from "../utils/format.ts";
import { characterState, isPunctuationChar } from "../utils/typing.ts";

export function TypingArea({
  target,
  marks,
  index,
  complete,
  completion,
  dimmed,
}: {
  target: string;
  marks: Mark[];
  index: number;
  complete: boolean;
  completion: number;
  dimmed?: boolean;
}) {
  return (
    <div className={cx("select-none transition-opacity duration-500", dimmed && "opacity-40")} data-testid="typing-area">
      <p
        className="whitespace-pre-wrap break-words font-mono text-base leading-8 sm:text-lg sm:leading-9"
        data-target={target}
        aria-label="Typing target"
      >
        {Array.from(target).map((char, charIndex) => {
          const state = characterState(charIndex, index, marks, complete);
          if (char === "\n") {
            return (
              <span key={charIndex}>
                {state === "current" ? <span className="caret px-1 text-sm">↵</span> : null}
                {"\n"}
              </span>
            );
          }
          return (
            <span
              key={charIndex}
              className={cx(
                state === "correct" && "text-ink/40",
                state === "incorrect" && "text-error underline decoration-error/40 underline-offset-[6px]",
                state === "untyped" && (isPunctuationChar(char) ? "text-umber" : "text-ink"),
                state === "current" && "caret",
              )}
            >
              {char}
            </span>
          );
        })}
      </p>
      <div className="mt-8 h-px w-full bg-rule" aria-hidden="true">
        <div className="h-px bg-ink transition-[width] duration-150 ease-out" style={{ width: `${completion * 100}%` }} />
      </div>
    </div>
  );
}
