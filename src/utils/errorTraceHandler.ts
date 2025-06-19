// ref: https://v8.dev/docs/stack-trace-api

import { readFile } from "node:fs/promises";
import { parseSourceMapPath } from "./wasmparser.js";
import { BasicSourceMapConsumer, IndexedSourceMapConsumer, SourceMapConsumer } from "source-map";

export interface WebAssemblyCallSite {
  functionName: string;
  fileName: string;
  lineNumber: number;
  columnNumber: number;
}

interface WebAssemblyModuleInfo {
  wasmPath: string;
  sourceMapConsumer: SourceMapHandler | null;
}

type SourceMapHandler = BasicSourceMapConsumer | IndexedSourceMapConsumer;

interface SourceLocation {
  fileName: string;
  lineNumber: number;
  columnNumber: number;
}

function getOriginLocationWithSourceMap(
  line: number | null,
  column: number | null,
  sourceMapConsumer: SourceMapHandler | null
): SourceLocation | null {
  if (sourceMapConsumer === null || line === null || column === null) {
    return null;
  }
  const originPosition = sourceMapConsumer.originalPositionFor({
    line: line,
    column: column,
  });
  if (originPosition.source === null || originPosition.line === null || originPosition.column === null) {
    return null;
  }
  return {
    fileName: originPosition.source,
    lineNumber: originPosition.line,
    columnNumber: originPosition.column,
  };
}

function getWebAssemblyFunctionName(callSite: NodeJS.CallSite): string {
  return callSite.getFunctionName() ?? `wasm-function[${callSite.getFunction()}]`;
}

function createWebAssemblyCallSite(
  callSite: NodeJS.CallSite,
  moduleInfo: WebAssemblyModuleInfo
): WebAssemblyCallSite | null {
  if (!callSite.getFileName()?.startsWith("wasm")) {
    // ignore non-wasm call sites
    return null;
  }
  const line: number | null = callSite.getLineNumber();
  const column: number | null = callSite.getColumnNumber();
  const originalPosition: SourceLocation | null = getOriginLocationWithSourceMap(
    line,
    column,
    moduleInfo.sourceMapConsumer
  );
  if (originalPosition) {
    return {
      fileName: originalPosition.fileName,
      functionName: getWebAssemblyFunctionName(callSite),
      lineNumber: originalPosition.lineNumber,
      columnNumber: originalPosition.columnNumber,
    };
  }
  // fallback to the original call site
  return {
    fileName: moduleInfo.wasmPath,
    functionName: getWebAssemblyFunctionName(callSite),
    lineNumber: line || -1,
    columnNumber: column || -1,
  };
}

export interface ExecutionError {
  message: string;
  stacks: WebAssemblyCallSite[];
}

async function getSourceMapConsumer(sourceMapPath: string): Promise<BasicSourceMapConsumer | IndexedSourceMapConsumer> {
  return new Promise<BasicSourceMapConsumer | IndexedSourceMapConsumer>(async (resolve, reject) => {
    let sourceMapContent: string | null = null;
    try {
      sourceMapContent = await readFile(sourceMapPath, "utf8");
    } catch (error) {
      reject(error);
      return;
    }
    SourceMapConsumer.with(sourceMapContent, null, (consumer) => {
      resolve(consumer);
    });
  });
}

export async function handleWebAssemblyError(
  error: WebAssembly.RuntimeError,
  wasmPath: string
): Promise<ExecutionError> {
  const wasmBuffer = await readFile(wasmPath);
  const sourceMapPath = parseSourceMapPath(wasmBuffer.buffer as ArrayBuffer);
  const sourceMapConsumer = sourceMapPath ? await getSourceMapConsumer(sourceMapPath) : null;
  const originalPrepareStackTrace = Error.prepareStackTrace;
  let stacks: WebAssemblyCallSite[] = [];
  Error.prepareStackTrace = (_: Error, structuredStackTrace: NodeJS.CallSite[]) => {
    stacks = structuredStackTrace
      .map((callSite) => createWebAssemblyCallSite(callSite, { wasmPath, sourceMapConsumer }))
      .filter((callSite) => callSite != null);
  };
  error.stack; // trigger prepareStackTrace
  Error.prepareStackTrace = originalPrepareStackTrace;
  return { message: error.message, stacks };
}
