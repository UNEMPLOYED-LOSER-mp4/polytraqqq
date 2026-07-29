import { polyfly } from "./polyfly.js";

const TARGET = "main.bundle.js";

function patchAndInject(url) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, false);
  xhr.send();
  let src = xhr.responseText;
  for (const [find, replace] of polyfly.collectMainPatches()) {
    if (!src.includes(find)) {
      console.error("[polyfly/main] anchor not found:", find.slice(0, 80));
      continue;
    }
    src = src.replaceAll(find, replace);
  }
  const publicPath = url.replace(/\/[^/]+$/, "/");
  const ppFind = '.replace(/\\/[^\\/]+$/,"/")';
  const ppRepl = '.replace(/\\/[^\\/]+$/,"/").replace(/^[\\s\\S]*$/,' + JSON.stringify(publicPath) + ')';
  if (src.includes(ppFind)) {
    src = src.replaceAll(ppFind, ppRepl);
  } else {
    console.error("[polyfly/main] publicPath anchor not found");
  }
  const blobUrl = URL.createObjectURL(new Blob([src], { type: "application/javascript" }));
  const s = document.createElement("script");
  s.src = blobUrl;
  document.head.appendChild(s);
}

function tryInterceptScript(node) {
  if (!node || node.tagName !== "SCRIPT") return false;
  const src = node.getAttribute("src");
  if (!src || !src.includes(TARGET)) return false;
  const absUrl = node.src;
  node.remove();
  patchAndInject(absUrl);
  return true;
}

function walkAndIntercept(node) {
  if (tryInterceptScript(node)) return true;
  if (!node.querySelectorAll) return false;
  for (const s of node.querySelectorAll("script")) {
    if (tryInterceptScript(s)) return true;
  }
  return false;
}

export function installMainBundlePatcher() {
  let done = false;
  const obs = new MutationObserver((muts) => {
    if (done) return;
    for (const m of muts) {
      for (const n of m.addedNodes) {
        if (walkAndIntercept(n)) {
          done = true;
          obs.disconnect();
          return;
        }
      }
    }
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });
  if (document.head) walkAndIntercept(document.head);
}