import { KEYS } from "../config/keys.js";
import { STOCK, WASM_EXPORTS } from "../config/carLayout.js";

export const mach = {
  name: "mach",
  label: "Mach",
  description: "Engine force multiplier; anti-flip keeps the car level so all force goes forward",
  category: "Movement",
  toggleKey: KEYS.mach,
  settings: {
    mult:         { type: "number", label: "Speed multiplier",      min: 1, max: 250,   step: 0.1, default: 2.5 },
    antiFlip:     { type: "bool",   label: "Anti-flip",             default: true },
    yawLockSpeed: { type: "number", label: "Yaw-lock speed (km/h)", min: 0, max: 50000, step: 100, default: 4000 },
  },
  wasm: {
    requires: [WASM_EXPORTS.engineForceMach],
    compute(state) {
      const m = state.mach || { active: false, mult: 1, antiFlip: true, yawLockSpeed: 4000 };
      const force = m.active ? STOCK.engineForce * (Number(m.mult) || 1) : STOCK.engineForce;
      const flip  = (m.active && m.antiFlip) ? 1 : 0;
      const yls   = (m.active && m.antiFlip) ? ((Number(m.yawLockSpeed) || 0) / 3.6) ** 2 : Infinity;
      return {
        [WASM_EXPORTS.engineForceMach]: force,
        [WASM_EXPORTS.antiFlip]:        flip,
        [WASM_EXPORTS.yawLockSpeedSq]:  yls,
      };
    },
  },
};