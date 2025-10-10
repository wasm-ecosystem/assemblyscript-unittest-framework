import { SourceFunctionInfo } from "../interface.ts";

declare global {
  // why use var: [Remove block-scoped bindings from globalThis](https://github.com/microsoft/TypeScript/issues/30547)
  // store listFunctions transform results in global
  // eslint-disable-next-line no-var
  var __functionInfos: Map<string, SourceFunctionInfo[]> | undefined;
  // store listTestNames transform results in global
  // eslint-disable-next-line no-var
  var testNames: string[];
}

export {};
