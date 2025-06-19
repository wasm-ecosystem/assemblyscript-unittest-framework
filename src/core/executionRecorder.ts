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

export class ExecutionRecorder implements UnitTestFramework {
  result = new ExecutionResult();

  registerFunctions: [string, number][] = [];
  #currentTestDescriptions: string[] = [];
  #testCaseFullName: string = "";
  logRecorder = new LogRecorder();

  set testCaseFullName(testCaseFullName: string) {
    this.#testCaseFullName = testCaseFullName;
  }

  _addDescription(description: string): void {
    this.#currentTestDescriptions.push(description);
  }
  _removeDescription(): void {
    this.#currentTestDescriptions.pop();
  }
  _registerTestFunction(fncIndex: number): void {
    const testCaseFullName = this.#currentTestDescriptions.join(" ");
    this.registerFunctions.push([testCaseFullName, fncIndex]);
  }

  startTestFunction(testCaseFullName: string): void {
    this.#testCaseFullName = testCaseFullName;
    this.logRecorder.reset();
  }
  finishTestFunction(): void {
    const logMessages: string[] | null = this.logRecorder.onFinishTest();
    if (logMessages !== null) {
      this.result.failedLogMessages[this.#testCaseFullName] = (
        this.result.failedLogMessages[this.#testCaseFullName] || []
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
    this.result.crashInfo.add(this.#testCaseFullName);
    this.result.total++; // fake test cases
    this.#increaseFailureCount();
  }

  collectCheckResult(result: boolean, codeInfoIndex: number, actualValue: string, expectValue: string): void {
    this.result.total++;
    if (!result) {
      this.#increaseFailureCount();
      const testCaseFullName = this.#testCaseFullName;
      const assertMessage: AssertMessage = [codeInfoIndex.toString(), actualValue, expectValue];
      this.result.failedInfo[testCaseFullName] = this.result.failedInfo[testCaseFullName] || [];
      this.result.failedInfo[testCaseFullName].push(assertMessage);
    }
  }

  log(msg: string): void {
    this.logRecorder.addLog(msg);
  }

  getCollectionFuncSet(arg: ImportsArgument): Record<string, Record<string, unknown>> {
    return {
      __unittest_framework_env: {
        addDescription: (description: number): void => {
          this._addDescription(arg.exports!.__getString(description));
        },
        removeDescription: (): void => {
          this._removeDescription();
        },
        registerTestFunction: (index: number): void => {
          this._registerTestFunction(index);
        },
        collectCheckResult: (result: number, codeInfoIndex: number, actualValue: number, expectValue: number): void => {
          this.collectCheckResult(
            result !== 0,
            codeInfoIndex,
            arg.exports!.__getString(actualValue),
            arg.exports!.__getString(expectValue)
          );
        },
      },
    };
  }

  #increaseFailureCount(): void {
    this.result.fail++;
    this.logRecorder.markTestFailed();
  }
}
