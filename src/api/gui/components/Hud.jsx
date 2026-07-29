export function Hud({ features, state, kbds }) {
  if (!state.hud?.active) return null;

  const active = Object.values(features).filter(f =>
    state[f.name] && state[f.name].active
  );

  if (active.length === 0) {
    return (
      <div
        className="pf-panel-glow pointer-events-none fixed top-4 left-4 rounded-xl bg-pf-panel/95 border border-pf-panel-border/30 backdrop-blur-md px-5 py-3.5"
        style={{ zIndex: 2147483645, minWidth: 240 }}
      >
        <div className="text-[13px] uppercase tracking-[0.25em] text-pf-text-dim/70 mb-1.5">polyfly</div>
        <div className="text-[15px] text-pf-text-dim italic">no active features</div>
      </div>
    );
  }

  return (
    <div
      className="pf-panel-glow pointer-events-none fixed top-4 left-4 rounded-xl bg-pf-panel/95 border border-pf-panel-border/30 backdrop-blur-md overflow-hidden"
      style={{ zIndex: 2147483645, minWidth: 240 }}
    >
      <div className="px-5 pt-3.5 pb-2.5 border-b border-white/[0.06]">
        <div className="text-[13px] uppercase tracking-[0.25em] text-pf-accent/85 font-semibold">polyfly</div>
      </div>
      <div className="py-1.5">
        {active.map(f => (
          <div key={f.name} className="flex items-center gap-3.5 px-5 py-2.5">
            <span className="w-2 h-2 rounded-full bg-pf-accent shadow-[0_0_10px_rgba(255,58,58,0.7)] shrink-0" />
            <span className="text-[17px] text-white font-medium flex-1 truncate">{f.label}</span>
            {kbds.get(f.name) && (
              <span className="text-[13px] font-mono text-pf-text-dim/75 px-2 py-0.5 rounded bg-white/[0.06]">
                {shortenKey(kbds.get(f.name))}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function shortenKey(code) {
  return code.replace(/^Key/, "").replace(/^Digit/, "").replace(/^Arrow/, "");
}