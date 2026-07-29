import { polyfly } from "./polyfly.js";
import { KEYS } from "../config/keys.js";

const TARGET_WORKER_NAME = "simulation_worker";
const PHYSICS_CANARY_EXPORT = "r";

function getModdedWasmUrl() {
  try {
    return (document.documentElement && document.documentElement.dataset.polyflyWasmUrl) || null;
  } catch (_) {
    return null;
  }
}

function buildBootstrap(realWorkerUrl, modWasmUrl, initialWrites, workerPatches, workerInit) {
  return `
const __pfRealWorkerUrl = ${JSON.stringify(realWorkerUrl)};
const __pfModWasmUrl    = ${JSON.stringify(modWasmUrl)};
const __pfWorkerBase    = new URL(".", __pfRealWorkerUrl).href;
const __pfCanary        = ${JSON.stringify(PHYSICS_CANARY_EXPORT)};
self.__pfPending        = ${JSON.stringify(initialWrites || {})};
self.__pfKeys           = {};
self.__pfPauseKey       = ${JSON.stringify(KEYS.pauseTimer)};

${workerInit || ""}

const __pfWasmBytesP = fetch(__pfModWasmUrl).then(r => r.arrayBuffer());

const __pfRealImportScripts = self.importScripts.bind(self);
self.importScripts = function (...urls) {
  const fixed = urls.map((u) => {
    try {
      const s = String(u);
      if (/^(https?:|blob:|data:|file:)/i.test(s)) return s;
      return new URL(s, __pfWorkerBase).href;
    } catch (_) { return u; }
  });
  return __pfRealImportScripts(...fixed);
};

const __pfRealFetch = self.fetch.bind(self);
self.fetch = function (input, init) {
  try {
    const raw = (input && input.url) || String(input);
    if (/polytrack_physics\\.wasm(\\?|$)/.test(raw)) {
      return __pfWasmBytesP.then(buf => new Response(buf, {
        status: 200,
        headers: { "Content-Type": "application/wasm" },
      }));
    }
    if (typeof input === "string" && !/^(https?:|blob:|data:|file:)/i.test(input)) {
      return __pfRealFetch(new URL(input, __pfWorkerBase).href, init);
    }
  } catch (_) {}
  return __pfRealFetch(input, init);
};

self.__pfInstance = null;
function __pfApplyPending() {
  const inst = self.__pfInstance;
  if (!inst || !inst.exports) return;
  for (const k of Object.keys(self.__pfPending)) {
    const exp = inst.exports[k];
    if (!exp || typeof exp.value === "undefined") continue;
    try { exp.value = self.__pfPending[k]; } catch (_) {}
  }
}

function __pfMaybeCapture(instance) {
  if (!instance || !instance.exports || !instance.exports[__pfCanary]) return;
  self.__pfInstance = instance;
  if (instance.exports.l && instance.exports.A && !instance.exports.A.value) {
    try {
      const buf = instance.exports.l(1024);
      if (buf > 0) instance.exports.A.value = buf;
    } catch (_) {}
  }
  __pfApplyPending();
}

const __pfRealIS = WebAssembly.instantiateStreaming;
WebAssembly.instantiateStreaming = function (...args) {
  return __pfRealIS.apply(WebAssembly, args).then((res) => {
    __pfMaybeCapture(res.instance);
    return res;
  });
};
const __pfRealI = WebAssembly.instantiate;
WebAssembly.instantiate = function (...args) {
  return __pfRealI.apply(WebAssembly, args).then((res) => {
    __pfMaybeCapture(res.instance || res);
    return res;
  });
};

addEventListener("message", (e) => {
  const d = e && e.data;
  if (!d || !d.__polyFlyCmd) return;
  if (d.keys && typeof d.keys === "object") self.__pfKeys = d.keys;
  if (d.writes && typeof d.writes === "object") {
    self.__pfPending = { ...self.__pfPending, ...d.writes };
    __pfApplyPending();
  }
  if (Array.isArray(d.memWrites) && d.memWrites.length > 0) {
    const inst = self.__pfInstance;
    if (inst && inst.exports && inst.exports.z && inst.exports.j) {
      const carPtr = inst.exports.z.value;
      if (carPtr) {
        const f32 = new Float32Array(inst.exports.j.buffer);
        for (const w of d.memWrites) {
          try { f32[(carPtr + w.offset) >>> 2] = w.value; } catch (_) {}
        }
      }
    }
  }
  if (Array.isArray(d.tickWrites)) {
    const inst = self.__pfInstance;
    if (inst && inst.exports && inst.exports.A && inst.exports.B && inst.exports.j) {
      const base = inst.exports.A.value;
      const count = Math.min(d.tickWrites.length, 128);
      const i32 = new Int32Array(inst.exports.j.buffer);
      const f32 = new Float32Array(inst.exports.j.buffer);
      for (let k = 0; k < count; k++) {
        const w = d.tickWrites[k];
        const cmdAddr = (base + k * 8) >>> 2;
        i32[cmdAddr]     = w.offset | 0;
        f32[cmdAddr + 1] = +w.value;
      }
      inst.exports.B.value = count;
    }
  }
});

self.__pfSnapInterval = setInterval(() => {
  const inst = self.__pfInstance;
  if (!inst || !inst.exports || !inst.exports.z || !inst.exports.j) return;
  const carPtr = inst.exports.z.value;
  if (!carPtr) return;
  const f32 = new Float32Array(inst.exports.j.buffer);
  const i = carPtr >>> 2;
  postMessage({
    __pfSnap: {
      carPtr,
      pos:    { x: f32[i + 13], y: f32[i + 14], z: f32[i + 15] },
      linVel: { x: f32[i + 33], y: f32[i + 34], z: f32[i + 35] },
      angVel: { x: f32[i + 37], y: f32[i + 38], z: f32[i + 39] },
    },
  });
}, 16);

const xhr = new XMLHttpRequest();
xhr.open("GET", __pfRealWorkerUrl, false);
xhr.send();
let __pfSrc = xhr.responseText;

const __pfPatches = ${JSON.stringify(workerPatches || [])};
for (const [find, replace] of __pfPatches) {
  if (!__pfSrc.includes(find)) {
    console.error("[polyfly/worker] anchor not found:", find.slice(0, 80));
    continue;
  }
  __pfSrc = __pfSrc.replaceAll(find, replace);
}

__pfRealImportScripts(URL.createObjectURL(new Blob([__pfSrc], { type: "application/javascript" })));
`;
}

export function installWasmHook() {
  if (window.__polyflyWasmHookInstalled) return;
  window.__polyflyWasmHookInstalled = true;

  const NativeWorker = window.Worker;
  const modUrl = getModdedWasmUrl();
  if (!modUrl) {
    console.error("[polyfly] cannot resolve modded wasm URL; aborting hook");
    return;
  }

  window.Worker = function patchedWorker(url, options) {
    const workerUrl = String(url);
    if (!workerUrl.includes(TARGET_WORKER_NAME)) {
      return new NativeWorker(url, options);
    }

    const initialWrites = polyfly.collectWasmWrites().writes;
    const workerPatches = polyfly.collectWorkerPatches();
    const workerInit    = polyfly.collectWorkerInit();

    const realUrl = new URL(workerUrl, location.href).href;
    const bootstrap = buildBootstrap(realUrl, modUrl, initialWrites, workerPatches, workerInit);
    const blobUrl = URL.createObjectURL(
      new Blob([bootstrap], { type: "application/javascript" })
    );
    const worker = new NativeWorker(blobUrl, options);

    polyfly.addWorker(worker);
    return worker;
  };
}