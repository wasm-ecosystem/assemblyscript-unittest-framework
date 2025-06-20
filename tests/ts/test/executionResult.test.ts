import { join } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { FailedInfoMap, IExecutionResult } from "../../../src/interface.js";
import { ExecutionResultSummary } from "../../../src/executionResult.js";
import chalk from "chalk";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

test("no failedInfo merge", async () => {
  const resultSummary = new ExecutionResultSummary();
  const executionResult: IExecutionResult = {
    fail: 0,
    total: 28,
    crashInfo: new Set<string>(),
    failedInfo: {},
    failedLogMessages: {},
  };
  const expectInfoFIlePath = join(__dirname, "..", "fixture", "assertResultTest.expectInfo.json");
  await resultSummary.merge(executionResult, expectInfoFIlePath);
  expect(resultSummary.fail).toEqual(0);
  expect(resultSummary.total).toEqual(28);
  expect(resultSummary.failedInfos).toEqual(new Map<string, string[]>());
});

test("equal assert failed", async () => {
  const resultSummary = new ExecutionResultSummary();
  const actualString = "A long sentence for testing errorMsg.length > 160 in resultSummary.ts merge function";
  const expectString = "= A long sentence for testing errorMsg.length > 160 in resultSummary.ts merge function ";
  const executionResult: IExecutionResult = {
    fail: 1,
    total: 28,
    crashInfo: new Set<string>(),
    failedInfo: {
      A: [
        ["1", "100", "= 200"],
        ["3", "[10]", "= [1]"],
        ["12", "{ 1 : 1.5, 2 : 2.5 }", "= { 1: 1.5, 2 : 2.0 }"],
        ["11", actualString, expectString],
      ],
    },
    failedLogMessages: {
      A: ["log message 1", "log message 2", "log message 3"],
    },
  };
  const expectInfoFIlePath = join(__dirname, "..", "fixture", "assertResultTest.expectInfo.json");
  await resultSummary.merge(executionResult, expectInfoFIlePath);
  const expectFailedInfo: FailedInfoMap = new Map();
  expectFailedInfo.set("A", {
    hasCrash: false,
    assertMessages: [
      "tests/as/comparison.test.ts:10:20  value: 100  expect: = 200",
      "tests/as/comparison.test.ts:15:27  value: [10]  expect: = [1]",
      "tests/as/comparison.test.ts:59:22  value: { 1 : 1.5, 2 : 2.5 }  expect: = { 1: 1.5, 2 : 2.0 }",
      `tests/as/comparison.test.ts:48:47\nvalue: \n  ${actualString}\nexpect: \n  ${expectString}`,
    ],
    logMessages: ["log message 1", "log message 2", "log message 3"],
  });
  expect(resultSummary.fail).toEqual(1);
  expect(resultSummary.total).toEqual(28);
  expect(resultSummary.failedInfos).toEqual(expectFailedInfo);
});

test("equal crash", async () => {
  const resultSummary = new ExecutionResultSummary();
  const executionResult: IExecutionResult = {
    fail: 1,
    total: 1,
    crashInfo: new Set<string>(),
    failedInfo: {},
    failedLogMessages: {
      A: ["log message 1", "log message 2", "log message 3"],
    },
  };
  executionResult.crashInfo.add("A");
  const expectInfoFIlePath = join(__dirname, "..", "fixture", "assertResultTest.expectInfo.json");
  await resultSummary.merge(executionResult, expectInfoFIlePath);
  const expectFailedInfo: FailedInfoMap = new Map();
  expectFailedInfo.set("A", {
    hasCrash: true,
    assertMessages: [],
    logMessages: ["log message 1", "log message 2", "log message 3"],
  });
  expect(resultSummary.fail).toEqual(1);
  expect(resultSummary.total).toEqual(1);
  expect(resultSummary.failedInfos).toEqual(expectFailedInfo);
});

describe("print", () => {
  test("assert failed", async () => {
    const resultSummary = new ExecutionResultSummary();
    const executionResult: IExecutionResult = {
      fail: 1,
      total: 28,
      crashInfo: new Set<string>(),
      failedInfo: {
        A: [["1", "100", "= 200"]],
      },
      failedLogMessages: {
        A: ["log message 1", "log message 2", "log message 3"],
      },
    };
    const expectInfoFIlePath = join(__dirname, "..", "fixture", "assertResultTest.expectInfo.json");
    await resultSummary.merge(executionResult, expectInfoFIlePath);

    {
      const outputs: string[] = [];
      chalk.level = 0; // disable color
      resultSummary.print((msg) => outputs.push(msg));
      expect(outputs.join("\n")).toMatchSnapshot();
    }
    {
      const outputs: string[] = [];
      chalk.level = 1; // force enable color
      resultSummary.print((msg) => outputs.push(msg));
      expect(outputs.join("\n")).toMatchSnapshot();
    }
  });

  test("crash", async () => {
    const resultSummary = new ExecutionResultSummary();
    const executionResult: IExecutionResult = {
      fail: 1,
      total: 28,
      crashInfo: new Set<string>(),
      failedInfo: {},
      failedLogMessages: {
        A: ["log message 1", "log message 2", "log message 3"],
      },
    };
    executionResult.crashInfo.add("A");
    const expectInfoFIlePath = join(__dirname, "..", "fixture", "assertResultTest.expectInfo.json");
    await resultSummary.merge(executionResult, expectInfoFIlePath);

    {
      const outputs: string[] = [];
      chalk.level = 0; // disable color
      resultSummary.print((msg) => outputs.push(msg));
      expect(outputs.join("\n")).toMatchSnapshot();
    }
    {
      const outputs: string[] = [];
      chalk.level = 1; // force enable color
      resultSummary.print((msg) => outputs.push(msg));
      expect(outputs.join("\n")).toMatchSnapshot();
    }
  });
});
