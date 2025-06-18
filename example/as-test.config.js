export default {
  include: ["example"],
  exclude: ["assembly/coverageCollector.ts", "assembly/mock.ts"],

  /** assemblyscript compile flag, default is --exportStart _start --sourceMap --debug -O0 */
  flags: "",

  /**
   * import functions
   * @param {ImportsArgument} runtime
   * @returns
   */
  imports(runtime) {
    return {
      env: {
        log: (msg) => {
          runtime.framework.log(runtime.exports.__getString(msg));
        },
      },
    };
  },

  /** template file path, default "coverage" */
  temp: "coverage",

  /** report file path, default "coverage" */
  output: "coverage",
};
