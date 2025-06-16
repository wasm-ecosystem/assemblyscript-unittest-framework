// eslint-disable-next-line n/no-extraneous-import
import { jest } from "@jest/globals";

const mockWriteFile = jest.fn();
jest.unstable_mockModule("node:fs", () => ({
  writeFileSync: mockWriteFile,
}));

const { mockInstrumentFunc } = await import("../../../../src/utils/import.js");

describe("imports", () => {
  test("mockInstrument", () => {
    // mock(oldFunctionIndex, newFunctionIndex);
    mockInstrumentFunc["mockFunctionStatus.set"](1, 4);
    expect(mockInstrumentFunc.checkMock(1, true)).toEqual(4);
    expect(mockInstrumentFunc.checkMock(2, false)).toEqual(2);
    expect(mockInstrumentFunc.checkMock(2, true)).toEqual(-1);
    expect(mockInstrumentFunc["mockFunctionStatus.lastGet"]()).toEqual(1);
    expect(mockInstrumentFunc["mockFunctionStatus.getCalls"](1, 4)).toEqual(1);
    expect(mockInstrumentFunc["mockFunctionStatus.getCalls"](2, 4)).toEqual(0);
    expect(mockInstrumentFunc["mockFunctionStatus.getCalls"](1, 3)).toEqual(0);
    expect(() => mockInstrumentFunc["mockFunctionStatus.get"](2)).toThrow();
    // unmock(oldFunction)
    mockInstrumentFunc["mockFunctionStatus.setIgnore"](1, true);
    expect(mockInstrumentFunc.checkMock(1, false)).toEqual(1);
    expect(mockInstrumentFunc.checkMock(1, true)).toEqual(-1);
    mockInstrumentFunc["mockFunctionStatus.setIgnore"](2, true);
    expect(mockInstrumentFunc.checkMock(2, false)).toEqual(2);
    expect(mockInstrumentFunc.checkMock(2, true)).toEqual(-1);
    // remock(oldFunction)
    mockInstrumentFunc["mockFunctionStatus.setIgnore"](1, false);
    expect(mockInstrumentFunc.checkMock(1, false)).toEqual(4);
    mockInstrumentFunc["mockFunctionStatus.setIgnore"](2, false);
    expect(mockInstrumentFunc.checkMock(2, false)).toEqual(2);
    expect(mockInstrumentFunc.checkMock(2, true)).toEqual(-1);
    // clear
    mockInstrumentFunc["mockFunctionStatus.clear"]();
    expect(mockInstrumentFunc["mockFunctionStatus.state"].size).toEqual(0);
  });
});
