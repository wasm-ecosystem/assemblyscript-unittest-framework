// eslint-disable-next-line node/no-extraneous-import
import { jest } from "@jest/globals";

const mockWriteFile = jest.fn();
jest.unstable_mockModule("node:fs", () => ({
  writeFileSync: mockWriteFile,
}));

// eslint-disable-next-line node/no-unsupported-features/es-syntax
const { mockInstruFunc, covInstruFunc } = await import("../../../../src/utils/import.js");
// eslint-disable-next-line node/no-unsupported-features/es-syntax
const fs = await import("node:fs");

describe("imports", () => {
  test("mockInstrument", () => {
    // mock(oldFunctionIndex, newFunctionIndex);
    mockInstruFunc["mockFunctionStatus.set"](1, 4);
    expect(mockInstruFunc.checkMock(1, true)).toEqual(4);
    expect(mockInstruFunc.checkMock(2, false)).toEqual(2);
    expect(mockInstruFunc.checkMock(2, true)).toEqual(-1);
    expect(mockInstruFunc["mockFunctionStatus.lastGet"]()).toEqual(1);
    expect(mockInstruFunc["mockFunctionStatus.getCalls"](1, 4)).toEqual(1);
    expect(mockInstruFunc["mockFunctionStatus.getCalls"](2, 4)).toEqual(0);
    expect(mockInstruFunc["mockFunctionStatus.getCalls"](1, 3)).toEqual(0);
    expect(() => mockInstruFunc["mockFunctionStatus.get"](2)).toThrowError();
    // unmock(oldFunction)
    mockInstruFunc["mockFunctionStatus.setIgnore"](1, true);
    expect(mockInstruFunc.checkMock(1, false)).toEqual(1);
    expect(mockInstruFunc.checkMock(1, true)).toEqual(-1);
    mockInstruFunc["mockFunctionStatus.setIgnore"](2, true);
    expect(mockInstruFunc.checkMock(2, false)).toEqual(2);
    expect(mockInstruFunc.checkMock(2, true)).toEqual(-1);
    // remock(oldFunction)
    mockInstruFunc["mockFunctionStatus.setIgnore"](1, false);
    expect(mockInstruFunc.checkMock(1, false)).toEqual(4);
    mockInstruFunc["mockFunctionStatus.setIgnore"](2, false);
    expect(mockInstruFunc.checkMock(2, false)).toEqual(2);
    expect(mockInstruFunc.checkMock(2, true)).toEqual(-1);
    // clear
    mockInstruFunc["mockFunctionStatus.clear"]();
    expect(mockInstruFunc["mockFunctionStatus.state"].size).toEqual(0);
  });

  test("covInstrument", () => {
    const { covInstrument } = covInstruFunc("test.instrumented.wasm");
    expect(jest.isMockFunction(fs.writeFileSync)).toBeTruthy();
    covInstrument.traceExpression(1, -1, 1);
    covInstrument.traceExpression(1, 1, 0);
    covInstrument.traceExpression(1, 3, 0);
    covInstrument.traceExpression(1, -1, 2);
    covInstrument.outputTrace();
    expect(covInstrument.runtimeTrace).toEqual([
      [1, 1],
      [1, 3],
    ]);
    expect(mockWriteFile).toHaveBeenCalledTimes(1);
    expect(mockWriteFile).toHaveBeenCalledWith("test.trace", "[[1,1],[1,3]]");
  });
});
