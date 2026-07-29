import { useState } from "react";
import { polyfly } from "../../polyfly.js";
import { shortenKey } from "../util.js";
import { KeybindChip } from "./KeybindChip.jsx";
import { SettingSlider, SettingToggle, SettingText } from "./SettingControls.jsx";
import { ChevronIcon } from "../icons/index.jsx";

export function ModuleRow({ feature, fs, currentKey, listeningFor, setListeningFor, kbds }) {
  const [expanded, setExpanded] = useState(false);
  const isOn = !!fs.active;
  const toggleable = feature.toggleable !== false;
  const hasSettings = Object.keys(feature.settings).length > 0 || feature.hasToggleKey;

  function onRowClick() {
    if (toggleable) polyfly.setFeatureValue(feature.name, "active", !isOn);
    else if (hasSettings) setExpanded((x) => !x);
  }
  function onContext(e) {
    e.preventDefault();
    e.stopPropagation();
    if (hasSettings) setExpanded((x) => !x);
  }

  return (
    <>
      <div
        onClick={onRowClick}
        onContextMenu={onContext}
        title={feature.description || feature.label}
        className={
          "group flex items-center gap-2 px-4 h-[42px] cursor-pointer select-none transition-colors " +
          (isOn ? "bg-pf-accent/85 hover:bg-pf-accent text-white" : "hover:bg-white/[0.07] text-pf-text")
        }
      >
        <span className={"text-[15px] flex-1 min-w-0 truncate " + (isOn ? "font-semibold" : "")}>
          {feature.label}
        </span>

        {currentKey && (
          <span
            className={
              "text-[12px] font-mono leading-none px-2 py-1 rounded " +
              (isOn ? "bg-black/25 text-white/90" : "bg-white/10 text-pf-text-dim")
            }
          >
            {shortenKey(currentKey)}
          </span>
        )}

        {hasSettings && (
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded((x) => !x); }}
            className={
              "shrink-0 w-7 h-7 flex items-center justify-center rounded transition-colors " +
              (isOn ? "text-white/85 hover:bg-black/20" : "text-pf-text-dim hover:bg-white/10 hover:text-pf-text")
            }
          >
            <ChevronIcon size={17} open={expanded} />
          </button>
        )}
      </div>

      {expanded && hasSettings && (
        <div className="px-4 py-3 bg-black/40 border-y border-white/[0.05]">
          {feature.hasToggleKey && (
            <div className="pb-2.5">
              <div className="text-[11px] uppercase tracking-wider text-pf-text-dim/70 mb-2">
                keybind
              </div>
              <KeybindChip
                name={feature.name}
                currentKey={currentKey}
                isListening={listeningFor === feature.name}
                onStartRebind={setListeningFor}
                onClear={kbds.clear}
              />
            </div>
          )}
          {Object.entries(feature.settings).map(([key, def]) => {
            const val = fs[key];
            if (def.type === "number") {
              return <SettingSlider key={key} featureName={feature.name} settingKey={key} def={def} value={val} />;
            }
            if (def.type === "bool") {
              return <SettingToggle key={key} featureName={feature.name} settingKey={key} def={def} value={val} />;
            }
            if (def.type === "text") {
              return <SettingText key={key} featureName={feature.name} settingKey={key} def={def} value={val} />;
            }
            return <div key={key} className="text-[13px] text-pf-text-dim">unsupported type: {def.type}</div>;
          })}
        </div>
      )}
    </>
  );
}