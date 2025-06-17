import { join } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { FailedInfoMap, IAssertResult } from "../../../src/interface.js";
import { AssertResult } from "../../../src/assertResult.js";
import chalk from "chalk";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

test("no failed_info merge", async () => {
  const assertResult = new AssertResult();
  const testcaseA: IAssertResult = {
    fail: 0,
    total: 28,
    failed_info: {},
    failedLogMessages: {},
  };
  const expectInfoFIlePath = join(__dirname, "..", "fixture", "assertResultTest.expectInfo.json");
  await assertResult.merge(testcaseA, expectInfoFIlePath);
  expect(assertResult.fail).toEqual(0);
  expect(assertResult.total).toEqual(28);
  expect(assertResult.failedInfos).toEqual(new Map<string, string[]>());
});

test("equal failed", async () => {
  const assertResult = new AssertResult();
  const actualString = "A long sentence for testing errorMsg.length > 160 in assertResult.ts merge function";
  const expectString = "= A long sentence for testing errorMsg.length > 160 in assertResult.ts merge function ";
  const testcaseA: IAssertResult = {
    fail: 1,
    total: 28,
    failed_info: {
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
  await assertResult.merge(testcaseA, expectInfoFIlePath);
  const expectFailedInfo: FailedInfoMap = new Map();
  expectFailedInfo.set("A", {
    assertMessages: [
      "tests/as/comparison.test.ts:10:20\tvalue: 100\texpect: = 200",
      "tests/as/comparison.test.ts:15:27\tvalue: [10]\texpect: = [1]",
      "tests/as/comparison.test.ts:59:22\tvalue: { 1 : 1.5, 2 : 2.5 }\texpect: = { 1: 1.5, 2 : 2.0 }",
      `tests/as/comparison.test.ts:48:47\nvalue: \n\t${actualString}\nexpect: \n\t${expectString}`,
    ],
    logMessages: ["log message 1", "log message 2", "log message 3"],
  });
  expect(assertResult.fail).toEqual(1);
  expect(assertResult.total).toEqual(28);
  expect(assertResult.failedInfos).toEqual(expectFailedInfo);
});

test("print", async () => {
  const assertResult = new AssertResult();
  const testcaseA: IAssertResult = {
    fail: 1,
    total: 28,
    failed_info: {
      A: [["1", "100", "= 200"]],
    },
    failedLogMessages: {
      A: ["log message 1", "log message 2", "log message 3"],
    },
  };
  const expectInfoFIlePath = join(__dirname, "..", "fixture", "assertResultTest.expectInfo.json");
  await assertResult.merge(testcaseA, expectInfoFIlePath);

  {
    const outputs: string[] = [];
    chalk.level = 0; // disable color
    assertResult.print((msg) => outputs.push(msg));
    expect(outputs.join("\n")).toMatchSnapshot();
  }
  {
    const outputs: string[] = [];
    chalk.level = 1; // force enable color
    assertResult.print((msg) => outputs.push(msg));
    expect(outputs.join("\n")).toMatchSnapshot();
  }
});
