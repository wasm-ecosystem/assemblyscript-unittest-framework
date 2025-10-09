import { describe, test, expect } from "assemblyscript-unittest-framework/assembly";
import { quick_sort } from "../assembly/source2";

describe("quick_sort", () => {
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
