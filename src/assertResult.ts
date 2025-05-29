import { promises } from "node:fs";
import { json2map } from "./utils/index.js";
import { AssertErrorMessages, AssertMessage, ErrorMessages, ExpectInfo, IAssertResult } from "./interface.js";

const readFile = promises.readFile;

export class AssertResult {
  fail = 0;
  total = 0;
  failed_info: AssertErrorMessages = new Map();

  async merge(result: IAssertResult, expectInfoFilePath: string) {
    this.fail += result.fail;
    this.total += result.total;
    if (result.fail > 0) {
      let expectInfo;
      try {
        const expectContent = await readFile(expectInfoFilePath, { encoding: "utf8" });
        expectInfo = json2map(JSON.parse(expectContent) as ExpectInfo);
        for (const [key, value] of json2map<AssertMessage[]>(result.failed_info)) {
          const errorMsgs: ErrorMessages = [];
          for (const msg of value) {
            const [index, actualValue, expectValue] = msg;
            const debugLocation = expectInfo.get(index);
            let errorMsg = `${debugLocation ?? ""}\tvalue: ${actualValue}\texpect: ${expectValue}`;
            if (errorMsg.length > 160) {
              errorMsg = `${debugLocation ?? ""}\nvalue: \n\t${actualValue}\nexpect: \n\t${expectValue}`;
            }
            errorMsgs.push(errorMsg);
          }
          this.failed_info.set(key, errorMsgs);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.stack);
        }
        throw new Error(`maybe forget call "endTest()" at the end of "*.test.ts" or Job abort before output`);
      }
    }
  }
}
