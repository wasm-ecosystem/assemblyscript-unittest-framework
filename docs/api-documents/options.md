## Options

### Define Config

```
  --config <config file>                 path of config file (default: "as-test.config.js")
```

### Override Config File

There are command line options which can override the configuration in `as-test.config.js`.

```
  --temp <path>                          test template file folder
  --output <path>                        coverage report output folder
  --mode <output mode>                   test result output format
```

### Warning Behavior

```
  --coverageLimit [error warning...]     set warn(yellow) and error(red) upper limit in coverage report
```

### Run partial test cases

```
  --testcase <testcases...>              only run specified test cases
  --testNamePattern <test name pattern>  run only tests with a name that matches the regex pattern
  --onlyFailures                         Run tests that failed in the previous
```

There are several ways to run partial test cases:

#### Run specified test files

Providing file path to `--testcase`, it can specify a certain group of files for testing.

::: tip
`--testcase` can accept multiple file paths.
:::

::: details

```
- a.test.ts
|- case_1
|- case_2
- b.test.ts
|- case_A
- c.test.ts
|- case_4
```

run `as-test --testcase a.test.ts b.test.ts` will match all tests in `a.test.ts` and `b.test.ts`

:::

#### Run partial tests using a regex name pattern

Providing regex which can match targeted test name to `--testNamePattern`, it can specify a certain group of tests for testing.

::: details

```
describe("groupA", () => {
  test("case_1", () => {
    ...
  });
  test("case_2", () => {
    ...
  });
  test("case_3", () => {
    ...
  });
});

describe("groupB", () => {
  test("case_A", () => {
    ...
  });
  test("case_B", () => {
    ...
  });
  test("case_C", () => {
    ...
  });
});
```

run `as-test --testNamePattern "groupA case_\d"` will run `case_1`, `case_2`, `case_3`.

::: tip
The framework join `DescriptionName` and `TestName` with `" "` by default, e.g. `groupA case_1` is the fullTestCaseName of `case_1`.

:::

#### Run only failures

Provides the ability to run only the test cases that failed in the previous test.

### Whether collect coverage information

```
  --collectCoverage <boolean>            whether to collect coverage information and report
```

The framework collects coverage and generates reports by default, but it will be disablea while running partial test cases by `--testcase` or `--testNamePattern`.

You can control the coverage collection manually with `--collectCoverage` option.
