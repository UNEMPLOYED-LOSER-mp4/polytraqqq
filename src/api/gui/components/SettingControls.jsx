import { useState, useEffect } from "react";
import { polyfly } from "../../polyfly.js";



export function SettingSlider({ featureName, settingKey, def, value }) {
  const min = def.min ?? 0;
  const max = def.max ?? 100;
  const step = def.step ?? 1;
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  const [text, setText] = useState(String(value));

  useEffect(() => {
    setText(String(value));
  }, [value]);

  const commit = (raw) => {
    const clean = String(raw).trim();

    if (clean === "") {
      setText(String(value));
      return;
    }

    const n = Number(clean);

    if (!Number.isFinite(n)) {
      setText(String(value));
      return;
    }

    const clamped = Math.max(min, Math.min(max, n));

    polyfly.setFeatureValue(featureName, settingKey, clamped);
    setText(String(clamped));
  };

  return (
    <div className="py-2">
      <div className="flex justify-between items-center mb-1.5 text-[12px] text-pf-text-dim">
        <span>{def.label || settingKey}</span>
        <input
          type="text"
          inputMode="decimal"
          value={text}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            e.stopPropagation();

            if (e.key === "Enter") {
              commit(e.currentTarget.value);
              e.currentTarget.blur();
            } else if (e.key === "Escape") {
              setText(String(value));
              e.currentTarget.blur();
            }
          }}
          onChange={(e) => {
            e.stopPropagation();
            setText(e.target.value);
          }}
          onBlur={(e) => commit(e.target.value)}
          className="w-16 bg-transparent text-right font-mono text-pf-text outline-none border-b border-transparent focus:border-pf-accent/50 focus:text-pf-accent transition-colors"
        />
      </div>
      <input
        type="range"
        className="pf-slider"
        style={{ "--pf-fill": pct + "%" }}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => polyfly.setFeatureValue(featureName, settingKey, Number(e.target.value))}
      />
    </div>
  );
}

export function SettingToggle({ featureName, settingKey, def, value }) {
  return (
    <div className="py-2">
      <div className="flex justify-between items-center text-[12px] text-pf-text-dim">
        <span>{def.label || settingKey}</span>
        <div
          onClick={(e) => {
            e.stopPropagation();
            polyfly.setFeatureValue(featureName, settingKey, !value);
          }}
          className={
            "w-10 h-[22px] rounded-full relative shrink-0 cursor-pointer transition-colors duration-150 " +
            (value ? "bg-pf-accent shadow-[0_0_10px_rgba(255,58,58,0.45)]" : "bg-white/10")
          }
        >
          <div
            className={
              "absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform duration-150 " +
              (value ? "translate-x-[20px]" : "translate-x-[2px]")
            }
          />
        </div>
      </div>
    </div>
  );
}

export function SettingText({ featureName, settingKey, def, value }) {
  const [text, setText] = useState(value ?? "");
  useEffect(() => { setText(value ?? ""); }, [value]);
  const commit = (raw) => { polyfly.setFeatureValue(featureName, settingKey, raw); };
  return (
    <div className="py-2">
      <div className="flex justify-between items-center gap-3 text-[12px] text-pf-text-dim">
        <span className="shrink-0">{def.label || settingKey}</span>
        <input
          type="text"
          value={text}
          maxLength={def.maxLength ?? 64}
          placeholder={def.placeholder || ""}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => setText(e.target.value)}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Enter") { commit(e.target.value); e.target.blur(); }
            else if (e.key === "Escape") { setText(value ?? ""); e.target.blur(); }
          }}
          onKeyUp={(e) => e.stopPropagation()}
          className="flex-1 min-w-0 px-2 py-1 rounded bg-white/5 border border-white/10 font-mono text-pf-text outline-none focus:border-pf-accent/60 focus:bg-white/10 transition-colors"
        />
      </div>
    </div>
  );
}