import { WASI } from "node:wasi";
import { promises } from "node:fs";
import { ensureDirSync } from "fs-extra";
import { instantiate, Imports as ASImports } from "@assemblyscript/loader";
import { ExecutionResult } from "../executionResult.js";
import { Imports, ImportsArgument } from "../index.js";
import { InstrumentResult } from "../interface.js";
import { mockInstrumentFunc } from "../utils/import.js";
import { supplyDefaultFunction } from "../utils/index.js";
import { parseImportFunctionInfo } from "../utils/wasmparser.js";
import { ExecutionRecorder, SingleExecutionResult } from "./executionRecorder.js";
import { CoverageRecorder } from "./covRecorder.js";

const readFile = promises.readFile;

async function nodeExecutor(
  instrumentResult: InstrumentResult,
  outFolder: string,
  imports: Imports
): Promise<SingleExecutionResult> {
  const wasi = new WASI({
    args: ["node", instrumentResult.baseName],
    env: process.env,
    preopens: {
      "/": outFolder,
    },
    version: "preview1",
  });

  const executionRecorder = new ExecutionRecorder();
  const coverageRecorder = new CoverageRecorder();

  const importsArg = new ImportsArgument(executionRecorder);
  const userDefinedImportsObject = imports === null ? {} : imports(importsArg);
  const importObject: ASImports = {
    wasi_snapshot_preview1: wasi.wasiImport,
    ...executionRecorder.getCollectionFuncSet(importsArg),
    mockInstrument: mockInstrumentFunc,
    ...coverageRecorder.getCollectionFuncSet(),
    ...userDefinedImportsObject,
  } as ASImports;
  const binaryBuffer = await readFile(instrumentResult.instrumentedWasm);
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
  coverageRecorder.outputTrace(instrumentResult.traceFile);
  return executionRecorder.result;
}

export async function execWasmBinaries(
  outFolder: string,
  instrumentResults: InstrumentResult[],
  imports: Imports
): Promise<ExecutionResult> {
  const assertRes = new ExecutionResult();
  ensureDirSync(outFolder);
  await Promise.all<void>(
    instrumentResults.map(async (instrumentResult): Promise<void> => {
      const result: SingleExecutionResult = await nodeExecutor(instrumentResult, outFolder, imports);
      await assertRes.merge(result, instrumentResult.expectInfo);
    })
  );
  return assertRes;
}
