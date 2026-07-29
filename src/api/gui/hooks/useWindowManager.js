import { useState, useRef, useCallback } from "react";

const MARGIN = 16;
const GUTTER = 18;
const ROW_H = 420;

function winWidth() {
  const v = window.innerWidth;
  if (v < 480) return Math.max(200, v - MARGIN * 2);
  if (v < 900) return 270;
  if (v < 1400) return 300;
  return 320;
}

function colStep() {
  return winWidth() + GUTTER;
}

export function useWindowManager() {
  const [positions, setPositions] = useState({});
  const [zIndices, setZIndices] = useState({});
  const zCounter = useRef(10);
  const nodes = useRef({});
  const drag = useRef(null);
  const raf = useRef(0);

  const registerNode = useCallback((cat, el) => {
    if (el) nodes.current[cat] = el;
    else delete nodes.current[cat];
  }, []);

  const ensureDefaults = useCallback((cats) => {
    setPositions((prev) => {
      let changed = false;
      const next = { ...prev };
      const COL_W = colStep();
      const perRow = Math.max(1, Math.floor((window.innerWidth - MARGIN * 2) / COL_W));
      cats.forEach((cat, i) => {
        if (next[cat]) return;
        const col = i % perRow;
        const row = Math.floor(i / perRow);
        next[cat] = { x: MARGIN + col * COL_W, y: MARGIN + 60 + row * ROW_H };
        changed = true;
      });
      return changed ? next : prev;
    });
  }, []);

  const raise = useCallback((cat) => {
    setZIndices((prev) => {
      if (prev[cat] === zCounter.current) return prev;
      return { ...prev, [cat]: ++zCounter.current };
    });
  }, []);

  const startDrag = useCallback((cat, e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    raise(cat);
    const node = nodes.current[cat];
    const startX = e.clientX, startY = e.clientY;
    const rect = node ? node.getBoundingClientRect() : { left: MARGIN, top: MARGIN };
    drag.current = { cat, node, startX, startY, baseX: rect.left, baseY: rect.top, x: rect.left, y: rect.top };

    function apply() {
      raf.current = 0;
      const d = drag.current;
      if (!d || !d.node) return;
      d.node.style.left = d.x + "px";
      d.node.style.top = d.y + "px";
    }
    function onMove(ev) {
      const d = drag.current;
      if (!d) return;
      d.x = Math.max(0, Math.min(window.innerWidth - 160, d.baseX + ev.clientX - d.startX));
      d.y = Math.max(0, Math.min(window.innerHeight - 56, d.baseY + ev.clientY - d.startY));
      if (!raf.current) raf.current = requestAnimationFrame(apply);
    }
    function onUp() {
      const d = drag.current;
      drag.current = null;
      if (raf.current) { cancelAnimationFrame(raf.current); raf.current = 0; }
      removeEventListener("mousemove", onMove, true);
      removeEventListener("mouseup", onUp, true);
      if (d) setPositions((prev) => ({ ...prev, [d.cat]: { x: d.x, y: d.y } }));
    }
    addEventListener("mousemove", onMove, true);
    addEventListener("mouseup", onUp, true);
  }, [raise]);

  return { positions, zIndices, ensureDefaults, startDrag, raise, registerNode, winWidth };
}