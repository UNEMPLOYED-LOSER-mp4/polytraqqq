import { CAR_OFFSETS, WASM_EXPORTS, STOCK } from "../config/carLayout.js";

const workers = new Set();
const snapshot = {
  carPtr: 0,
  pos:    { x: 0, y: 0, z: 0 },
  linVel: { x: 0, y: 0, z: 0 },
  angVel: { x: 0, y: 0, z: 0 },
};
const messageListeners = new Set();

function post(msg) {
  for (const w of workers) {
    w.postMessage({ __polyFlyCmd: true, ...msg });
  }
}

function vec3(offsets, x, y, z) {
  return [
    { offset: offsets.x, value: +x },
    { offset: offsets.y, value: +y },
    { offset: offsets.z, value: +z },
  ];
}

function rowWrites(rowOffset, a, b, c, d) {
  return [
    { offset: rowOffset,     value: +a },
    { offset: rowOffset + 4, value: +b },
    { offset: rowOffset + 8, value: +c },
    { offset: rowOffset + 12, value: +d },
  ];
}

export const physics = {
  attachWorker(worker) {
    workers.add(worker);
    worker.addEventListener("message", (e) => {
      const d = e && e.data;
      if (!d) return;
      if (d.__pfSnap) {
        const s = d.__pfSnap;
        if (typeof s.carPtr === "number") snapshot.carPtr = s.carPtr;
        if (s.pos)    Object.assign(snapshot.pos, s.pos);
        if (s.linVel) Object.assign(snapshot.linVel, s.linVel);
        if (s.angVel) Object.assign(snapshot.angVel, s.angVel);
      }
      for (const fn of messageListeners) fn(d);
    });
  },

  onWorkerMessage(fn) {
    messageListeners.add(fn);
    return () => messageListeners.delete(fn);
  },

  getCarPtr() { return snapshot.carPtr; },
  isReady()   { return snapshot.carPtr !== 0; },
  getPos()    { return { ...snapshot.pos }; },
  getLinVel() { return { ...snapshot.linVel }; },
  getAngVel() { return { ...snapshot.angVel }; },
  getSpeed()  {
    const v = snapshot.linVel;
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  },

  write(offset, value)     { post({ memWrites: [{ offset: +offset, value: +value }] }); },
  writeMany(writes)        { post({ memWrites: writes }); },
  setGlobal(name, value)   { post({ writes: { [name]: value } }); },
  setGlobals(obj)          { post({ writes: obj }); },
  setTickWrites(writes)    { post({ tickWrites: writes }); },
  setKeys(keys)            { post({ keys }); },

  setCarPos(x, y, z)       { this.writeMany(vec3(CAR_OFFSETS.pos, x, y, z)); },
  setLinVel(x, y, z) {
    this.writeMany([
      ...vec3(CAR_OFFSETS.linVel,       x, y, z),
      ...vec3(CAR_OFFSETS.linVelMirror, x, y, z),
    ]);
  },
  setAngVel(x, y, z) {
    this.writeMany([
      ...vec3(CAR_OFFSETS.angVel,       x, y, z),
      ...vec3(CAR_OFFSETS.angVelMirror, x, y, z),
    ]);
  },
  setTickLinVel(x, y, z) {
    this.setTickWrites([
      ...vec3(CAR_OFFSETS.linVel,       x, y, z),
      ...vec3(CAR_OFFSETS.linVelMirror, x, y, z),
      ...vec3(CAR_OFFSETS.angVel,       0, 0, 0),
      ...vec3(CAR_OFFSETS.angVelMirror, 0, 0, 0),
    ]);
  },
  clearTickWrites() { this.setTickWrites([]); },
  setSpeed(s) {
    const v = snapshot.linVel;
    const mag = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    if (mag < 1e-6) return;
    const k = s / mag;
    this.setLinVel(v.x * k, v.y * k, v.z * k);
  },
  setFriction(value) {
    const v = Math.max(0, Number(value) || 0);
    this.setGlobal(WASM_EXPORTS.frictionSlip, v);
  },
  resetFriction() { this.setGlobal(WASM_EXPORTS.frictionSlip, STOCK.friction); },

  setYaw(yawRadians) {
    const c = Math.cos(yawRadians);
    const s = Math.sin(yawRadians);
    const r = CAR_OFFSETS.rotMatrix;
    this.writeMany([
      ...rowWrites(r.row0,  c, 0,  s, 0),
      ...rowWrites(r.row1,  0, 1,  0, 0),
      ...rowWrites(r.row2, -s, 0,  c, 0),
    ]);
  },

  stop() {
    this.writeMany([
      ...vec3(CAR_OFFSETS.linVel,       0, 0, 0),
      ...vec3(CAR_OFFSETS.linVelMirror, 0, 0, 0),
      ...vec3(CAR_OFFSETS.angVel,       0, 0, 0),
      ...vec3(CAR_OFFSETS.angVelMirror, 0, 0, 0),
    ]);
  },
};

export { CAR_OFFSETS, WASM_EXPORTS };