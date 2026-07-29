import { keybinds } from "./keybinds.js";
import { loadPersistedSettings, persistSettings } from "./storage.js";
import { physics } from "./physics.js";

const features = {};
const state = { keys: {} };
const featureChangeListeners = new Set();

function notifyFeatureChange(name) {
  for (const fn of featureChangeListeners) fn(name);
}

function collectWasmWrites() {
  const writes = {};
  const tickWrites = [];
  for (const def of Object.values(features)) {
    if (!def.wasm) continue;
    if (typeof def.wasm.compute === "function") {
      const out = def.wasm.compute(state);
      if (out && typeof out === "object") Object.assign(writes, out);
    }
    if (typeof def.wasm.tickWrites === "function") {
      const out = def.wasm.tickWrites(state);
      if (Array.isArray(out)) {
        for (const w of out) {
          if (w && typeof w.offset === "number" && typeof w.value === "number") {
            tickWrites.push(w);
          }
        }
      }
    }
  }
  return { writes, tickWrites };
}

function collectWorkerPatches() {
  const out = [];
  for (const def of Object.values(features)) {
    if (Array.isArray(def.workerPatches)) out.push(...def.workerPatches);
  }
  return out;
}

function collectWorkerInit() {
  const parts = [];
  for (const def of Object.values(features)) {
    if (typeof def.workerInit === "string") parts.push(def.workerInit);
  }
  return parts.join("\n");
}

function collectMainPatches() {
  const out = [];
  for (const def of Object.values(features)) {
    if (Array.isArray(def.mainPatches)) out.push(...def.mainPatches);
  }
  return out;
}

function broadcast() {
  for (const def of Object.values(features)) {
    if (typeof def.onState === "function") def.onState(state);
  }
  window.__polyflyWasmState = JSON.parse(JSON.stringify(state));
  const { writes, tickWrites } = collectWasmWrites();
  physics.setGlobals(writes);
  physics.setTickWrites(tickWrites);
  physics.setKeys(state.keys);
}

function dispatchToggleKey(code) {
  let any = false;
  for (const name of keybinds.featuresForCode(code)) {
    if (!features[name]) continue;
    if (features[name].toggleable === false) continue;
    state[name].active = !state[name].active;
    notifyFeatureChange(name);
    any = true;
  }
  if (any) { persistSettings(features, state); broadcast(); }
}

export const polyfly = {
  registerFeature(name, opts = {}) {
    if (features[name]) {
      console.warn("[polyfly] already registered:", name);
      return;
    }
    const {
      label = name, description = "", category = "Misc",
      toggleKey = null, toggleable = true, settings = {},
    } = opts;

    const initial = { active: false };
    for (const [k, def] of Object.entries(settings)) initial[k] = def.default;
    const persisted = loadPersistedSettings()[name];
    if (persisted) {
      if (typeof persisted.active === "boolean") initial.active = persisted.active;
      for (const k of Object.keys(settings)) {
        if (k in persisted) initial[k] = persisted[k];
      }
    }

    features[name] = {
      name, label, description, category, toggleKey,
      hasToggleKey: !!toggleKey, toggleable, settings,
      wasm: opts.wasm || null,
      onState: opts.onState || null,
      workerInit: typeof opts.workerInit === "string" ? opts.workerInit : null,
      workerPatches: Array.isArray(opts.workerPatches) ? opts.workerPatches : null,
      mainPatches: Array.isArray(opts.mainPatches) ? opts.mainPatches : null,
    };
    state[name] = initial;
    notifyFeatureChange(name);
    broadcast();
  },

  getFeatures() { return features; },
  getState() { return state; },
  persistNow() { persistSettings(features, state); },
  physics,
  collectWasmWrites,
  collectWorkerPatches,
  collectWorkerInit,
  collectMainPatches,

  onFeatureChange(fn) {
    featureChangeListeners.add(fn);
    return () => featureChangeListeners.delete(fn);
  },

  setFeatureValue(name, key, value) {
    if (!features[name] || !(key in state[name])) return;
    state[name][key] = value;
    if (key === "active" || key in features[name].settings) persistSettings(features, state);
    notifyFeatureChange(name);
    broadcast();
  },

  applyImportedSettings(obj) {
    if (!obj || typeof obj !== "object") return { applied: 0, skipped: 0 };
    let applied = 0;
    let skipped = 0;
    for (const [name, sub] of Object.entries(obj)) {
      const def = features[name];
      if (!def || !sub || typeof sub !== "object") { skipped++; continue; }
      if (typeof sub.active === "boolean") { state[name].active = sub.active; applied++; }
      for (const [key, value] of Object.entries(sub)) {
        if (key === "active") continue;
        const sdef = def.settings[key];
        if (!sdef || !(key in state[name])) { skipped++; continue; }
        const t = sdef.type || (typeof sdef.default);
        let ok = false;
        if (t === "number") ok = typeof value === "number" && Number.isFinite(value);
        else if (t === "bool" || t === "boolean") ok = typeof value === "boolean";
        else if (t === "text" || t === "string") ok = typeof value === "string";
        else ok = typeof value === typeof sdef.default;
        if (!ok) { skipped++; continue; }
        state[name][key] = value;
        applied++;
      }
      notifyFeatureChange(name);
    }
    persistSettings(features, state);
    broadcast();
    return { applied, skipped };
  },

  addWorker(worker) {
    physics.attachWorker(worker);
    broadcast();
  },

  installControls() {
    const editable = el =>
      !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable);
    addEventListener("keydown", event => {
      if (editable(event.target)) return;
      const wasDown = state.keys[event.code];
      state.keys[event.code] = true;
      if (wasDown) return;
      dispatchToggleKey(event.code);
      broadcast();
    }, true);
    addEventListener("keyup", event => {
      const wasDown = state.keys[event.code];
      state.keys[event.code] = false;
      if (wasDown) broadcast();
    }, true);
    addEventListener("contextmenu", event => event.preventDefault(), true);
  },
};

broadcast();