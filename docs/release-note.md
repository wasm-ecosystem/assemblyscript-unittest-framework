# Release Note

## 1.3.0

🚀 Highlight Features

- Provides more command line options for finer-grained control of test cases.
  - Deprecate `--testcase`, replace with `--testFiles`.
  - Add `--testNamePattern <name pattern regex>`.
  - Add `--onlyFailures` flag to re-run last failed test cases.
- Provides clearer log for user.
  - Expose the framework's `log` function in the configuration file, and the logs redirected to this function will be appended to the final test report.
  - Support test crashes and provide good call stack information.

Improvements

- Code coverage calculation.
  - Skip type definitions.
  - Treat switch case correctly.
- Reduced test execution time and memory overhead.

🔄 Arch Changes

- During testing, the framework will execute all `test` functions once, but will not trigger callbacks, thereby collecting all test cases and then executing the test cases in sequence.
- Move lots of framework logic from Assemblyscript to Typescript to reduce the WASM linear memory usage and improve the performance.
