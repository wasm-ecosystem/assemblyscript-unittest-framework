import chalk from "chalk";
import {
  UnitTestFramework,
  ImportsArgument,
  AssertFailMessage,
  AssertMessage,
  IExecutionResult,
  FailedLogMessages,
  CrashInfo,
} from "../interface.js";
import { ExecutionError } from "../utils/errorTraceHandler.js";

class LogRecorder {
  #currentTestLogMessages: string[] = [];
  #isTestFailed: boolean = false;

  addLog(msg: string): void {
    this.#currentTestLogMessages.push(msg);
  }
  markTestFailed(): void {
    this.#isTestFailed = true;
  }

  reset(): void {
    this.#currentTestLogMessages = [];
    this.#isTestFailed = false;
  }
  onFinishTest(): string[] | null {
    if (this.#currentTestLogMessages.length === 0) {
      return null;
    }
    if (this.#isTestFailed === false) {
      return null;
    }
    return this.#currentTestLogMessages;
  }
}

export class ExecutionResult implements IExecutionResult {
  total: number = 0;
  fail: number = 0;
  failedInfo: AssertFailMessage = {};
  crashInfo: CrashInfo = new Set();
  failedLogMessages: FailedLogMessages = {};
}

class TestBlock {
  constructor(public description: string) {}
}

class TestCase {
  fullName: string;
  constructor(
    testBlockStack: TestBlock[],
    public functionIndex: number
  ) {
    this.fullName = testBlockStack.map((block) => block.description).join(" ");
  }
}

export class ExecutionRecorder implements UnitTestFramework {
  result = new ExecutionResult();

  testBlockStack: TestBlock[] = [];
  testCases: TestCase[] = [];

  currentExecutedTestCaseFullName: string = "";
  logRecorder = new LogRecorder();

  _addDescription(description: string): void {
    this.testBlockStack.push(new TestBlock(description));
  }
  _removeDescription(): void {
    this.testBlockStack.pop();
  }
  _addTestCase(functionIndex: number): void {
    this.testCases.push(new TestCase(this.testBlockStack, functionIndex));
  }

  startTestFunction(testCaseFullName: string): void {
    this.currentExecutedTestCaseFullName = testCaseFullName;
    this.logRecorder.reset();
  }
  finishTestFunction(): void {
    const logMessages: string[] | null = this.logRecorder.onFinishTest();
    if (logMessages !== null) {
      this.result.failedLogMessages[this.currentExecutedTestCaseFullName] = (
        this.result.failedLogMessages[this.currentExecutedTestCaseFullName] || []
      ).concat(logMessages);
    }
  }

  notifyTestCrash(error: ExecutionError): void {
    this.logRecorder.addLog(`Reason: ${chalk.red(error.message)}`);
    this.logRecorder.addLog(
      error.stacks
        .map((stack) => `  at ${stack.functionName} (${stack.fileName}:${stack.lineNumber}:${stack.columnNumber})`)
        .join("\n")
    );
    this.result.crashInfo.add(this.currentExecutedTestCaseFullName);
    this.result.total++; // fake test cases
    this.#increaseFailureCount();
  }

  collectCheckResult(result: boolean, codeInfoIndex: number, actualValue: string, expectValue: string): void {
    this.result.total++;
    if (!result) {
      this.#increaseFailureCount();
      const testCaseFullName = this.currentExecutedTestCaseFullName;
      const assertMessage: AssertMessage = [codeInfoIndex.toString(), actualValue, expectValue];
      this.result.failedInfo[testCaseFullName] = this.result.failedInfo[testCaseFullName] || [];
      this.result.failedInfo[testCaseFullName].push(assertMessage);
    }
  }

  log(msg: string): void {
    this.logRecorder.addLog(msg);
  }

  getCollectionFuncSet(arg: ImportsArgument): Record<string, unknown> {
    return {
      addDescription: (description: number): void => {
        this._addDescription(arg.exports!.__getString(description));
      },
      removeDescription: (): void => {
        this._removeDescription();
      },
      registerTestFunction: (index: number): void => {
        this._addTestCase(index);
      },
      collectCheckResult: (result: number, codeInfoIndex: number, actualValue: number, expectValue: number): void => {
        this.collectCheckResult(
          result !== 0,
          codeInfoIndex,
          arg.exports!.__getString(actualValue),
          arg.exports!.__getString(expectValue)
        );
      },
    };
  }

  #increaseFailureCount(): void {
    this.result.fail++;
    this.logRecorder.markTestFailed();
  }
}
