import chalk from "chalk";
import { emptydirSync } from "fs-extra";
import { ASUtil } from "@assemblyscript/loader";
import { Parser } from "./parser/index.js";
import { compile } from "./core/compile.js";
import { AssertResult } from "./assertResult.js";
import { precompile } from "./core/precompile.js";
import { instrument } from "./core/instrument.js";
import { execWasmBinaries } from "./core/execute.js";
import { generateReport, reportConfig } from "./generator/index.js";

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

export abstract class UnitTestFramework {
  /**
   * function to redirect log message to unittest framework
   * @param msg: message to log
   */
  abstract log(msg: string): void;
}

export class ImportsArgument {
  module: WebAssembly.Module | null = null;
  instance: WebAssembly.Instance | null = null;
  exports: (ASUtil & Record<string, unknown>) | null = null;
  constructor(public framework: UnitTestFramework) {}
}

export type Imports = ((arg: ImportsArgument) => Record<string, unknown>) | null;

export interface FileOption {
  includes: string[];
  excludes: string[];
  testcases: string[] | undefined;
  testNamePattern: string | undefined;
}
export interface TestOption {
  flags: string;
  imports: Imports;
}
export interface OutputOption {
  tempFolder: string;
  outputFolder: string;
  mode: OutputMode | OutputMode[];
  warnLimit?: number;
  errorLimit?: number;
}
export type OutputMode = "html" | "json" | "table";

/**
 * main function of unit-test, will throw Exception in most condition except job carsh
 */
export async function start_unit_test(fo: FileOption, to: TestOption, oo: OutputOption): Promise<boolean> {
  emptydirSync(oo.outputFolder);
  emptydirSync(oo.tempFolder);
  const unittestPackage = await precompile(fo.includes, fo.excludes, fo.testcases, fo.testNamePattern, to.flags);
  console.log(chalk.blueBright("code analysis: ") + chalk.bold.greenBright("OK"));
  const wasmPaths = await compile(unittestPackage.testCodePaths, oo.tempFolder, to.flags);
  console.log(chalk.blueBright("compile testcases: ") + chalk.bold.greenBright("OK"));
  const instrumentResult = await instrument(wasmPaths, Array.from(unittestPackage.sourceFunctions.keys()));
  console.log(chalk.blueBright("instrument: ") + chalk.bold.greenBright("OK"));
  const executedResult = await execWasmBinaries(oo.tempFolder, instrumentResult, to.imports);
  console.log(chalk.blueBright("execute testcases: ") + chalk.bold.greenBright("OK"));
  executedResult.print(console.log);
  const parser = new Parser();
  const fileCoverageInfo = await parser.parse(instrumentResult, unittestPackage.sourceFunctions);
  reportConfig.warningLimit = oo.warnLimit ?? reportConfig.warningLimit;
  reportConfig.errorLimit = oo.errorLimit ?? reportConfig.errorLimit;
  generateReport(oo.mode, oo.outputFolder, fileCoverageInfo);

  return executedResult.fail === 0;
}
