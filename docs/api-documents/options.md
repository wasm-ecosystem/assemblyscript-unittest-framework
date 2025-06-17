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
```

There are several ways to run partial test cases:

#### Partial Test Files

Providing file path to `--testcase`. it can specify a certain group of files for testing.

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

#### Partial Tests

Providing regex which can match targeted test name to `--testNamePattern`. it can specify a certain group of tests for testing.

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

run `as-test --testNamePattern "case_\d"` will match `case 1`, `case 2`, `case 4`

:::
