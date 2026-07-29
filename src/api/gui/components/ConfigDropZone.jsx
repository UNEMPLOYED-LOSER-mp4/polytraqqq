import { useState } from "react";
import { polyfly } from "../../polyfly.js";
import { parseSettingsJson } from "../../storage.js";
import { UploadIcon } from "../icons/index.jsx";

export function ConfigDropZone() {
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState(null);

  const handleText = (raw) => {
    const res = parseSettingsJson(raw);
    if (!res.ok) {
      setStatus({ ok: false, msg: res.error });
      return;
    }
    const { applied, skipped } = polyfly.applyImportedSettings(res.data);
    setStatus({ ok: true, msg: `Imported ${applied} value${applied === 1 ? "" : "s"}` + (skipped ? `, skipped ${skipped}` : "") });
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => handleText(String(reader.result || ""));
      reader.onerror = () => setStatus({ ok: false, msg: "Could not read file" });
      reader.readAsText(file);
      return;
    }
    const text = e.dataTransfer && e.dataTransfer.getData("text");
    if (text) handleText(text);
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
        onDrop={onDrop}
        className={
          "flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-lg border-2 border-dashed transition-colors " +
          (dragOver ? "border-pf-accent/70 bg-pf-accent/10" : "border-white/15 bg-black/20")
        }
      >
        <UploadIcon size={22} className="text-pf-text-dim" />
        <span className="text-[13px] text-pf-text-dim text-center">drop config .json here</span>
      </div>
      <textarea
        placeholder="…or paste JSON and press Enter"
        spellCheck={false}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            handleText(e.currentTarget.value);
          }
        }}
        onKeyUp={(e) => e.stopPropagation()}
        className="w-full h-20 px-2 py-1.5 rounded bg-black/30 border border-white/10 font-mono text-[11px] text-pf-text resize-none outline-none focus:border-pf-accent/45"
      />
      <div className="text-[10px] text-pf-text-dim/70">⌘/Ctrl + Enter to import pasted text</div>
      {status && (
        <div className={"text-[12px] " + (status.ok ? "text-pf-accent" : "text-red-400")}>
          {status.msg}
        </div>
      )}
    </div>
  );
}