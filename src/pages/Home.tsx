import { useEffect, useRef, useState } from "react";
import { DictionaryEntry } from "../components/DictionaryEntry.tsx";
import { ModeSelector } from "../components/ModeSelector.tsx";
import { PageFrame } from "../components/PageFrame.tsx";
import { ResultCard } from "../components/ResultCard.tsx";
import { ShortcutHint } from "../components/ShortcutHint.tsx";
import { TypingArea } from "../components/TypingArea.tsx";
import { useStats } from "../hooks/useStats.ts";
import { useTyping } from "../hooks/useTyping.ts";
import { useVocabulary } from "../hooks/useVocabulary.ts";
import { MODES, type Mode } from "../types.ts";
import { handleTypingKey } from "../utils/keyboard.ts";
import { discoverWord, loadMode, loadRecent, saveMode, saveRecent } from "../utils/storage.ts";
import { buildTarget, createInitialRound, pickEntry } from "../utils/targets.ts";

const recordedRounds = new Set<string>();

export function Home() {
  const { record } = useStats();
  const vocabulary = useVocabulary();
  const [mode, setMode] = useState<Mode>(() => loadMode());
  const [round, setRound] = useState(() => createInitialRound(loadMode(), loadRecent()));
  const [resetKey, setResetKey] = useState(0);
  const target = buildTarget(round.entry, mode);
  const typing = useTyping(target, resetKey);
  const captureRef = useRef<HTMLTextAreaElement>(null);
  const handledFlag = useRef(false);
  const typingRef = useRef(typing);
  const actionsRef = useRef<{ cycle: () => void; restart: () => void; next: () => void }>({
    cycle: () => undefined,
    restart: () => undefined,
    next: () => undefined,
  });
  useEffect(() => {
    saveRecent(round.recent);
  }, [round]);

  useEffect(() => {
    document.title = "Octotype";
    captureRef.current?.focus({ preventScroll: true });
  }, [round, resetKey, mode]);

  function changeMode(nextMode: Mode) {
    saveMode(nextMode);
    setMode(nextMode);
    setRound(pickEntry({ mode: nextMode, recent: loadRecent(), avoidId: round.entry.id }));
    setResetKey((key) => key + 1);
  }

  function cycle() {
    changeMode(MODES[(MODES.indexOf(mode) + 1) % MODES.length]);
  }

  function restart() {
    setResetKey((key) => key + 1);
  }

  function next() {
    setRound(pickEntry({ mode, recent: loadRecent(), avoidId: round.entry.id }));
    setResetKey((key) => key + 1);
  }

  useEffect(() => {
    typingRef.current = typing;
    actionsRef.current = { cycle, restart, next };
  });

  useEffect(() => {
    const current = typingRef.current;
    if (current.status !== "complete" || current.startedAt == null || current.target !== target) return;
    const token = `${round.entry.id}:${resetKey}:${current.startedAt}`;
    if (recordedRounds.has(token)) return;
    recordedRounds.add(token);
    record({
      wpm: current.wpm,
      accuracy: current.accuracy ?? 0,
      errors: current.errors,
      charactersTyped: current.charactersTyped,
      correctCharacters: current.correctCharacters,
      incorrectCharacters: current.incorrectCharacters,
      elapsedMs: current.elapsedMs,
      mode,
      wordId: round.entry.id,
      word: round.entry.word,
    });
    discoverWord(round.entry);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("round-result")?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "nearest",
    });
  }, [typing.status, target, resetKey, round.entry, mode, record]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const targetNode = event.target;
      const field = captureRef.current;
      if (targetNode instanceof HTMLElement && targetNode !== field) {
        if (targetNode.closest("a, button, input, textarea, select")) return;
      }
      if (handleTypingKey(event, typingRef.current, actionsRef.current, handledFlag)) {
        event.preventDefault();
      }
    };
    const onBeforeInput = (event: InputEvent) => {
      if (event.isComposing) return;
      if (handledFlag.current) {
        handledFlag.current = false;
        event.preventDefault();
        return;
      }
      const typing = typingRef.current;
      const actions = actionsRef.current;
      if (event.inputType === "insertLineBreak") {
        event.preventDefault();
        if (typing.status === "complete") actions.next();
        else typing.typeChar("\n");
        return;
      }
      if (event.inputType === "deleteContentBackward") {
        event.preventDefault();
        if (typing.status !== "complete") typing.backspace();
        return;
      }
      if (event.inputType === "insertText" && event.data) {
        event.preventDefault();
        if (typing.status === "complete") {
          if (event.data === " ") actions.next();
          return;
        }
        for (const char of event.data) typing.typeChar(char);
      }
    };
    const field = captureRef.current;
    window.addEventListener("keydown", onKeyDown);
    field?.addEventListener("beforeinput", onBeforeInput);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      field?.removeEventListener("beforeinput", onBeforeInput);
    };
  }, []);

  const complete = typing.status === "complete";

  return (
    <PageFrame
      route="home"
      wpm={typing.status === "idle" ? null : typing.wpm}
      accuracy={typing.status === "idle" ? null : typing.accuracy}
    >
      <div
        onPointerDown={(event) => {
          const node = event.target;
          if (node instanceof HTMLElement && node.closest("a, button")) return;
          captureRef.current?.focus({ preventScroll: true });
        }}
      >
        <ModeSelector mode={mode} onChange={changeMode} />
        <div className="rise-in mt-14 sm:mt-16" key={`${round.entry.id}:${mode}:${resetKey}`}>
          <DictionaryEntry entry={round.entry} dimmed={complete} />
          <div className="my-10 h-px bg-rule" />
          <TypingArea
            target={typing.target}
            marks={typing.marks}
            index={typing.index}
            complete={complete}
            completion={typing.completion}
            dimmed={complete}
          />
          {complete ? (
            <div id="round-result">
              <ResultCard
                wpm={typing.wpm}
                accuracy={typing.accuracy}
                errors={typing.errors}
                entry={round.entry}
                initialStatus={vocabulary.vocab[round.entry.id]?.status}
                onMark={(status) => vocabulary.mark(round.entry, status)}
              />
            </div>
          ) : null}
        </div>
        <ShortcutHint />
        <textarea
          ref={captureRef}
          aria-label="Typing input"
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          className="pointer-events-none fixed top-0 left-0 h-px w-px opacity-0"
          style={{ fontSize: 16 }}
          onInput={(event) => {
            event.currentTarget.value = "";
          }}
          onPaste={(event) => event.preventDefault()}
        />
      </div>
    </PageFrame>
  );
}
