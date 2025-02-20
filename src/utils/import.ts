import assert from "node:assert";
import { writeFileSync } from "node:fs";

interface MockValue {
  calls: number;
  ignore: boolean;
  newIndex: number;
}

export const mockInstruFunc = {
  // isCall = true,  return -1 if not mocked;
  // isCall = false, return oldIndex if not mocked.
  checkMock(index: number, isCall: boolean): number {
    if (mockInstruFunc["mockFunctionStatus.has"](index)) {
      return mockInstruFunc["mockFunctionStatus.get"](index);
    }
    return isCall ? -1 : index;
  },
  "mockFunctionStatus.last": 0,
  "mockFunctionStatus.state": new Map<number, MockValue>(),
  "mockFunctionStatus.clear": function () {
    mockInstruFunc["mockFunctionStatus.state"].clear();
  },
  "mockFunctionStatus.set": function (k: number, v: number) {
    const value: MockValue = {
      calls: 0,
      ignore: false,
      newIndex: v,
    };
    mockInstruFunc["mockFunctionStatus.state"].set(k, value);
  },
  "mockFunctionStatus.get": function (k: number): number {
    const fn = mockInstruFunc["mockFunctionStatus.state"].get(k);
    assert(fn);
    fn.calls++;
    mockInstruFunc["mockFunctionStatus.last"] = k;
    return fn.newIndex;
  },
  "mockFunctionStatus.lastGet": function (): number {
    return mockInstruFunc["mockFunctionStatus.last"];
  },
  "mockFunctionStatus.has": function (k: number): boolean {
    const fn = mockInstruFunc["mockFunctionStatus.state"].get(k);
    if (fn === undefined) {
      return false;
    }
    return !fn.ignore;
  },
  "mockFunctionStatus.getCalls": function (oldIndex: number, newIndex: number): number {
    const fn = mockInstruFunc["mockFunctionStatus.state"].get(oldIndex);
    if (fn === undefined || fn.newIndex !== newIndex) {
      return 0;
    }
    return fn.calls;
  },
  "mockFunctionStatus.setIgnore": function (k: number, v: boolean) {
    const fn = mockInstruFunc["mockFunctionStatus.state"].get(k);
    if (fn === undefined) {
      return;
    }
    fn.ignore = v;
  },
};

export function covInstruFunc(wasm: string) {
  const covInstrument = {
    runtimeTrace: new Array<[number, number]>(),
    traceExpression(functionIndex: number, basicBlockIndex: number, type: number) {
      switch (type) {
        case 1: // call in
        case 2: {
          // call out
          // do not need for now
          break;
        }
        case 0: {
          covInstrument.runtimeTrace.push([functionIndex, basicBlockIndex]);
          break;
        }
      }
    },
    outputTrace() {
      assert(wasm.endsWith("instrumented.wasm"));
      const traceOutputFile = wasm.slice(0, -17).concat("trace");
      writeFileSync(traceOutputFile, JSON.stringify(covInstrument.runtimeTrace));
    },
  };
  return { covInstrument };
}
