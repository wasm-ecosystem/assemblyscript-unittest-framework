// eslint-disable-next-line n/no-extraneous-import
import { jest } from "@jest/globals";

const mockWriteFile = jest.fn();
jest.unstable_mockModule("node:fs", () => ({
  writeFileSync: mockWriteFile,
}));

const { MockStatusRecorder } = await import("../../../../src/core/mockStatusRecorder.js");

describe("imports", () => {
  test("mockInstrument", () => {
    const mockStatusRecorder = new MockStatusRecorder();
    // mock(oldFunctionIndex, newFunctionIndex);
    mockStatusRecorder._setMockFunction(1, 4);
    expect(mockStatusRecorder._checkMock(1, true)).toEqual(4);
    expect(mockStatusRecorder._checkMock(2, false)).toEqual(2);
    expect(mockStatusRecorder._checkMock(2, true)).toEqual(-1);
    expect(mockStatusRecorder._getMockedFunctionCalls(1, 4)).toEqual(1);
    expect(mockStatusRecorder._getMockedFunctionCalls(2, 4)).toEqual(0);
    expect(mockStatusRecorder._getMockedFunctionCalls(1, 3)).toEqual(0);

    // unmock(oldFunction)
    mockStatusRecorder._setMockedFunctionIgnore(1, true);
    expect(mockStatusRecorder._checkMock(1, false)).toEqual(1);
    expect(mockStatusRecorder._checkMock(1, true)).toEqual(-1);
    mockStatusRecorder._setMockedFunctionIgnore(2, true);
    expect(mockStatusRecorder._checkMock(2, false)).toEqual(2);
    expect(mockStatusRecorder._checkMock(2, true)).toEqual(-1);

    // remock(oldFunction)
    mockStatusRecorder._setMockedFunctionIgnore(1, false);
    expect(mockStatusRecorder._checkMock(1, false)).toEqual(4);
    mockStatusRecorder._setMockedFunctionIgnore(2, false);
    expect(mockStatusRecorder._checkMock(2, false)).toEqual(2);
    expect(mockStatusRecorder._checkMock(2, true)).toEqual(-1);
  });
});
