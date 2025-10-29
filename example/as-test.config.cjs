/** @type {import("assemblyscript-unittest-framework/config.d.ts").Config} */
module.exports = {
  include: ["tests", "assembly"],
  exclude: ["lib"],

  flags: "",

  imports(runtime) {
    return {
      env: {
        log: (msg) => {
          runtime.framework.log(runtime.exports.__getString(msg));
        },
      },
    };
  },

  temp: "coverage",
  output: "coverage",
};
