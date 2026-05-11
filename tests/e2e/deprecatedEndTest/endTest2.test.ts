import { describe, test, expect, endTest } from "../../../assembly";

describe("deprecatedEndTest2", () => {
  test("another simple test", () => {
    expect(2).equal(2);
  });
});

endTest();
