import { test, expect, describe, beforeEach } from "../../../assembly";

let setup0 = 0;
let setup1 = 0;
describe("setup", () => {
  beforeEach(() => {
    setup0 = 10;
    setup1 = 20;
  });
  test("1st", () => {
    expect(setup0).equal(10);
    expect(setup1).equal(20);
    setup0 = 100;
    setup1 = 200;
  });
  test("2nd", () => {
    expect(setup0).equal(10);
    expect(setup1).equal(20);
    setup0 = 100;
    setup1 = 200;
  });
  test("3nd", () => {
    expect(setup0).equal(10);
    expect(setup1).equal(20);
  });
});
