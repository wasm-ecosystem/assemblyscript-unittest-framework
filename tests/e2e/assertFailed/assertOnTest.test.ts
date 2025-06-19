import { test, expect } from "../../../assembly";
import { log } from "./env";

test("assert on test", () => {
  log("This test will fail due to an assertion error");
  assert(false, "This assertion is expected to fail");
});
