// ref: https://v8.dev/docs/stack-trace-api

import { readFile } from "node:fs/promises";
import { parseSourceMapPath } from "./wasmparser.js";

export interface WebAssemblyCallSite {
  functionName: string;
  fileName: string;
  lineNumber: number;
  columnNumber: number;
}

interface WebAssemblyModuleInfo {
  wasmPath: string;
  sourceMapUrl: string | null;
}

function createWebAssemblyCallSite(
  callSite: NodeJS.CallSite,
  moduleInfo: WebAssemblyModuleInfo
): WebAssemblyCallSite | null {
  if (!callSite.getFileName()?.startsWith("wasm")) {
    // ignore non-wasm call sites
    return null;
  }
  if (moduleInfo.sourceMapUrl !== null) {
    // use source map
    return {
      fileName: moduleInfo.wasmPath,
      functionName: `wasm-function[${callSite.getFunction()}]`,
      lineNumber: callSite.getLineNumber() || -1,
      columnNumber: callSite.getColumnNumber() || -1,
    };
  }
  // default
  return {
    fileName: moduleInfo.wasmPath,
    functionName: `wasm-function[${callSite.getFunction()}]`,
    lineNumber: callSite.getLineNumber() || -1,
    columnNumber: callSite.getColumnNumber() || -1,
  };
}

export class ExecutionError {
  constructor(
    public message: string,
    public stacks: WebAssemblyCallSite[]
  ) {}
}

export async function handleWebAssemblyError(
  error: WebAssembly.RuntimeError,
  wasmPath: string
): Promise<ExecutionError> {
  const wasmBuffer = await readFile(wasmPath);
  const sourceMapUrl = parseSourceMapPath(wasmBuffer.buffer as ArrayBuffer);
  const originalPrepareStackTrace = Error.prepareStackTrace;
  let stacks: WebAssemblyCallSite[] = [];
  Error.prepareStackTrace = (_: Error, structuredStackTrace: NodeJS.CallSite[]) => {
    stacks = structuredStackTrace
      .map((callSite) => createWebAssemblyCallSite(callSite, { wasmPath, sourceMapUrl }))
      .filter((callSite) => callSite != null);
  };
  error.stack; // trigger prepareStackTrace
  Error.prepareStackTrace = originalPrepareStackTrace;
  return new ExecutionError(error.message, stacks);
}
