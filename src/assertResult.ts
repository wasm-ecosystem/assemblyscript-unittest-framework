import { promises } from "node:fs";
import { json2map } from "./utils/index.js";
import { FailedInfoMap, AssertMessage, ExpectInfo, IAssertResult } from "./interface.js";
import chalk from "chalk";

const readFile = promises.readFile;

export class AssertResult {
  fail = 0;
  total = 0;
  failedInfos: FailedInfoMap = new Map();

  async merge(result: IAssertResult, expectInfoFilePath: string) {
    this.fail += result.fail;
    this.total += result.total;
    if (result.fail > 0) {
      let expectInfo;
      try {
        const expectContent = await readFile(expectInfoFilePath, { encoding: "utf8" });
        expectInfo = json2map(JSON.parse(expectContent) as ExpectInfo);
        for (const [testcaseName, value] of json2map<AssertMessage[]>(result.failed_info)) {
          const errorMsgs: string[] = [];
          for (const msg of value) {
            const [index, actualValue, expectValue] = msg;
            const debugLocation = expectInfo.get(index);
            let errorMsg = `${debugLocation ?? ""}\tvalue: ${actualValue}\texpect: ${expectValue}`;
            if (errorMsg.length > 160) {
              errorMsg = `${debugLocation ?? ""}\nvalue: \n\t${actualValue}\nexpect: \n\t${expectValue}`;
            }
            errorMsgs.push(errorMsg);
          }
          this.failedInfos.set(testcaseName, {
            assertMessages: errorMsgs,
            logMessages: result.failedLogMessages[testcaseName],
          });
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.stack);
        }
        throw error;
      }
    }
  }

  print(log: (msg: string) => void): void {
    const render = (failed: number, total: number) =>
      (this.fail === 0 ? chalk.greenBright(total) : chalk.redBright(total - failed)) + "/" + this.total.toString();
    log(`\ntest case: ${render(this.fail, this.total)} (success/total)\n`);
    if (this.fail !== 0) {
      log(chalk.red("Error Message: "));
      for (const [testcaseName, { assertMessages, logMessages }] of this.failedInfos.entries()) {
        log(`\t${testcaseName}: `);
        for (const assertMessage of assertMessages) {
          log("\t\t" + chalk.yellow(assertMessage));
        }
        for (const logMessage of logMessages ?? []) {
          log(chalk.gray(logMessage));
        }
      }
    }
  }
}
