export const CAR_OFFSETS = {
  rotMatrix:    { row0: 4,  row1: 20, row2: 36 },
  pos:          { x: 52,  y: 56,  z: 60  },
  linVel:       { x: 132, y: 136, z: 140 },
  angVel:       { x: 148, y: 152, z: 156 },
  linVelMirror: { x: 312, y: 316, z: 320 },
  angVelMirror: { x: 328, y: 332, z: 336 },
};

export const WASM_EXPORTS = {
  engineForceMach:  "x",
  carPtr:           "z",
  cmdBufBase:       "A",
  cmdBufCount:      "B",
  wheelArrayBase:   "C",
  frictionSlip:     "y",
  antiFlip:         "D",
  yawLockSpeedSq:   "E",
};

export const WHEEL = { stride: 284, count: 4, frictionSlip: 228 };

export const STOCK = {
  engineForce:   4000,
  friction:      3,
};

export const CMD_BUFFER = { capacity: 128 };