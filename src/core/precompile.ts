/**
 * Will transform all source file to get all relative functions
 */

import ignore from "ignore";
import { join, relative, resolve } from "node:path";
import { getIncludeFiles } from "../utils/pathResolver.js";
import { SourceFunctionInfo, UnittestPackage } from "../interface.js";
import { projectRoot } from "../utils/projectRoot.js";
import assert from "node:assert";
import { ascMain } from "../utils/ascWrapper.js";

// eslint-disable-next-line sonarjs/cognitive-complexity
export async function precompile(
  includes: string[],
  excludes: string[],
  testFiles: string[] | undefined, // this field specifed test file names
  testNamePattern: string | undefined,
  failedTestNames: string[],
  collectCoverage: boolean,
  flags: string
): Promise<UnittestPackage> {
  // if specify testFiles, use testFiles for unittest
  // otherwise, get testFiles(*.test.ts) in includes directory
  const testCodePaths = testFiles ?? getRelatedFiles(includes, excludes, (path: string) => path.endsWith(".test.ts"));
  const matchedTestFiles = new Set<string>();
  let matchedTestNames: string[] = [];

  if (testNamePattern || failedTestNames.length > 0) {
    // if enabled testNamePattern or enabled onlyFailures, need listTestName transform
    const testNameInfos = new Map<string, string[]>();
    const testNameTransformFunction = join(projectRoot, "transform", "listTestNames.mjs");
    for (const testCodePath of testCodePaths) {
      await transform(testNameTransformFunction, testCodePath, flags, () => {
        testNameInfos.set(testCodePath, testNames);
      });
    }
    if (testNamePattern) {
      const regexPattern = new RegExp(testNamePattern);
      for (const [fileName, testNames] of testNameInfos) {
        for (const testName of testNames) {
          if (regexPattern.test(testName)) {
            matchedTestNames.push(testName);
            matchedTestFiles.add(fileName);
          }
        }
      }
    }

    if (failedTestNames.length > 0) {
      matchedTestNames = failedTestNames;
      for (const [fileName, testNames] of testNameInfos) {
        for (const testName of testNames) {
          if (matchedTestNames.includes(testName)) {
            matchedTestFiles.add(fileName);
          }
        }
      }
    }

    assert(matchedTestFiles.size > 0, "No matched testname");
  }

  let sourceFunctions: Map<string, SourceFunctionInfo[]> | null = null;
  if (collectCoverage) {
    const sourceCodePaths = getRelatedFiles(includes, excludes, (path: string) => !path.endsWith(".test.ts"));
    const sourceTransformFunction = join(projectRoot, "transform", "listFunctions.mjs");
    sourceFunctions = await transform(sourceTransformFunction, sourceCodePaths, flags, () => __functionInfos);
  }
  return {
    testCodePaths: matchedTestFiles.size > 0 ? Array.from(matchedTestFiles) : testCodePaths,
    matchedTestNames,
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
