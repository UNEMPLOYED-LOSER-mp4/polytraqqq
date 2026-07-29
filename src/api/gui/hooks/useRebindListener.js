import { useEffect, useRef } from "react";
import { keybinds } from "../../keybinds.js";

export function useRebindListener(listeningFor, setListeningFor) {
  const ref = useRef(listeningFor);
  ref.current = listeningFor;
  useEffect(() => {
    function onKey(e) {
      if (!ref.current) return;
      e.preventDefault();
      e.stopPropagation();
      const target = ref.current;
      if (e.code === "Escape") {

      } else if (e.code === "Backspace") {
        keybinds.clear(target);
      } else {
        keybinds.set(target, e.code);
      }
      setListeningFor(null);
    }
    addEventListener("keydown", onKey, true);
    return () => removeEventListener("keydown", onKey, true);
  }, [setListeningFor]);
}
