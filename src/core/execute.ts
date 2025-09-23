import { WASI } from "node:wasi";
import { promises } from "node:fs";
import { ensureDirSync } from "fs-extra";
import { instantiate, Imports as ASImports } from "@assemblyscript/loader";
import { ExecutionResultSummary } from "../executionResult.js";
import { Imports, ImportsArgument, InstrumentResult } from "../interface.js";
import { supplyDefaultFunction } from "../utils/index.js";
import { parseImportFunctionInfo } from "../utils/wasmparser.js";
import { ExecutionRecorder, ExecutionResult } from "./executionRecorder.js";
import { MockStatusRecorder } from "./mockStatusRecorder.js";
import { CoverageRecorder } from "./covRecorder.js";
import assert from "node:assert";
import { ExecutionError, handleWebAssemblyError } from "../utils/errorTraceHandler.js";

const readFile = promises.readFile;

async function nodeExecutor(
  instrumentResult: InstrumentResult,
  outFolder: string,
  matchedTestNames: string[],
  imports?: Imports
): Promise<ExecutionResult> {
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
  const mockStatusRecorder = new MockStatusRecorder();

  const importsArg = new ImportsArgument(executionRecorder);
  const userDefinedImportsObject = imports === undefined ? {} : imports!(importsArg);
  const importObject: ASImports = {
    wasi_snapshot_preview1: wasi.wasiImport,
    __unittest_framework_env: {
      ...executionRecorder.getCollectionFuncSet(importsArg),
      ...mockStatusRecorder.getMockFuncSet(),
      ...coverageRecorder.getCollectionFuncSet(),
    },
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

  let isCrashed = false; // we don't want to crash any code after crash. AS' heap may be broken.

  const exceptionHandler = async (error: unknown) => {
    if (error instanceof WebAssembly.RuntimeError) {
      isCrashed = true;
      const errorMessage: ExecutionError = await handleWebAssemblyError(error, instrumentResult.instrumentedWasm);
      executionRecorder.notifyTestCrash(errorMessage);
      return;
    }
    // unrecoverable error, rethrow
    if (error instanceof Error) {
      console.error(error.stack);
    }
    throw new Error("node executor abort");
  };

  try {
    executionRecorder.startTestFunction(`${instrumentResult.baseName} - init`);
    wasi.start(ins);
  } catch (error) {
    await exceptionHandler(error);
  }
  executionRecorder.finishTestFunction();

  const execTestFunction = ins.exports["executeTestFunction"];
  assert(typeof execTestFunction === "function");

  for (const functionInfo of executionRecorder.registerFunctions) {
    if (isCrashed) {
      break;
    }
    const [testCaseName, functionIndex] = functionInfo;
    if (matchedTestNames.length === 0 || matchedTestNames.includes(testCaseName)) {
      executionRecorder.startTestFunction(testCaseName);
      try {
        (execTestFunction as (a: number) => void)(functionIndex);
      } catch (error) {
        await exceptionHandler(error);
      }
      executionRecorder.finishTestFunction();
      mockStatusRecorder.clear();
    }
  }

  coverageRecorder.outputTrace(instrumentResult.traceFile);
  return executionRecorder.result;
}

export async function execWasmBinaries(
  outFolder: string,
  instrumentResults: InstrumentResult[],
  matchedTestNames: string[],
  imports?: Imports
): Promise<ExecutionResultSummary> {
  const assertRes = new ExecutionResultSummary();
  ensureDirSync(outFolder);
  await Promise.all<void>(
    instrumentResults.map(async (instrumentResult): Promise<void> => {
      const result: ExecutionResult = await nodeExecutor(instrumentResult, outFolder, matchedTestNames, imports);
      await assertRes.merge(result, instrumentResult.expectInfo);
    })
  );
  return assertRes;
}
