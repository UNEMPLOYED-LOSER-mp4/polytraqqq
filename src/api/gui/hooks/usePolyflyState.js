import { useEffect, useState } from "react";
import { polyfly } from "../../polyfly.js";

export function usePolyflyState() {
  const [, forceRender] = useState(0);
  useEffect(() => polyfly.onFeatureChange(() => forceRender(n => n + 1)), []);
  return { features: polyfly.getFeatures(), state: polyfly.getState() };
}
