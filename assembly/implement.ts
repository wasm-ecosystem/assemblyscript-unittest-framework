import { assertResult } from "./env";
import { MockFn, mockFunctionStatus } from "./mockInstrument";

export function describeImpl(
  description: string,
  testsFunction: () => void,
): void {
  assertResult.addDescription(description);
  testsFunction();
  assertResult.removeDescription();
}
export function testImpl(name: string, testFunction: () => void): void {
  assertResult.addDescription(name);
  assertResult.registerTestFunction(testFunction.index);
  assertResult.removeDescription();
}

export function mockImpl<T extends Function>(
  oldFunction: T,
  newFunction: T,
): MockFn {
  if (!isFunction<T>(oldFunction) || !isFunction<T>(newFunction)) {
    ERROR("mock paramemter receive a function");
  }
  const mockFn = new MockFn(oldFunction.index, newFunction.index);
  mockFunctionStatus.set(oldFunction.index, newFunction.index);
  return mockFn;
}
export function unmockImpl<T extends Function>(oldFunction: T): void {
  mockFunctionStatus.setIgnore(oldFunction.index, true);
}
export function remockImpl<T extends Function>(oldFunction: T): void {
  mockFunctionStatus.setIgnore(oldFunction.index, false);
}
