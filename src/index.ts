import chalk from "chalk";
import { emptydirSync } from "fs-extra";
import { Parser } from "./parser/index.js";
import { compile } from "./core/compile.js";
import { AssertResult } from "./assertResult.js";
import { precompile } from "./core/precompile.js";
import { instrument } from "./core/instrument.js";
import { execWasmBinarys } from "./core/execute.js";
import { generateReport, reportConfig } from "./generator/index.js";
import { TestOption } from "./interface.js";

function logAssertResult(trace: AssertResult): void {
  const render = (failed: number, total: number) =>
    (trace.fail === 0 ? chalk.greenBright(total) : chalk.redBright(total - failed)) + "/" + trace.total.toString();
  console.log(`\ntest case: ${render(trace.fail, trace.total)} (success/total)\n`);
  if (trace.fail !== 0) {
    console.log(chalk.red("Error Message: "));
    for (const [k, errMsgs] of trace.failed_info.entries()) {
      console.log(`\t${k}: `);
      for (const v of errMsgs) {
        console.log("\t\t" + chalk.yellow(v));
      }
    }
  }
}

export function validatArgument(includes: unknown, excludes: unknown) {
  if (!Array.isArray(includes)) {
    throw new TypeError("include section illegal");
  }
  if (!Array.isArray(excludes)) {
    throw new TypeError("exclude section illegal");
  }
  for (const includePath of includes) {
    if (typeof includePath !== "string") {
      throw new TypeError("include section illegal");
    }
  }
  for (const excludePath of excludes) {
    if (typeof excludePath !== "string") {
      throw new TypeError("exclude section illegal");
    }
  }
}

/**
 * main function of unit-test, will throw Exception in most condition except job carsh
 */
export async function start_unit_test(options: TestOption): Promise<boolean> {
  emptydirSync(options.outputFolder);
  emptydirSync(options.tempFolder);
  const unittestPackage = await precompile(
    options.includes,
    options.excludes,
    options.testcases,
    options.testNamePattern,
    options.collectCoverage,
    options.flags
  );
  console.log(chalk.blueBright("code analysis: ") + chalk.bold.greenBright("OK"));

  const wasmPaths = await compile(unittestPackage.testCodePaths, options.tempFolder, options.flags);
  console.log(chalk.blueBright("compile testcases: ") + chalk.bold.greenBright("OK"));

  const sourcePaths = unittestPackage.sourceFunctions ? Array.from(unittestPackage.sourceFunctions.keys()) : [];
  const instrumentResult = await instrument(wasmPaths, sourcePaths, options.collectCoverage);
  console.log(chalk.blueBright("instrument: ") + chalk.bold.greenBright("OK"));

  const executedResult = await execWasmBinarys(options.tempFolder, instrumentResult, options.imports);
  console.log(chalk.blueBright("execute testcases: ") + chalk.bold.greenBright("OK"));

  logAssertResult(executedResult);
  if (options.collectCoverage) {
    const debugInfoFiles = instrumentResult.map((res) => res.debugInfo);
    const parser = new Parser();
    const fileCoverageInfo = await parser.parse(debugInfoFiles, unittestPackage.sourceFunctions!);
    reportConfig.warningLimit = options.warnLimit || reportConfig.warningLimit;
    reportConfig.errorLimit = options.errorLimit || reportConfig.errorLimit;
    generateReport(options.mode, options.outputFolder, fileCoverageInfo);
  }

  return executedResult.fail === 0;
}
