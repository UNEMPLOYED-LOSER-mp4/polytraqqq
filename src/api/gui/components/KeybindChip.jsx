import { shortenKey } from "../util.js";

export function KeybindChip({ name, currentKey, isListening, onStartRebind, onClear }) {
  const display = isListening
    ? "press any key (Esc cancel · Backspace clear)"
    : (currentKey ? shortenKey(currentKey) : "unbound");
  return (
    <div className="flex gap-1.5 items-center">
      <div
        onClick={(e) => { e.stopPropagation(); onStartRebind(name); }}
        className={
          "flex-1 px-3 py-1.5 rounded text-[12px] cursor-pointer select-none border " +
          (isListening
            ? "bg-pf-accent text-white border-pf-accent animate-pf-pulse"
            : "bg-white/5 text-pf-text border-white/10 hover:bg-white/10")
        }
      >
        {display}
      </div>
      {currentKey && !isListening && (
        <div
          onClick={(e) => { e.stopPropagation(); onClear(name); }}
          title="Clear binding"
          className="px-2.5 py-1 rounded cursor-pointer text-pf-text-dim bg-white/5 hover:text-pf-accent hover:bg-pf-accent/10 text-[15px] leading-none select-none"
        >
          ×
        </div>
      )}
    </div>
  );
}