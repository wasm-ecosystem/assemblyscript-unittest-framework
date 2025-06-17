import { ImportsArgument, UnitTestFramework } from "../index.js";
import { AssertFailMessage, AssertMessage, IAssertResult, FailedLogMessages } from "../interface.js";

class LogRecorder {
  #currentTestLogMessages: string[] = [];
  #isTestFailed: boolean = false;

  addLog(msg: string): void {
    this.#currentTestLogMessages.push(msg);
  }
  markTestFailed(): void {
    this.#isTestFailed = true;
  }

  onStartTest(): void {
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

// to do: split execution environment and recorder
export class ExecutionRecorder implements IAssertResult, UnitTestFramework {
  total: number = 0;
  fail: number = 0;
  failed_info: AssertFailMessage = {};
  failedLogMessages: FailedLogMessages = {};

  registerFunctions: [string, number][] = [];
  #currentTestDescriptions: string[] = [];
  #logRecorder = new LogRecorder();

  get #currentTestDescription(): string {
    return this.#currentTestDescriptions.join(" - ");
  }

  _addDescription(description: string): void {
    this.#currentTestDescriptions.push(description);
  }
  _removeDescription(): void {
    this.#currentTestDescriptions.pop();
  }
  registerTestFunction(fncIndex: number): void {
    this.registerFunctions.push([this.#currentTestDescription, fncIndex]);
    this.#logRecorder.onStartTest();
  }
  _finishTestFunction(): void {
    const logMessages: string[] | null = this.#logRecorder.onFinishTest();
    if (logMessages !== null) {
      const testCaseFullName = this.#currentTestDescription;
      this.failedLogMessages[testCaseFullName] = (this.failedLogMessages[testCaseFullName] || []).concat(logMessages);
    }
  }

  collectCheckResult(result: boolean, codeInfoIndex: number, actualValue: string, expectValue: string): void {
    this.total++;
    if (!result) {
      this.#logRecorder.markTestFailed();
      this.fail++;
      const testCaseFullName = this.#currentTestDescription;
      const assertMessage: AssertMessage = [codeInfoIndex.toString(), actualValue, expectValue];
      this.failed_info[testCaseFullName] = this.failed_info[testCaseFullName] || [];
      this.failed_info[testCaseFullName].push(assertMessage);
    }
  }

  log(msg: string): void {
    this.#logRecorder.addLog(msg);
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
          this.registerTestFunction(index);
        },
        finishTestFunction: () => {
          this._finishTestFunction();
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
}
