import { test, expect } from "../../../assembly";

test("assert on test", () => {
  trace("this test will fail due to an assertion error");
  assert(false, "this assertion is expected to fail");
});
