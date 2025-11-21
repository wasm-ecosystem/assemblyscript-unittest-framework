import fs from "fs-extra";
import { join } from "node:path";
import { Imports as ASImports } from "@assemblyscript/loader";
import { fileURLToPath, URL } from "node:url";
import { DebugInfo, CovDebugInfo, ImportFunctionInfo, ImportsArgument } from "../../../../src/interface.js";
import {
  json2map,
  isFunctionInsideFile,
  checkGenerics,
  supplyDefaultFunction,
  checkVarargs,
} from "../../../../src/utils/index.js";
import { Type } from "wasmparser";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

test("json2map", () => {
  const debugInfoFile = join(__dirname, "..", "..", "fixture", "ifBlock.debugInfo.json");

  const debugInfo = fs.readJsonSync(debugInfoFile) as DebugInfo;

  expect(debugInfo.debugFiles).toEqual(["index.ts"]);

  const debugInfos = json2map(debugInfo.debugInfos);
  const expectDebugInfos = new Map<string, CovDebugInfo>();
  expectDebugInfos.set("main", {
    branchInfo: [
      [1, 2],
      [1, 3],
      [3, 4],
      [3, 5],
    ],
    index: 0,
    lineInfo: [
      [
        [0, 2, 1],
        [0, 3, 1],
      ],
      [[0, 5, 1]],
      [
        [0, 8, 1],
        [0, 9, 1],
      ],
      [
        [0, 11, 1],
        [0, 10, 1],
      ],
      [[0, 12, 1]],
      [[0, 6, 1]],
    ],
  });
  expect(debugInfos).toEqual(expectDebugInfos);
});

test("isFunctionInsideFile", () => {
  expect(isFunctionInsideFile("source/api.ts", "source/api/myMethod")).toEqual(true);
  expect(isFunctionInsideFile("source/api.ts", "start:source/api~anonymous|3~anonymous|1")).toEqual(true);
  expect(isFunctionInsideFile("source/api.ts", "source/api/index/myFunc")).toEqual(false); // this function belong to source/api/index.ts
  expect(isFunctionInsideFile("source/api.ts", "source/api/Class#method")).toEqual(true);
  expect(isFunctionInsideFile("source/api.ts", "source/api/Class.static_method")).toEqual(true);
});

test("checkGenerics", () => {
  expect(checkGenerics("test<~lib/string/String|null>")).toEqual("test");
  expect(checkGenerics("Value<i32>#greaterThan")).toEqual("Value#greaterThan");
  expect(checkGenerics("toJson<~lib/array/Array<~lib/array/Array<~lib/string/String>>>")).toEqual("toJson");
  expect(checkGenerics("Value<~lib/array/Array<i32>>#lessThan")).toEqual("Value#lessThan");
  expect(checkGenerics("noGenerics")).toEqual(undefined);
  expect(checkGenerics("func<")).toEqual(undefined);
  expect(checkGenerics("fun>a")).toEqual(undefined);
});

test("checkVarargs", () => {
  expect(checkVarargs("tests/testUtilities/createEmptyVss@varargs")).toEqual("tests/testUtilities/createEmptyVss");
  expect(checkVarargs("tests/testUtilities/createEmptyVss")).toEqual(undefined);
});

describe("supplyDefaultFunction", () => {
  test("supplyTest", () => {
    const mockInfos: ImportFunctionInfo[] = [
      { module: "ns", name: "ut.i32", args: [new Type(-1)], return: new Type(-1) },
      { module: "ns", name: "ut.i64", args: [new Type(-2)], return: new Type(-2) },
      { module: "ns", name: "ut.f32", args: [new Type(-3)], return: new Type(-3) },
      { module: "ns", name: "ut.f64", args: [new Type(-4)], return: new Type(-4) },
    ];

    const mockImportObject: ASImports = {
      env: {},
      wasi_snapshot_preview1: {},
    };
    supplyDefaultFunction(mockInfos, mockImportObject, new ImportsArgument({ log: console.log }));

    expect(typeof mockImportObject["ns"]?.["ut.i32"]).toBe("function");
    expect(typeof mockImportObject["ns"]?.["ut.i64"]).toBe("function");
    expect(typeof mockImportObject["ns"]?.["ut.f32"]).toBe("function");
    expect(typeof mockImportObject["ns"]?.["ut.f64"]).toBe("function");

    // Explicitly cast to the expected function type for type safety
    expect((mockImportObject["ns"]?.["ut.i32"] as (arg: number) => number)(0)).toEqual(0);
    expect((mockImportObject["ns"]?.["ut.i64"] as (arg: number) => bigint)(0)).toEqual(BigInt(0));
    expect((mockImportObject["ns"]?.["ut.f32"] as (arg: number) => number)(0)).toEqual(0);
    expect((mockImportObject["ns"]?.["ut.f64"] as (arg: number) => number)(0)).toEqual(0);
  });
});
