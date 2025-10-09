/** @type {import("assemblyscript-unittest-framework/config.d.ts").Config} */
export default {
  include: ["tests"],
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

  isolated: false,
};
