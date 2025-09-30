## Configuration

This is the template of `as-test.config.js`:

```javascript
module.exports = {
  // test related code folder
  include: ["source", "tests"],
  exclude: [],

  /** optional: assemblyscript compile flag, default is --exportStart _start -O0 */
  flags: "",

  /**
   * optional: import functions
   * @param {ImportsArgument} runtime
   * @returns
   */
  imports(runtime) {
    return {
      env: {
        logInfo(ptr, len) {
          let buf = runtime.exports!.__getArrayBuffer(ptr);
          let str = Buffer.from(buf).toString("utf8");
          runtime.framework.log(str); // log to unittest framework
          console.log(str); // log to console
        },
      },
      console: {
        log(ptr) {
          runtime.framework.log(runtime.exports!.__getString(msg));
        }
      }
      builtin: {
        getU8FromLinkedMemory(a) {
          return 1;
        },
      },
    };
  },

  /**  optional: template file path, default "coverage" */
  // temp: "coverage",

  /**  optional: report file path, default "coverage" */
  // output: "coverage",

  /** optional: test result output format, default "table" */
  // mode: ["html", "json", "table"],
};
```

### Imports

```typescript
export interface ImportsArgument {
  module: WebAssembly.Module;
  instance: WebAssembly.Instance;
  exports: (ASUtil & Record<string, unknown>);
  framework: UnitTestFramework;
}
export abstract class UnitTestFramework {
  /**
   * function to redirect log message to unittest framework
   * @param msg: message to log
   */
  abstract log(msg: string): void;
}
```

There are 2 useful fields.

- `exports`: contains exported function from test cases and [AS help API](https://github.com/AssemblyScript/assemblyscript/blob/3defefd5b09248d697a2e6bd1e7201c0cf98def1/lib/loader/index.d.ts#L23).
- `framework`: contains runtime provided function.</br>
  - `log`: redirect log message from test cases to unittest framework. It will be showed in failed info.
    ::: details

    as-test.config.js:

    ```javascript
    module.exports = {
      imports(runtime) {
        return {
          env: {
            log: (msg) => {
              runtime.framework.log(runtime.exports.__getString(msg));
            },
          },
        };
      },
    }
    ```

    unit test:

    ```typescript
    import { log } from "./env";

    test("failed test", () => {
      log("This is a log message for the failed test."); // log to be redirect
      expect(1 + 1).equal(3);
    });

    test("succeed test", () => {
      log("This is a log message for the succeed test.");  // log to be redirect
      expect(1 + 1).equal(2);
    });
    ```

    will output

    ```
    Error Message:
      failed test:
        *.test.ts:6:2 value: 2 expect: = 3
    This is a log message for the failed test.  <- only log in failed test will be showed here
    ```

    :::
