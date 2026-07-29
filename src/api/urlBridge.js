export function installUrlBridge(baseUrl) {
  try {
    const url = `${baseUrl}/1.0.0/assets/bin/polytrack_mod.wasm`;
    document.documentElement.dataset.polyflyWasmUrl = url;
  } catch (e) {
    console.error("[polyfly] urlBridge failed:", e);
  }
}