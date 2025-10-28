/**
 * Will transform all source file to get all relative functions
 */

import ignore from "ignore";
import { join, relative, resolve } from "node:path";
import { getIncludeFiles } from "../utils/pathResolver.js";
import { SourceFunctionInfo, UnittestPackage } from "../interface.js";
import { projectRoot } from "../utils/projectRoot.js";
import { ascMain } from "../utils/ascWrapper.js";
import assert from "node:assert";

function getFilterByName(testNamePattern: string | null, failedTestNames: string[]): UnittestPackage["filterByName"] {
  assert(
    !(testNamePattern !== null && failedTestNames.length > 0),
    "Cannot use testNamePattern and failedTestNames together"
  );
  if (testNamePattern !== null) {
    const regexPattern = new RegExp(testNamePattern);
    return (fullTestName: string): boolean => regexPattern.test(fullTestName);
  }
  if (failedTestNames.length > 0) {
    return (fullTestName: string): boolean => failedTestNames.includes(fullTestName);
  }
  return (): boolean => true;
}

export async function precompile(
  includes: string[],
  excludes: string[],
  testFiles: string[] | undefined, // this field specifed test file names
  testNamePattern: string | null,
  failedTestNames: string[],
  collectCoverage: boolean,
  flags: string
): Promise<UnittestPackage> {
  let sourceFunctions: Map<string, SourceFunctionInfo[]> | undefined = undefined;
  if (collectCoverage) {
    const sourceCodePaths = getRelatedFiles(includes, excludes, (path: string) => !path.endsWith(".test.ts"));
    const sourceTransformFunction = join(projectRoot, "transform", "listFunctions.mjs");
    globalThis.__functionInfos = undefined;
    sourceFunctions = await transform(sourceTransformFunction, sourceCodePaths, flags, () => __functionInfos);
  }
  return {
    // if specify testFiles, use testFiles for unittest
    // otherwise, get testFiles(*.test.ts) in includes directory
    testCodePaths: testFiles ?? getRelatedFiles(includes, excludes, (path: string) => path.endsWith(".test.ts")),
    filterByName: getFilterByName(testNamePattern, failedTestNames),
    sourceFunctions: sourceFunctions || new Map<string, SourceFunctionInfo[]>(),
  };
}

async function transform<T>(
  transformFunction: string,
  codePath: string | string[],
  flags: string,
  collectCallback: () => T
) {
  let ascArgv = ["--noEmit", "--disableWarning", "--transform", transformFunction, "-O0"];
  if (typeof codePath === "string") {
    ascArgv.push(codePath);
  } else {
    ascArgv.push(...codePath);
  }
  if (flags) {
    const argv = flags.split(" ");
    ascArgv = ascArgv.concat(argv);
  }
  await ascMain(ascArgv, true);
  return collectCallback();
}

// a. include in config
// b. exclude in config
export function getRelatedFiles(includes: string[], excludes: string[], filter: (path: string) => boolean) {
  const result: string[] = [];
  const includeFiles = getIncludeFiles(includes, (path) => path.endsWith(".ts")); // a
  const exc = ignore().add(excludes);

  for (const path of includeFiles) {
    const relativePath = relative(".", path);
    if (relativePath.startsWith("..")) {
      throw new Error(`file ${path} out of scope (${resolve(".")})`);
    }
    if (exc.ignores(relativePath)) {
      continue; // ab
    }
    if (filter(path)) {
      result.push(path.replaceAll(/\\/g, "/"));
    }
  }
  return result;
}
