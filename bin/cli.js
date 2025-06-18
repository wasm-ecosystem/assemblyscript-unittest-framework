#!/usr/bin/env -S node --experimental-wasi-unstable-preview1 --experimental-wasm-bigint

import chalk from "chalk";
import fs from "fs-extra";
import { exit } from "node:process";
import { resolve } from "node:path";
import { Command } from "commander";
import { pathToFileURL } from "node:url";

import { validatArgument, start_unit_test } from "../dist/index.js";

const program = new Command();
program
  .option("--config <config file>", "path of config file", "as-test.config.js")
  .option("--testcase <testcases...>", "only run specified test cases")
  .option("--temp <path>", "test template file folder")
  .option("--output <path>", "coverage report output folder")
  .option("--mode <output mode>", "test result output format")
  .option("--coverageLimit [error warning...]", "set warn(yellow) and error(red) upper limit in coverage report")
  .option("--testNamePattern <test name pattern>", "run only tests with a name that matches the regex pattern");

program.parse(process.argv);
const options = program.opts();

if (options.config === undefined) {
  console.error(chalk.redBright("Miss config file") + "\n");
  console.error(program.helpInformation());
  exit(-1);
}
const configPath = resolve(".", options.config);
if (!fs.pathExistsSync(configPath)) {
  console.error(chalk.redBright("Miss config file") + "\n");
  console.error(program.helpInformation());
  exit(-1);
}
const config = (await import(pathToFileURL(configPath))).default;

let includes = config.include;
if (includes === undefined) {
  console.error(chalk.redBright("Miss include in config file") + "\n");
  exit(-1);
}
let excludes = config.exclude || [];
let testcases = options.testcase;

let flags = config.flags || "";
let imports = config.imports || null;

let mode = options.mode || config.mode || "table";

let tempFolder = options.temp || config.temp || "coverage";
let outputFolder = options.output || config.output || "coverage";

let errorLimit = options.coverageLimit?.at(0);
let warnLimit = options.coverageLimit?.at(1);

let testNamePattern = options.testNamePattern;

validatArgument(includes, excludes);
start_unit_test(
  { includes, excludes, testcases, testNamePattern },
  { flags, imports },
  { tempFolder, outputFolder, mode, warnLimit, errorLimit }
)
  .then((success) => {
    if (!success) {
      console.error(chalk.redBright("Test Failed") + "\n");
      exit(255);
    }
  })
  .catch((e) => {
    console.error(chalk.redBright(" Test crash, error message: ") + chalk.yellowBright(`${e.stack}`) + "\n");
    exit(255);
  });
