interface TypingControls {
  status: "idle" | "typing" | "complete";
  typeChar: (char: string) => void;
  backspace: () => void;
}

interface RoundActions {
  cycle: () => void;
  restart: () => void;
  next: () => void;
}

export function handleTypingKey(
  event: KeyboardEvent,
  typing: TypingControls,
  actions: RoundActions,
  handledFlag: { current: boolean },
): boolean {
  handledFlag.current = false;
  if (event.metaKey || event.ctrlKey || event.altKey || event.isComposing) return false;

  if (event.key === "Tab") {
    actions.cycle();
    return true;
  }
  if (event.key === "Escape") {
    actions.restart();
    return true;
  }
  if (typing.status === "complete") {
    if (event.key === "Enter" || event.key === " ") {
      actions.next();
      return true;
    }
    return false;
  }
  if (event.key === "Backspace") {
    typing.backspace();
    return true;
  }
  if (event.key === "Enter") {
    handledFlag.current = true;
    typing.typeChar("\n");
    return true;
  }
  if (event.key.length === 1) {
    handledFlag.current = true;
    typing.typeChar(event.key);
    return true;
  }
  return false;
}
