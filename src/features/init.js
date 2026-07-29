import { polyfly } from "../api/polyfly.js";
import { mach } from "./mach.js";

const FEATURES = [mach];

export function registerAllFeatures() {
  for (const def of FEATURES) polyfly.registerFeature(def.name, def);
}