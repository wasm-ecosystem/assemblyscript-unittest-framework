import assert from "node:assert";

interface MockValue {
  calls: number;
  ignore: boolean;
  newIndex: number;
}

export const mockInstrumentFunc = {
  // isCall = true,  return -1 if not mocked;
  // isCall = false, return oldIndex if not mocked.
  checkMock(index: number, isCall: boolean): number {
    if (mockInstrumentFunc["mockFunctionStatus.has"](index)) {
      return mockInstrumentFunc["mockFunctionStatus.get"](index);
    }
    return isCall ? -1 : index;
  },
  "mockFunctionStatus.last": 0,
  "mockFunctionStatus.state": new Map<number, MockValue>(),
  "mockFunctionStatus.clear": function () {
    mockInstrumentFunc["mockFunctionStatus.state"].clear();
  },
  "mockFunctionStatus.set": function (k: number, v: number) {
    const value: MockValue = {
      calls: 0,
      ignore: false,
      newIndex: v,
    };
    mockInstrumentFunc["mockFunctionStatus.state"].set(k, value);
  },
  "mockFunctionStatus.get": function (k: number): number {
    const fn = mockInstrumentFunc["mockFunctionStatus.state"].get(k);
    assert(fn);
    fn.calls++;
    mockInstrumentFunc["mockFunctionStatus.last"] = k;
    return fn.newIndex;
  },
  "mockFunctionStatus.lastGet": function (): number {
    return mockInstrumentFunc["mockFunctionStatus.last"];
  },
  "mockFunctionStatus.has": function (k: number): boolean {
    const fn = mockInstrumentFunc["mockFunctionStatus.state"].get(k);
    if (fn === undefined) {
      return false;
    }
    return !fn.ignore;
  },
  "mockFunctionStatus.getCalls": function (oldIndex: number, newIndex: number): number {
    const fn = mockInstrumentFunc["mockFunctionStatus.state"].get(oldIndex);
    if (fn === undefined || fn.newIndex !== newIndex) {
      return 0;
    }
    return fn.calls;
  },
  "mockFunctionStatus.setIgnore": function (k: number, v: boolean) {
    const fn = mockInstrumentFunc["mockFunctionStatus.state"].get(k);
    if (fn === undefined) {
      return;
    }
    fn.ignore = v;
  },
};
