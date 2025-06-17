import { describe, test, expect, mock } from "../assembly";
import { log } from "./env";
import { add, Test } from "./source";

describe("example 1", () => {
  test("two plus two is four", () => {
    expect(add(2, 2)).equal(4);
  });
  test("two plus two is not three", () => {
    expect(add(2, 2)).notEqual(3);
  });
  test("I want to mock add to make two plus two is three", () => {
    mock(add, (a: i32, b: i32): i32 => {
      return 3;
    });
    expect(add(2, 2)).equal(3);
  });
  test("out of mock range, this test should be failed", () => {
    log("2 + 2 should be 4");
    expect(add(2, 2)).equal(3);
  });
});

describe("example 2", () => {
  test("mock class function", () => {
    const fn = mock(new Test().getTwo, function (this: Test): i32 {
      return 4;
    });
    expect(new Test().getTwo()).equal(4);
    expect(fn.calls).equal(1);
  });
  test("mock class function", () => {
    const fn = mock(Test.getThree, function (): i32 {
      return 4;
    });
    expect(Test.getThree()).equal(4);
    expect(fn.calls).equal(1);
  });
});
