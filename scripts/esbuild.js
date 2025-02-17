import { resolve } from "path";
import * as esbuild from "esbuild";
import { fileURLToPath, URL } from "url";
import { execSync } from "node:child_process";
import pkg from "@sprout2000/esbuild-copy-plugin";
import { existsSync } from "node:fs";
const { copyPlugin } = pkg;

const __dirname = fileURLToPath(new URL(".", import.meta.url));

execSync("tsc --build ./transform/tsconfig.json");

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
execSync("cmake --build build_wasm --target wasm-instrumentation", {
  encoding: "utf8",
  stdio: "inherit",
  env,
});
execSync(
  "tsc build_wasm/bin/wasm-instrumentation.js --declaration --allowJs --emitDeclarationOnly --outDir build_wasm/bin"
);

await esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  packages: "external",
  sourcemap: "both",
  outfile: resolve(__dirname, "../dist/index.js"),
  plugins: [
    copyPlugin({
      src: "src/generator/html-generator/resource",
      dest: resolve(__dirname, "../dist/resource/"),
    }),
  ],
});
