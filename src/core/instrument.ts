import initInstrumenter from "../../build_wasm/bin/wasm-instrumentation.js";
import { InstrumentResult } from "../interface.js";

export async function instrument(sourceWasms: string[], sourceCodePaths: string[]): Promise<InstrumentResult[]> {
  const includeRegexs = sourceCodePaths.map((path) => {
    return `(start:)?${path.slice(0, -3)}.*`;
  });
  const includeFilter = JSON.stringify(includeRegexs);
  const res: InstrumentResult[] = [];
  const instrumenter = await initInstrumenter();
  for (const sourceFile of sourceWasms) {
    const baseName = sourceFile.slice(0, -5);
    const outputFile = baseName.concat(".instrumented.wasm");
    const reportFunction = "covInstrument/traceExpression";
    const sourceMapFile = baseName.concat(".wasm.map");
    const debugInfoFile = baseName.concat(".debugInfo.json");
    const expectInfoFile = baseName.concat(".expectInfo.json");

    const source = instrumenter.allocateUTF8(sourceFile);
    const output = instrumenter.allocateUTF8(outputFile);
    const report = instrumenter.allocateUTF8(reportFunction);
    const sourceMap = instrumenter.allocateUTF8(sourceMapFile);
    const debugInfo = instrumenter.allocateUTF8(debugInfoFile);
    const expectInfo = instrumenter.allocateUTF8(expectInfoFile);
    const include = instrumenter.allocateUTF8(includeFilter);

    instrumenter._wasm_instrument(source, output, report, sourceMap, expectInfo, debugInfo, include, 0, true);
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
  }

  return res;
}
