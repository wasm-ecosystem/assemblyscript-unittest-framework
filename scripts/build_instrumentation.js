import { execSync } from "node:child_process";
import { existsSync, copyFileSync } from "node:fs";

const env = process.env;

function initEmscripten() {
  const sdkPath = "third_party/emsdk/";

  env["PATH"] = `${sdkPath}:` + env["PATH"];
  if (!existsSync(`${sdkPath}upstream/emscripten`)) {
    execSync("emsdk install 3.1.32", { encoding: "utf8", stdio: "inherit", env });
    execSync("emsdk activate 3.1.32", { encoding: "utf8", stdio: "inherit", env });
  }
  env["PATH"] = `${sdkPath}upstream/emscripten:` + env["PATH"];
}

initEmscripten();

execSync("emcmake cmake -B build_wasm -S .", { encoding: "utf8", stdio: "inherit", env });
execSync("cmake --build build_wasm --parallel --target wasm-instrumentation", {
  encoding: "utf8",
  stdio: "inherit",
  env,
});

copyFileSync("instrumentation/wasm-instrumentation.d.ts", "build_wasm/bin/wasm-instrumentation.d.ts");
