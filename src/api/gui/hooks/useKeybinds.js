import { useEffect, useState, useCallback } from "react";
import { keybinds } from "../../keybinds.js";

export function useKeybinds() {
  const [, forceRender] = useState(0);
  useEffect(() => keybinds.onChange(() => forceRender(n => n + 1)), []);
  const get = useCallback(name => keybinds.get(name), []);
  return {
    get,
    set: keybinds.set.bind(keybinds),
    clear: keybinds.clear.bind(keybinds),
  };
}
