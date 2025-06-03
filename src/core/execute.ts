import { WASI } from "node:wasi";
import { promises } from "node:fs";
import { ensureDirSync } from "fs-extra";
import { basename } from "node:path";
import { instantiate, Imports as ASImports } from "@assemblyscript/loader";
import { AssertResult } from "../assertResult.js";
import { Imports, ImportsArgument } from "../index.js";
import { InstrumentResult } from "../interface.js";
import { mockInstruFunc, covInstruFunc } from "../utils/import.js";
import { supplyDefaultFunction } from "../utils/index.js";
import { parseImportFunctionInfo } from "../utils/wasmparser.js";
import { ExecutionRecorder } from "./executionRecorder.js";

const readFile = promises.readFile;

async function nodeExecutor(wasm: string, outFolder: string, imports: Imports): Promise<ExecutionRecorder> {
  const wasi = new WASI({
    args: ["node", basename(wasm)],
    env: process.env,
    preopens: {
      "/": outFolder,
    },
    version: "preview1",
  });

  const recorder = new ExecutionRecorder();

  const importsArg = new ImportsArgument();
  const userDefinedImportsObject = imports === null ? {} : imports(importsArg);
  const importObject: ASImports = {
    wasi_snapshot_preview1: wasi.wasiImport,
    ...recorder.getCollectionFuncSet(importsArg),
    mockInstrument: mockInstruFunc,
    ...covInstruFunc(wasm),
    ...userDefinedImportsObject,
  } as ASImports;
  const binaryBuffer = await readFile(wasm);
  const binary = binaryBuffer.buffer.slice(binaryBuffer.byteOffset, binaryBuffer.byteOffset + binaryBuffer.byteLength);
  const importFuncList = parseImportFunctionInfo(binary as ArrayBuffer);
  supplyDefaultFunction(importFuncList, importObject);
  const ins = await instantiate(binary, importObject);
  importsArg.module = ins.module;
  importsArg.instance = ins.instance;
  importsArg.exports = ins.exports;
  try {
    wasi.start(ins);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.stack);
    }
    throw new Error("node executor abort.");
  }
  return recorder;
}

export async function execWasmBinarys(
  outFolder: string,
  instrumentResult: InstrumentResult[],
  imports: Imports
): Promise<AssertResult> {
  const assertRes = new AssertResult();
  ensureDirSync(outFolder);
  await Promise.all<void>(
    instrumentResult.map(async (res): Promise<void> => {
      const { instrumentedWasm, expectInfo } = res;
      const recorder: ExecutionRecorder = await nodeExecutor(instrumentedWasm, outFolder, imports);
      await assertRes.merge(recorder, expectInfo);
    })
  );
  return assertRes;
}
