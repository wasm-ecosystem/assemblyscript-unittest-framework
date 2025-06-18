import assert from "node:assert";
import { exec } from "node:child_process";
import { diffChars } from "diff";
import chalk from "chalk";

function assertStringEq(s1, s2) {
  const parts = diffChars(s1, s2);
  const diffs = [];
  let hasDiff = false;
  for (const part of parts) {
    if (part.added) {
      hasDiff = true;
      diffs.push(chalk.bgGreen(part.value));
    } else if (part.removed) {
      hasDiff = true;
      diffs.push(chalk.bgRed(part.value));
    } else {
      diffs.push(part.value);
    }
  }
  assert(!hasDiff, diffs.join(""));
}

console.log("Running e2e test: printLogInFailedInfo");
exec("node ./bin/as-test.js --config tests/e2e/printLogInFailedInfo/as-test.config.js", (error, stdout, stderr) => {
  assert(error.code === 255);
  const expectStdOut = `
code analysis: OK
compile testcases: OK
instrument: OK
execute testcases: OK

test case: 1/2 (success/total)

Error Message: 
  failed test: 
    tests/e2e/printLogInFailedInfo/source.test.ts:6:2  value: 2  expect: = 3
This is a log message for the failed test.
`.trimStart();

  assertStringEq(expectStdOut, stdout);
});
