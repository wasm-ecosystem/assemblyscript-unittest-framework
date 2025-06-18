import { describe, test, expect } from "../assembly";
import { quick_sort } from "./source2";

describe("quick_sork", () => {
  test("1", () => {
    let d = [1, 2, 3];
    quick_sort(d);
    expect(d).equal([1, 2, 3]);
  });

  test("2", () => {
    let d = [4, 3, 5, 2, 1];
    quick_sort(d);
    expect(d).equal([1, 2, 3, 4, 5]);
  });
});
