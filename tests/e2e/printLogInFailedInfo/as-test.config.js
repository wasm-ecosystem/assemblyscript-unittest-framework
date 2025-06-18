import os from "node:os";
import path from "node:path";

const tmpFolder = path.join(os.tmpdir(), "as-test-e2e");

export default {
  include: ["tests/e2e/printLogInFailedInfo"],
  imports(runtime) {
    return {
      env: {
        log: (msg) => {
          runtime.framework.log(runtime.exports.__getString(msg));
        },
      },
    };
  },
  temp: tmpFolder,
  output: tmpFolder,
  mode: [],
};
