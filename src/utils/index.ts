import { Imports as ASImports } from "@assemblyscript/loader";

export function json2map<V>(json: Record<string, V>): Map<string, V> {
  const res = new Map<string, V>();
  for (const key in json) {
    const value = json[key];
    if (value === undefined) {
      throw new Error(`json parse failed: ${JSON.stringify(json)}`);
    }
    res.set(key, value);
  }
  return res;
}

/**
 * return if the functionName is in fileName.
 * @param fileName example: "assembly/assertCollector.ts"
 * @param functionName example:
 *    "start:assembly/assertCollector~anonymous|0"
 *    || "assemblly/assertCollector/addDescription"
 */
export function checkFunctionName(fileName: string, functionName: string) {
  const regex = new RegExp(`^(start:)?${fileName.slice(0, -3)}[/~]`);
  return regex.test(functionName);
}

export function isIncluded(r1: [number, number], r2: [number, number]) {
  /**
   * range :[startLine, endLine]
   * determine if function r1 is included in function r2 by line range
   * r1 means function line range info from instrumenting
   * r2 means function line range info from transform
   */
  return r1[0] >= r2[0] && r1[1] <= r2[1];
}

export function checkGenerics(functionName: string): string | undefined {
  const startIndex = functionName.indexOf("<");
  const endIndex = functionName.lastIndexOf(">");
  if (startIndex !== -1 && endIndex !== -1) {
    return functionName.slice(0, startIndex) + functionName.slice(endIndex + 1);
  }
  return;
}

// list imports of a given wasm binary (buffer)
// importList format should be as follows：
// [
//   { module: 'env', name: 'memory', kind: 'memory' },
//   { module: 'env', name: 'myFunction', kind: 'function' },
//   ...
// ]
export async function parseWasmImports(binary: Buffer) {
  const mod = await WebAssembly.compile(binary);
  const importList = WebAssembly.Module.imports(mod);

  return importList;
}

export function supplyDefaultFunction(importList: WebAssembly.ModuleImportDescriptor[], importObject: ASImports) {
  for (const imp of importList) {
    if (imp.kind === "function") {
      const moduleName = imp.module;
      const funcName = imp.name;
      if (!importObject[moduleName]?.[funcName]) {
        if (!importObject[moduleName]) {
          importObject[moduleName] = {};
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (importObject[moduleName] as any)[funcName] = (...args: any[]): any => {
          // notify that a default function has been called
          console.log(`Default stub called for ${moduleName}.${funcName}, args:`, args);
          return 0;
        };
      }
    }
  }
}
