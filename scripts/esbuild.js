import { resolve } from "path";
import * as esbuild from "esbuild";
import { fileURLToPath, URL } from "url";
import child_process from "node:child_process";
import { promisify } from "node:util";
import pkg from "@sprout2000/esbuild-copy-plugin";
const { copyPlugin } = pkg;
const exec = promisify(child_process.exec);

const __dirname = fileURLToPath(new URL(".", import.meta.url));

await exec("tsc --build ./transform/tsconfig.json");

await exec("cmake -B build instrumentation -S instrumentation");

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
