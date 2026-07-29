import { PolyMod } from "https://cdn.polymodloader.com/cb/PolyTrackMods/PolyModLoader/0.6.2/PolyTypes.js";
import { installUrlBridge } from "./api/urlBridge.js";
import { installWasmHook } from "./api/wasmHook.js";
import { installMainBundlePatcher } from "./api/mainBundlePatcher.js";
import { polyfly } from "./api/polyfly.js";
import { gui } from "./api/gui/index.js";
import { registerAllFeatures } from "./features/init.js";

class PolyFlyMod extends PolyMod {
  preInit = (pml) => {
    this.pml = pml;
    installUrlBridge(this.baseUrl);
    registerAllFeatures();
    polyfly.persistNow();
    installMainBundlePatcher();
    installWasmHook();
    polyfly.installControls();
  };

  onGameLoad = () => {
    gui.install();
  };
}

export let polyMod = new PolyFlyMod();