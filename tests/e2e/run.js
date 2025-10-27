import assert from "node:assert";
import { exec } from "node:child_process";
import { diffLines } from "diff";
import chalk from "chalk";
import { argv } from "node:process";
import { readFileSync } from "node:fs";

function getDiff(s1, s2) {
  const handleEscape = (c) => (/^\n*$/.test(c) ? c.replaceAll("\n", "\xB6\n") : c);
  return diffLines(s1, s2)
    .map((part) => {
      if (part.added) {
        return chalk.bgGreen("+" + handleEscape(part.value));
      } else if (part.removed) {
        return "-" + chalk.bgRed(handleEscape(part.value));
      } else {
        return part.value;
      }
    })
    .join("");
}

function isEnabled(name) {
  const enabledTests = argv.slice(2);
  if (enabledTests.length === 0) {
    return true; // Run all tests by default
  }
  return enabledTests.includes(name);
}

async function runEndToEndTest(name, flags, handle) {
  if (!isEnabled(name)) {
    return;
  }
  return new Promise((resolve) => {
    console.log(`Running e2e test: ${name}`);
    exec(`node ./bin/as-test.js --config tests/e2e/${name}/as-test.config.js ${flags}`, (error, stdout, stderr) => {
      handle(error, stdout, stderr);
      resolve();
    });
  });
}

function checkOutput(name, stdout, stderr) {
  const expectStdOut = readFileSync(`tests/e2e/${name}/stdout.txt`, "utf-8");
  if (expectStdOut !== stdout) {
    console.log(`========= STDOUT ${name} =========`);
    console.log(getDiff(expectStdOut, stdout));
    console.log(`========= STDERR ${name} =========`);
    console.log(stderr);
    process.exit(1);
  }
}

runEndToEndTest("assertFailed", "", (error, stdout, stderr) => {
  checkOutput("assertFailed", stdout, stderr);
  assert(error.code === 1);
});

runEndToEndTest("compilationFailed", "", (error, stdout, stderr) => {
  checkOutput("compilationFailed", stdout, stderr);
  assert(error.code === 2);
});

runEndToEndTest("isolated-cli", "--isolated false", (error, stdout, stderr) => {
  checkOutput("isolated-cli", stdout, stderr);
});
runEndToEndTest("isolated-false", "", (error, stdout, stderr) => {
  checkOutput("isolated-false", stdout, stderr);
});
runEndToEndTest("isolated-true", "", (error, stdout, stderr) => {
  checkOutput("isolated-true", stdout, stderr);
});

(async () => {
  let mergedStdout = "";
  let mergedStderr = "";
  await runEndToEndTest("on-failure-only", "", (error, stdout, stderr) => {
    mergedStdout += stdout;
    mergedStderr += stderr;
  });
  mergedStdout += "\n";
  mergedStderr += "\n";
  await runEndToEndTest("on-failure-only", "--onlyFailures", (error, stdout, stderr) => {
    mergedStdout += stdout;
    mergedStderr += stderr;
  });
  checkOutput("on-failure-only", mergedStdout, mergedStderr);
})();

runEndToEndTest("printLogInFailedInfo", "", (error, stdout, stderr) => {
  checkOutput("printLogInFailedInfo", stdout, stderr);
  assert(error.code === 1);
});

runEndToEndTest("setup-teardown", "", (error, stdout, stderr) => {
  checkOutput("setup-teardown", stdout, stderr);
  assert(error.code === 1);
});

runEndToEndTest(
  "testFiles",
  "--testFiles tests/e2e/testFiles/succeed_0.test.ts tests/e2e/testFiles/succeed_1.test.ts",
  (error, stdout, stderr) => {
    checkOutput("testFiles", stdout, stderr);
    assert(error === null);
  }
);
