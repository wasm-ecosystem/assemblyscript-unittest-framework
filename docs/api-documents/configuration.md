## Configuration

The [template](https://github.com/wasm-ecosystem/assemblyscript-unittest-framework/blob/main/example/as-test.config.js) of `as-test.config.js`

The [type declaration](https://github.com/wasm-ecosystem/assemblyscript-unittest-framework/blob/main/config.d.ts) of config.

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
