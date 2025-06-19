import { test, expect } from "../../../assembly";
import { log } from "./env";

test("failed test", () => {
  log("This is a log message for the failed test.");
  assert(false, "This is AS assert failure");
});

test("succeed test", () => {
  log("This is a log message for the succeed test.");
  expect(1 + 1).equal(2);
});
