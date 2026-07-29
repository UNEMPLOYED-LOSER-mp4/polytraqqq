import { ModuleRow } from "./ModuleRow.jsx";
import { CATEGORY_ICON } from "../icons/index.jsx";

export function CategoryWindow({
  category, features, state, kbds,
  listeningFor, setListeningFor,
  pos, zIndex, onTitleMouseDown, onRaise, registerNode, winWidth,
}) {
  const activeCount = features.filter((f) => state[f.name] && state[f.name].active).length;
  const Icon = CATEGORY_ICON[category];
  const w = winWidth ? winWidth() : 300;

  return (
    <div
      ref={(el) => registerNode(category, el)}
      onMouseDown={onRaise}
      className="pf-panel-glow pointer-events-auto absolute flex flex-col rounded-xl overflow-hidden bg-pf-panel/95 border border-pf-panel-border/30 backdrop-blur-md animate-pf-pop-in"
      style={{ left: pos.x, top: pos.y, zIndex: zIndex || 10, width: `min(${w}px, calc(100vw - 32px))`, maxHeight: "calc(100dvh - 80px)" }}
    >
      <div
        onMouseDown={onTitleMouseDown}
        className="pf-drag-handle flex items-center gap-2.5 px-4 h-12 shrink-0 select-none bg-gradient-to-b from-pf-accent/35 to-pf-accent/10 border-b border-pf-accent/30"
      >
        <Icon size={18} className="text-pf-accent shrink-0" />
        <span className="text-[17px] font-semibold tracking-wide text-white flex-1 min-w-0 truncate">
          {category}
        </span>
        {activeCount > 0 && (
          <span className="text-[12px] font-mono text-pf-accent leading-none px-2 py-1 rounded bg-pf-accent/15">
            {activeCount}
          </span>
        )}
      </div>

      <div className="pf-scroll overflow-y-auto py-1.5">
        {features.map((f) => (
          <ModuleRow
            key={f.name}
            feature={f}
            fs={state[f.name]}
            currentKey={kbds.get(f.name)}
            listeningFor={listeningFor}
            setListeningFor={setListeningFor}
            kbds={kbds}
          />
        ))}
      </div>
    </div>
  );
}