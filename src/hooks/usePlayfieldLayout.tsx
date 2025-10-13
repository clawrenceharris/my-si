import { useCallback, useState } from "react";

type LayoutState = "idle" | "expanded" | "ended";

export interface UsePlayfieldLayoutReturn {
  state: LayoutState;
  prev: LayoutState;
  expandPlayfield: () => void;
  endPlayfield: () => void;
  reset: () => void;
}

export function usePlayfieldLayout(): UsePlayfieldLayoutReturn {
  const [state, setState] = useState<LayoutState>("idle");
  const [prev, setPrev] = useState<LayoutState>("idle");

  const transition = useCallback(
    (next: LayoutState) => {
      setPrev(state);
      setState(next);
    },
    [state]
  );

  return {
    state,
    prev,
    expandPlayfield: () => transition("expanded"),
    endPlayfield: () => transition("ended"),
    reset: () => transition("idle"),
  };
}
