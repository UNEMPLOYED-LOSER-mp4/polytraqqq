import { useState, useEffect } from "react";
import { KEYS } from "../../config/keys.js";
import { usePolyflyState } from "./hooks/usePolyflyState.js";
import { useKeybinds } from "./hooks/useKeybinds.js";
import { useRebindListener } from "./hooks/useRebindListener.js";
import { useMenuToggle } from "./hooks/useMenuToggle.js";
import { useFilteredFeatures } from "./hooks/useFilteredFeatures.js";
import { useWindowManager } from "./hooks/useWindowManager.js";
import { CategoryWindow } from "./components/CategoryWindow.jsx";
import { ConfigWindow } from "./components/ConfigWindow.jsx";
import { Hud } from "./components/Hud.jsx";
import { SearchIcon, SlidersIcon, GearIcon } from "./icons/index.jsx";

export function App() {
  const [listeningFor, setListeningFor] = useState(null);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("features");

  const visible = useMenuToggle(KEYS.menu, listeningFor !== null);
  const { features, state } = usePolyflyState();
  const kbds = useKeybinds();
  useRebindListener(listeningFor, setListeningFor);

  const byCategory = useFilteredFeatures(features, query);
  const categories = Object.keys(byCategory);

  const { positions, zIndices, ensureDefaults, startDrag, raise, registerNode, winWidth } = useWindowManager();

  const allCategories = [...new Set(Object.values(features).map((f) => f.category))];
  const layoutKeys = [...allCategories];
  const allCatKey = layoutKeys.join("|");
  useEffect(() => {
    if (visible) ensureDefaults(layoutKeys);
  }, [visible, allCatKey, ensureDefaults]);

  const totalActive = Object.values(state).filter((s) => s && typeof s === "object" && s.active).length;

  return (
    <>
      <Hud features={features} state={state} kbds={kbds} />
      {visible && (
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 2147483646 }}
          onContextMenu={(e) => e.preventDefault()}
        >
          <div className="absolute inset-0 bg-black/15 pointer-events-none" />

          <div
            onKeyDown={(e) => e.stopPropagation()}
            onKeyUp={(e) => e.stopPropagation()}
            className="pf-panel-glow pointer-events-auto absolute left-1/2 -translate-x-1/2 top-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 px-5 py-2 min-h-[44px] rounded-2xl bg-pf-panel/95 border border-pf-panel-border/30 backdrop-blur-md animate-pf-pop-in"
            style={{ zIndex: 99999, maxWidth: "calc(100vw - 24px)" }}
          >
            <span className="text-pf-accent font-bold tracking-[0.25em] text-[17px] pl-1">POLYFLY</span>
            <span className="text-[12px] text-pf-text-dim font-mono">{totalActive} active</span>
            <div className="flex items-center gap-1 bg-black/30 border border-white/[0.08] rounded-full p-0.5">
              <button
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => setTab("features")}
                className={"flex items-center gap-1.5 px-3 h-7 rounded-full text-[12px] font-medium transition-colors " + (tab === "features" ? "bg-pf-accent/30 text-white" : "text-pf-text-dim hover:text-white")}
              >
                <SlidersIcon size={14} />
                Features
              </button>
              <button
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => setTab("config")}
                className={"flex items-center gap-1.5 px-3 h-7 rounded-full text-[12px] font-medium transition-colors " + (tab === "config" ? "bg-pf-accent/30 text-white" : "text-pf-text-dim hover:text-white")}
              >
                <GearIcon size={14} />
                Config
              </button>
            </div>
            {tab === "features" && (
            <div className="flex items-center gap-2 bg-black/35 border border-white/[0.08] rounded-full pl-3 pr-3.5 h-8 focus-within:border-pf-accent/45 transition-colors">
              <SearchIcon size={15} className="text-pf-text-dim shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="search…"
                className="w-24 sm:w-32 max-w-[40vw] bg-transparent text-[13px] text-pf-text placeholder:text-pf-text-dim/60 outline-none"
              />
            </div>
            )}
            <span className="text-[11px] text-pf-text-dim/70 pr-1">⇧ close</span>
          </div>

          {tab === "features" && categories.map((cat) => {
            const pos = positions[cat];
            if (!pos) return null;
            return (
              <CategoryWindow
                key={cat}
                category={cat}
                features={byCategory[cat]}
                state={state}
                kbds={kbds}
                listeningFor={listeningFor}
                setListeningFor={setListeningFor}
                pos={pos}
                zIndex={zIndices[cat]}
                onRaise={() => raise(cat)}
                onTitleMouseDown={(e) => startDrag(cat, e)}
                registerNode={registerNode}
                winWidth={winWidth}
              />
            );
          })}
          {tab === "features" && categories.length === 0 && (
            <div
              className="pointer-events-auto absolute left-1/2 -translate-x-1/2 top-24 px-5 py-3 rounded-lg bg-pf-panel/95 border border-pf-panel-border/30 text-[14px] text-pf-text-dim"
              style={{ zIndex: 99999 }}
            >
              no modules match "{query}"
            </div>
          )}

          {tab === "config" && (
            <ConfigWindow features={features} state={state} winWidth={winWidth} />
          )}
        </div>
      )}
    </>
  );
}