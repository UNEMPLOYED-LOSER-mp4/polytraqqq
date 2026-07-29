import { useState, useEffect } from "react";

export function useMenuToggle(keyCode, disabled = false) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onKey(e) {
      if (disabled) return;
      const el = e.target;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable)) return;
      if (e.code === keyCode) {
        e.preventDefault();
        e.stopPropagation();
        setVisible(v => !v);
      }
    }
    addEventListener("keydown", onKey, true);
    return () => removeEventListener("keydown", onKey, true);
  }, [keyCode, disabled]);

  return visible;
}
