/**
 * Will transform all source file to get all relative functions
 */

import ignore from "ignore";
import { relative, resolve } from "node:path";
import { getIncludeFiles } from "../utils/pathResolver.js";
import { UnittestPackage } from "../interface.js";
import assert from "node:assert";

export async function analyze(
  includes: string[],
  excludes: string[],
  testFiles: string[] | undefined, // this field specifed test file names
  testNamePattern: string | null,
  failedTestNames: string[]
): Promise<UnittestPackage> {
  return {
    // if specify testFiles, use testFiles for unittest
    // otherwise, get testFiles(*.test.ts) in includes directory
    testCodePaths: testFiles ?? getRelatedFiles(includes, excludes, (path: string) => path.endsWith(".test.ts")),
    filterByName: getFilterByName(testNamePattern, failedTestNames),
  };
}

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

// a. include in config
// b. exclude in config
function getRelatedFiles(includes: string[], excludes: string[], filter: (path: string) => boolean) {
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
