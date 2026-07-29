import { KEYS } from "../config/keys.js";

const STORAGE_KEY = "POLYFLY_KEYBINDS";
const changeListeners = new Set();
let overrides = loadOverrides();

function loadOverrides() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return (parsed && typeof parsed === "object") ? parsed : {};
  } catch (_) {
    return {};
  }
}

function saveOverrides() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch (e) {
    console.warn("[keybinds] persist failed:", e);
  }
}

function notify() {
  for (const fn of changeListeners) {
    try { fn(); } catch (e) { console.warn("[keybinds] listener threw:", e); }
  }
}

export const keybinds = {

  get(name) {
    if (name in overrides) return overrides[name];
    return KEYS[name] ?? null;
  },

  set(name, code) {
    overrides[name] = code;
    saveOverrides();
    notify();
  },

  clear(name) {
    overrides[name] = null;
    saveOverrides();
    notify();
  },

  reset() {
    overrides = {};
    saveOverrides();
    notify();
  },

  onChange(fn) {
    changeListeners.add(fn);
    return () => changeListeners.delete(fn);
  },

  featuresForCode(code) {
    const out = [];

    const names = new Set([...Object.keys(KEYS), ...Object.keys(overrides)]);
    for (const name of names) {
      if (this.get(name) === code) out.push(name);
    }
    return out;
  },
};
