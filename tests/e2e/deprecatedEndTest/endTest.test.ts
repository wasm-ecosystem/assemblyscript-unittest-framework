import { describe, test, expect, endTest } from "../../../assembly";

describe("deprecatedEndTest", () => {
  test("simple test", () => {
    expect(1).equal(1);
  });
});

endTest();
