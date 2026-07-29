const SETTINGS_STORAGE_KEY = "POLYFLY_SETTINGS";

export function loadPersistedSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return (parsed && typeof parsed === "object") ? parsed : {};
  } catch (_) {
    return {};
  }
}

export function persistSettings(features, state) {
  try {
    const snap = {};
    for (const [name, def] of Object.entries(features)) {
      const sub = { active: !!state[name].active };
      for (const key of Object.keys(def.settings)) sub[key] = state[name][key];
      snap[name] = sub;
    }
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(snap));
  } catch (e) {
    console.warn("[polyfly] settings persist failed:", e);
  }
}

export function exportSettingsJson() {
  return JSON.stringify(loadPersistedSettings(), null, 2);
}

export function parseSettingsJson(raw) {
  if (typeof raw !== "string" || raw.trim() === "") {
    return { ok: false, error: "Empty input" };
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (_) {
    return { ok: false, error: "Invalid JSON" };
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { ok: false, error: "Expected a JSON object" };
  }
  return { ok: true, data: parsed };
}
