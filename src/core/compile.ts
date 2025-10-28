import { join, relative } from "node:path";
import { findRoot } from "../utils/pathResolver.js";
import { ascMain } from "../utils/ascWrapper.js";
import { TestOption } from "../interface.js";

export type CompileOption = Pick<TestOption, "isolated" | "outputFolder" | "flags">;

export async function compile(testCodePaths: string[], entryFiles: string[], option: CompileOption): Promise<string[]> {
  const { isolated } = option;
  return isolated
    ? await separatedCompile(testCodePaths, entryFiles, option)
    : [await unifiedCompile(testCodePaths, entryFiles, option)];
}

function getNewPath(newFolder: string, oldFolder: string, srcPath: string): string {
  return join(newFolder, relative(oldFolder, srcPath)).replaceAll(/\\/g, "/");
}

function getAscArgs(sources: string[], outputWasm: string, outputWat: string, flags: string): string[] {
  let ascArgv = [
    ...sources,
    "--outFile",
    outputWasm,
    "--textFile",
    outputWat,
    "--exportStart",
    // avoid name conflict with user-defined start functions
    "__unit_test_start",
    "--sourceMap",
    "--debug",
    "-O0",
  ];
  if (flags.length > 0) {
    const argv = flags.split(" ");
    ascArgv = ascArgv.concat(argv);
  }
  return ascArgv;
}

async function unifiedCompile(testCodePaths: string[], entryFiles: string[], option: CompileOption): Promise<string> {
  const { outputFolder, flags } = option;
  const outputWasm = join(outputFolder, "test.wasm").replaceAll(/\\/g, "/");
  const outputWat = join(outputFolder, "test.wat").replaceAll(/\\/g, "/");
  const ascArgv = getAscArgs(testCodePaths.concat(entryFiles), outputWasm, outputWat, flags);
  await ascMain(ascArgv, false);
  return outputWasm;
}

async function separatedCompile(
  testCodePaths: string[],
  entryFiles: string[],
  option: CompileOption
): Promise<string[]> {
  const { outputFolder, flags } = option;
  const wasm: string[] = [];
  const root = findRoot(testCodePaths);
  const compileOneFile = async (testCodePath: string) => {
    const outputWasm = getNewPath(outputFolder, root, testCodePath).slice(0, -2).concat("wasm");
    wasm.push(outputWasm);
    const outputWat = getNewPath(outputFolder, root, testCodePath).slice(0, -2).concat("wat");
    const ascArgv = getAscArgs([testCodePath, ...entryFiles], outputWasm, outputWat, flags);
    await ascMain(ascArgv, false);
  };

  // Here, for-await is more efficient and less memory cost than Promise.all()
  for (const codePath of testCodePaths) {
    await compileOneFile(codePath);
  }

  return wasm;
}
