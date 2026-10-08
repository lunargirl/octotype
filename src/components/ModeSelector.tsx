import { MODE_LABELS, MODES, type Mode } from "../types.ts";
import { cx } from "../utils/format.ts";

export function ModeSelector({ mode, onChange }: { mode: Mode; onChange: (mode: Mode) => void }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-5 gap-y-3" role="tablist" aria-label="Typing mode">
      {MODES.map((item) => (
        <button
          key={item}
          type="button"
          role="tab"
          aria-selected={item === mode}
          data-testid={`mode-${item}`}
          className={cx(
            "min-h-11 border-b pb-1 font-mono text-[11px] uppercase tracking-[0.16em]",
            item === mode ? "border-ink text-ink" : "border-transparent text-soft",
          )}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onChange(item)}
        >
          {MODE_LABELS[item]}
        </button>
      ))}
    </div>
  );
}
