import { useMemo } from "react";

export function useFilteredFeatures(features, query) {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    const out = {};
    for (const f of Object.values(features)) {
      let match = !q;
      if (!match) {
        const haystack = [
          f.name, f.label || "", f.description || "", f.category,
          ...Object.entries(f.settings).flatMap(([k, d]) => [k, d.label || ""]),
        ].join(" ").toLowerCase();
        match = haystack.includes(q);
      }
      if (match) (out[f.category] = out[f.category] || []).push(f);
    }
    return out;
  }, [features, query]);
}
