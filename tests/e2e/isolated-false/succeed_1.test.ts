import { test, expect } from "../../../assembly";
import { fn } from "./env";

test("succeed_1", () => {
  if (fn.raw == null) {
    fn.raw = () => {
      expect(true).equal(true);
    };
  } else {
    fn.raw();
  }
});
