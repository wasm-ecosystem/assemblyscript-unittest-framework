/**
 * Will transform all source file to get all relative functions
 */

import ignore from "ignore";
import { main } from "assemblyscript/asc";
import { join, relative, resolve } from "node:path";
import { getIncludeFiles } from "../utils/pathResolver.js";
import { SourceFunctionInfo, UnittestPackage } from "../interface.js";
import { projectRoot } from "../utils/projectRoot.js";
import assert from "node:assert";

export async function precompile(
  includes: string[],
  excludes: string[],
  testcases: string[] | undefined,
  testNamePattern: string | undefined,
  collectCoverage: boolean,
  flags: string
): Promise<UnittestPackage> {
  // if specify testcases, use testcases for unittest
  // otherwise, get testcases(*.test.ts) in includes directory
  const testCodePaths = testcases ?? getRelatedFiles(includes, excludes, (path: string) => path.endsWith(".test.ts"));

  if (testNamePattern) {
    const matchedTestNames: string[] = [];
    const matchedTestFiles = new Set<string>();
    const testNameInfos = new Map<string, string[]>();
    const testNameTransformFunction = join(projectRoot, "transform", "listTestNames.mjs");
    for (const testCodePath of testCodePaths) {
      await transform(testNameTransformFunction, testCodePath, flags, () => {
        testNameInfos.set(testCodePath, testNames);
      });
    }
    const regexPattern = new RegExp(testNamePattern);
    for (const [fileName, testNames] of testNameInfos) {
      for (const testName of testNames) {
        if (regexPattern.test(testName)) {
          matchedTestNames.push(testName);
          matchedTestFiles.add(fileName);
        }
      }
    }

    assert(matchedTestFiles.size > 0, `No matched testname using ${testNamePattern}`);
    return {
      testCodePaths: Array.from(matchedTestFiles),
      matchedTestNames: matchedTestNames,
    };
  }

  if (collectCoverage) {
    const sourceFunctions = new Map<string, SourceFunctionInfo[]>();
    const sourceCodePaths = getRelatedFiles(includes, excludes, (path: string) => !path.endsWith(".test.ts"));
    const sourceTransformFunction = join(projectRoot, "transform", "listFunctions.mjs");
    // The batchSize = 2 is empirical data after benchmarking
    const batchSize = 2;
    for (let i = 0; i < sourceCodePaths.length; i += batchSize) {
      await Promise.all(
        sourceCodePaths.slice(i, i + batchSize).map((sourcePath) =>
          transform(sourceTransformFunction, sourcePath, flags, () => {
            sourceFunctions.set(sourcePath, functionInfos);
          })
        )
      );
    }
    return {
      testCodePaths,
      sourceFunctions,
    };
  }

  return { testCodePaths };
}

async function transform(transformFunction: string, codePath: string, flags: string, collectCallback: () => void) {
  let ascArgv = [codePath, "--noEmit", "--disableWarning", "--transform", transformFunction, "-O0"];
  if (flags) {
    const argv = flags.split(" ");
    ascArgv = ascArgv.concat(argv);
  }
  const { error, stderr } = await main(ascArgv);
  if (error) {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    console.error(stderr.toString());
    throw error;
  }
  collectCallback();
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
