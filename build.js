const esbuild = require("esbuild");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const STYLES_IN = path.join(ROOT, "src/api/gui/styles.css");
const STYLES_OUT = path.join(ROOT, "dist/styles.css");
const STYLES_BUNDLE = path.join(ROOT, "dist/styles.bundle.js");
const JS_ENTRY = path.join(ROOT, "src/main.mod.jsx");
const JS_OUT = path.join(ROOT, "1.0.0/main.mod.js");

const watch = process.argv.includes("--watch");

fs.mkdirSync(path.join(ROOT, "dist"), { recursive: true });
fs.mkdirSync(path.join(ROOT, "1.0.0"), { recursive: true });

function runTailwind() {
  const args = [
    "tailwindcss",
    "-i", STYLES_IN,
    "-o", STYLES_OUT,
    "--minify",
  ];
  if (watch) args.push("--watch");
  const p = spawn("npx", args, { stdio: ["ignore", "pipe", "pipe"] });
  p.stdout.on("data", d => process.stdout.write(d));
  p.stderr.on("data", d => process.stderr.write(d));
  return p;
}

function bundleStyles() {
  if (!fs.existsSync(STYLES_OUT)) {
    fs.writeFileSync(STYLES_BUNDLE, "export default '';\n");
    return;
  }
  let css = fs.readFileSync(STYLES_OUT, "utf8");
  css = css.replace(/(^|[^,\s]):root(?![a-zA-Z-])/g, "$1:host");
  fs.writeFileSync(STYLES_BUNDLE, `export default ${JSON.stringify(css)};\n`);
}

async function runEsbuild() {
  const opts = {
    entryPoints: [JS_ENTRY],
    bundle: true,
    outfile: JS_OUT,
    format: "esm",
    external: ["https://cdn.polymodloader.com/*"],
    jsx: "automatic",
    loader: { ".js": "jsx" },
    define: { "process.env.NODE_ENV": '"production"' },
    logLevel: "info",
  };
  if (watch) {
    const ctx = await esbuild.context(opts);
    await ctx.watch();
  } else {
    await esbuild.build(opts);
  }
}

(async () => {
  if (watch) {
    runTailwind();
    bundleStyles();
    fs.watchFile(STYLES_OUT, { interval: 250 }, () => {
      bundleStyles();
    });
    await runEsbuild();
    console.log("[build] watching for changes...");
  } else {
    await new Promise((resolve, reject) => {
      const p = runTailwind();
      p.on("exit", code => code === 0 ? resolve() : reject(new Error("tailwind exited " + code)));
    });
    bundleStyles();
    await runEsbuild();
    console.log("[build] done");
  }
})().catch(e => { console.error(e); process.exit(1); });