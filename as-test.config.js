export default {
  /** file include in test */
  include: ["assembly", "tests/as"],

  /** optional: file exclude */
  exclude: [],

  /** optional: assemblyscript compile flag, default is --exportStart _start -O0 */
  flags: "",

  /**
   * optional: import functions
   * @param {ImportsArgument} runtime
   * @returns
   */
  imports(runtime) {
    return {};
  },

  /** optional: template file path, default "coverage" */
  temp: "coverage",

  /** optional: report file path, default "coverage" */
  output: "coverage",

  /** optional: test result output format, default "table" */
  mode: ["html", "json", "table"],
};
