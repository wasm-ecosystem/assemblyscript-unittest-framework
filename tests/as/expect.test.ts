import { describe, endTest, expect, test } from "../../assembly";

describe("expect", () => {
  test("< = >", () => {
    expect(1).greaterThan(0);
    expect(1).greaterThanOrEqual(0);
    expect(1).greaterThanOrEqual(1);
    expect(1).lessThan(2);
    expect(1).lessThanOrEqual(2);
    expect(1).lessThanOrEqual(1);
  });
  test("null", () => {
    expect<string | null>(null).isNull();
    expect<string | null>("test").notNull();
  });
});

endTest();
