import { PolyMod } from "https://cdn.polymodloader.com/cb/PolyTrackMods/PolyModLoader/0.6.2/PolyTypes.js";
import React from "react";
import { createRoot } from "react-dom/client";
import TextPanel from "./TextPanel";

const CONTAINER_ID = "pmltext-root";
const STYLE_ID = "pmltext-style";

class PmlTextMod extends PolyMod {
  init = (pml) => {
    this.pml = pml;
  };

  onGameLoad = () => {
    this.injectStyles();
    this.mount();
  };

  injectStyles = () => {
    if (document.getElementById(STYLE_ID)) return;
    const href = new URL("./mod.css", import.meta.url).href;
    fetch(href)
      .then((r) => r.text())
      .then((css) => {
        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = css;
        document.head.appendChild(style);
      })
      .catch((e) => console.error("[pmltext] css load failed", e));
  };

  mount = () => {
    if (document.getElementById(CONTAINER_ID)) return;
    const container = document.createElement("div");
    container.id = CONTAINER_ID;
    document.body.appendChild(container);
    createRoot(container).render(
      <React.StrictMode>
        <TextPanel />
      </React.StrictMode>
    );
    console.log("[pmltext] mounted");
  };
}

export let polyMod = new PmlTextMod();