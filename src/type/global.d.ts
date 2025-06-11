import { SourceFunctionInfo } from "../interface.ts";

declare global {
  // store listFunctions transform results in global
  let functionInfos: SourceFunctionInfo[];
  // store listTestNames transform results in global
  let testNames: string[];
}

export {};
