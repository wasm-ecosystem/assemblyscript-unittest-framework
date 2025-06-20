#!/usr/bin/env -S node --experimental-wasi-unstable-preview1 --experimental-wasm-bigint

import chalk from "chalk";
import fs from "fs-extra";
import { exit } from "node:process";
import { resolve } from "node:path";
import { Command } from "commander";
import { pathToFileURL } from "node:url";

import { validateArgument, start_unit_test } from "../dist/index.js";

const program = new Command();
program
  .option("--config <config file>", "path of config file", "as-test.config.js")

  .option("--temp <path>", "test template file folder")
  .option("--output <path>", "coverage report output folder")
  .option("--mode <output mode>", "coverage report output format")

  .option("--coverageLimit [error warning...]", "set warn(yellow) and error(red) upper limit in coverage report")
  .option("--collectCoverage <boolean>", "whether to collect coverage information and report")

  .option("--testcase <testcases...>", "run only specified test cases deprecated, use --testFiles instead")
  .option("--testFiles <testFiles...>", "run only specified test files")
  .option("--testNamePattern <test name pattern>", "run only tests with a name that matches the regex pattern")
  .option("--onlyFailures", "Run tests that failed in the previous");

program.parse(process.argv);
const options = program.opts();

const configPath = resolve(".", options.config);
if (!fs.pathExistsSync(configPath)) {
  console.error(chalk.redBright("Miss config file") + "\n");
  console.error(program.helpInformation());
  exit(-1);
}
const config = (await import(pathToFileURL(configPath))).default;

const includes = config.include;
if (includes === undefined) {
  console.error(chalk.redBright("Miss include in config file") + "\n");
  exit(-1);
}
const excludes = config.exclude || [];
validateArgument(includes, excludes);

if (options.testcase !== undefined) {
  console.log(
    chalk.yellowBright(
      "Warning: --testcase is deprecated, please use --testFiles instead, --testcase will be removed in next versions"
    )
  );
}
const testFiles = options.testFiles || options.testcase;

const onlyFailures = options.onlyFailures || false;

// if enabled testcase or testNamePattern or onlyFailures, disable collectCoverage by default
const collectCoverage =
  Boolean(options.collectCoverage) ||
  config.collectCoverage ||
  (testFiles !== undefined && options.testNamePattern !== undefined && !onlyFailures);

const testOption = {
  includes,
  excludes,
  testFiles,
  testNamePattern: options.testNamePattern,
  collectCoverage,
  onlyFailures,

  flags: config.flags || "",
  imports: config.imports || undefined,

  tempFolder: options.temp || config.temp || "coverage",
  outputFolder: options.output || config.output || "coverage",
  mode: options.mode || config.mode || "table",
  warnLimit: Number(options.coverageLimit?.at(1)),
  errorLimit: Number(options.coverageLimit?.at(0)),
};

start_unit_test(testOption)
  .then((success) => {
    if (!success) {
      console.error(chalk.redBright("Test Failed") + "\n");
      exit(255);
    }
  })
  .catch((e) => {
    console.error(chalk.redBright("framework crash, error message: ") + chalk.yellowBright(`${e.stack}`) + "\n");
    console.error(
      "please submit an issue at https://github.com/wasm-ecosystem/assemblyscript-unittest-framework/issues"
    );
    exit(255);
  });
