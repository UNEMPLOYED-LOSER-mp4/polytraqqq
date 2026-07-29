import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";

import css from "../../../dist/styles.bundle.js";

function mount() {
  const host = document.createElement("div");
  host.id = "polyfly-host";

  (document.body || document.documentElement).appendChild(host);

  const shadow = host.attachShadow({ mode: "open" });
  const styleEl = document.createElement("style");
  styleEl.textContent = css;
  shadow.appendChild(styleEl);

  const mountPoint = document.createElement("div");
  shadow.appendChild(mountPoint);

  createRoot(mountPoint).render(<App />);
}

export const gui = {
  install() {
    if (document.readyState === "loading") {

      addEventListener("DOMContentLoaded", mount, { once: true });
    } else {
      mount();
    }
  },
};
