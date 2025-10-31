/**
 * @type {import("./config.d.ts").Config}
 */
export default {
  include: ["assembly", "tests/as"],
  exclude: [],
  flags: "",
  imports(runtime) {
    return {};
  },
  temp: "coverage",
  output: "coverage",
  mode: ["html", "json", "table"],
  isolated: false,
};
