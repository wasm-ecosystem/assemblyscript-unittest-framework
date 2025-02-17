import initInstrumenter from "../../build/bin/wasm-instrumentation.js";
import { InstrumentResult } from "../interface.js";

export async function instrument(sourceWasms: string[], sourceCodePaths: string[]): Promise<InstrumentResult[]> {
  const includeRegexs = sourceCodePaths.map((path) => {
    return `(start:)?${path.slice(0, -3)}.*`;
  });
  const includeFilter = JSON.stringify(includeRegexs);
  const res: InstrumentResult[] = [];
  const instrumenter = await initInstrumenter();
  const pms = sourceWasms.map(async (sourceFile) => {
    const baseName = sourceFile.slice(0, -5);
    const outputFile = baseName.concat(".instrumented.wasm");
    const reportFunction = "covInstrument/traceExpression";
    const sourceMapFile = baseName.concat(".wasm.map");
    const debugInfoFile = baseName.concat(".debugInfo.json");
    const expectInfoFile = baseName.concat(".expectInfo.json");
    const [source, output, report, sourceMap, debugInfo, expectInfo, include] = [
      sourceFile,
      outputFile,
      reportFunction,
      sourceMapFile,
      debugInfoFile,
      expectInfoFile,
      includeFilter,
    ].map((s) => instrumenter.allocateUTF8(s));
    instrumenter._wasm_instrument(source, output, report, sourceMap, expectInfo, debugInfo, include, null, true);
    const result: InstrumentResult = {
      sourceWasm: sourceFile,
      instrumentedWasm: outputFile,
      debugInfo: debugInfoFile,
      expectInfo: expectInfoFile,
    };
    for (const ptr of [source, output, report, sourceMap, debugInfo, expectInfo, include]) {
      instrumenter._free(ptr);
    }
    res.push(result);
  });

  await Promise.all(pms);
  return res;
}
