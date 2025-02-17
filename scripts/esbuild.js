import { resolve } from "path";
import * as esbuild from "esbuild";
import { fileURLToPath, URL } from "url";
import { execSync } from "node:child_process";
import pkg from "@sprout2000/esbuild-copy-plugin";
const { copyPlugin } = pkg;

const __dirname = fileURLToPath(new URL(".", import.meta.url));

execSync("tsc --build ./transform/tsconfig.json");

function emsdkEnv() {
  return {
    env: "/Users/q540239/dev/emsdk:/Users/q540239/dev/emsdk/upstream/emscripten:" + process.env["PATH"],
    ...process.env,
  };
}

execSync("emcmake cmake -B build_wasm -S .", { encoding: "utf8", stdio: "inherit", env: emsdkEnv() });
execSync("cmake --build build_wasm --target wasm-instrumentation", {
  encoding: "utf8",
  stdio: "inherit",
  env: emsdkEnv(),
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
