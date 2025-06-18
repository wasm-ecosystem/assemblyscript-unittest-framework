import { WASI } from "node:wasi";
import { promises } from "node:fs";
import { ensureDirSync } from "fs-extra";
import { basename } from "node:path";
import { instantiate, Imports as ASImports } from "@assemblyscript/loader";
import { AssertResult } from "../assertResult.js";
import { Imports, ImportsArgument, InstrumentResult } from "../interface.js";
import { mockInstrumentFunc } from "../utils/import.js";
import { supplyDefaultFunction } from "../utils/index.js";
import { parseImportFunctionInfo } from "../utils/wasmparser.js";
import { ExecutionRecorder } from "./executionRecorder.js";
import { CoverageRecorder } from "./covRecorder.js";
import assert from "node:assert";

const readFile = promises.readFile;

async function nodeExecutor(
  wasm: string,
  outFolder: string,
  matchedTestNames?: string[],
  imports?: Imports
): Promise<ExecutionRecorder> {
  const wasi = new WASI({
    args: ["node", basename(wasm)],
    env: process.env,
    preopens: {
      "/": outFolder,
    },
    version: "preview1",
  });

  const executionRecorder = new ExecutionRecorder();
  const coverageRecorder = new CoverageRecorder();

  const importsArg = new ImportsArgument();
  const userDefinedImportsObject = imports === undefined ? {} : imports!(importsArg);
  const importObject: ASImports = {
    wasi_snapshot_preview1: wasi.wasiImport,
    ...executionRecorder.getCollectionFuncSet(importsArg),
    mockInstrument: mockInstrumentFunc,
    ...coverageRecorder.getCollectionFuncSet(),
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
    const execTestFunction = ins.exports["executeTestFunction"];
    assert(typeof execTestFunction === "function");
    if (matchedTestNames === undefined) {
      // means execute all testFunctions
      for (const functionInfo of executionRecorder.registerFunctions) {
        const functionIndex = functionInfo[1];
        (execTestFunction as (a: number) => void)(functionIndex);
        mockInstrumentFunc["mockFunctionStatus.clear"]();
      }
    } else {
      for (const functionInfo of executionRecorder.registerFunctions) {
        const [testName, functionIndex] = functionInfo;
        if (matchedTestNames.includes(testName)) {
          console.log(testName);
          (execTestFunction as (a: number) => void)(functionIndex);
          mockInstrumentFunc["mockFunctionStatus.clear"]();
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.stack);
    }
    throw new Error("node executor abort.");
  }
  coverageRecorder.outputTrace(wasm);
  return executionRecorder;
}

export async function execWasmBinarys(
  outFolder: string,
  instrumentResult: InstrumentResult[],
  matchedTestNames?: string[],
  imports?: Imports
): Promise<AssertResult> {
  const assertRes = new AssertResult();
  ensureDirSync(outFolder);
  await Promise.all<void>(
    instrumentResult.map(async (res): Promise<void> => {
      const { instrumentedWasm, expectInfo } = res;
      const recorder: ExecutionRecorder = await nodeExecutor(instrumentedWasm, outFolder, matchedTestNames, imports);
      await assertRes.merge(recorder, expectInfo);
    })
  );
  return assertRes;
}
