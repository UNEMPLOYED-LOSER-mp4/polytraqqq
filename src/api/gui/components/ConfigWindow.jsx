import { useState } from "react";
import { exportSettingsJson } from "../../storage.js";
import { ConfigDropZone } from "./ConfigDropZone.jsx";
import { CopyIcon } from "../icons/index.jsx";

export function ConfigWindow({ features, state, winWidth }) {
  const [copied, setCopied] = useState(false);
  const w = winWidth ? winWidth() : 300;

  const total = Object.keys(features).length;
  const active = Object.values(state).filter((s) => s && typeof s === "object" && s.active).length;

  const onExport = async () => {
    const json = exportSettingsJson();
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch (_) {
      const ta = document.createElement("textarea");
      ta.value = json;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); setCopied(true); setTimeout(() => setCopied(false), 1400); } catch (__) {}
      document.body.removeChild(ta);
    }
  };

  return (
    <div
      className="pf-panel-glow pointer-events-auto absolute left-1/2 -translate-x-1/2 top-20 flex flex-col rounded-xl overflow-hidden bg-pf-panel/95 border border-pf-panel-border/30 backdrop-blur-md animate-pf-pop-in"
      style={{ zIndex: 99998, width: `min(${w}px, calc(100vw - 32px))`, maxHeight: "calc(100dvh - 110px)" }}
    >
      <div className="flex items-center gap-2.5 px-4 h-12 shrink-0 select-none bg-gradient-to-b from-pf-accent/35 to-pf-accent/10 border-b border-pf-accent/30">
        <span className="text-[17px] font-semibold tracking-wide text-white flex-1">Config</span>
        <span className="text-[12px] font-mono text-pf-accent">{active}/{total}</span>
      </div>

      <div className="pf-scroll overflow-y-auto p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-[12px] text-pf-text-dim">Export</span>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={onExport}
            className="flex items-center justify-center gap-2 px-3 h-9 rounded-lg bg-pf-accent/20 border border-pf-accent/40 text-[13px] text-white hover:bg-pf-accent/30 transition-colors"
          >
            <CopyIcon size={15} className="text-pf-accent" />
            {copied ? "Copied!" : "Copy config to clipboard"}
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[12px] text-pf-text-dim">Import</span>
          <ConfigDropZone />
        </div>
      </div>
    </div>
  );
}