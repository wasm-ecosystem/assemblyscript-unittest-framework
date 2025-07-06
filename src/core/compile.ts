import { join, relative } from "node:path";
import { findRoot } from "../utils/pathResolver.js";
import { ascMain } from "../utils/ascWrapper.js";

export async function compile(testCodePaths: string[], outputFolder: string, compileFlags: string): Promise<string[]> {
  const wasm: string[] = [];
  const root = findRoot(testCodePaths);
  const compile = async (testCodePath: string) => {
    const outputWasm = getNewPath(outputFolder, root, testCodePath).slice(0, -2).concat("wasm");
    wasm.push(outputWasm);
    const outputWat = getNewPath(outputFolder, root, testCodePath).slice(0, -2).concat("wat");
    let ascArgv = [
      testCodePath,
      "--outFile",
      outputWasm,
      "--textFile",
      outputWat,
      "--exportStart",
      "_start",
      "--sourceMap",
      "--debug",
      "-O0",
    ];
    if (compileFlags) {
      const argv = compileFlags.split(" ");
      ascArgv = ascArgv.concat(argv);
    }
    await ascMain(ascArgv);
  };

  // Here, for-await is more efficient and less memory cost than Promise.all()
  for (const codePath of testCodePaths) {
    await compile(codePath);
  }

  return wasm;
}

function getNewPath(newFolder: string, oldFolder: string, srcPath: string): string {
  return join(newFolder, relative(oldFolder, srcPath)).replaceAll(/\\/g, "/");
}
