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
          if (runtime.exports) {
            let arrbuf = runtime.exports.__getArrayBuffer(ptr);
            let str = Buffer.from(arrbuf).toString("utf8");
            console.log(str);
          }
        },
      },
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
