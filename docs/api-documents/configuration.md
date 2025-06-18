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
