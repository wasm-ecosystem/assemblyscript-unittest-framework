import { AssertFailMessage, AssertMessage, IAssertResult, ImportsArgument } from "../interface.js";

export class ExecutionRecorder implements IAssertResult {
  total: number = 0;
  fail: number = 0;
  failed_info: AssertFailMessage = {};
  _currentTestDescriptions: string[] = [];

  _addDescription(description: string): void {
    this._currentTestDescriptions.push(description);
  }
  _removeDescription(): void {
    this._currentTestDescriptions.pop();
  }
  collectCheckResult(result: boolean, codeInfoIndex: number, actualValue: string, expectValue: string): void {
    this.total++;
    if (!result) {
      this.fail++;
      const testCaseFullName = this._currentTestDescriptions.join(" - ");
      const assertMessage: AssertMessage = [codeInfoIndex.toString(), actualValue, expectValue];
      this.failed_info[testCaseFullName] = this.failed_info[testCaseFullName] || [];
      this.failed_info[testCaseFullName].push(assertMessage);
    }
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
