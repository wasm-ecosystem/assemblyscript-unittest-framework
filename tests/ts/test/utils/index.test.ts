import { Imports as ASImports } from "@assemblyscript/loader";

import { supplyDefaultFunction } from "../../../../src/utils/index.js";

describe("supplyDefaultFunction", () => {
  test("supplyTest", () => {
    const mockImportList: WebAssembly.ModuleImportDescriptor[] = [
      { kind: "function", module: "myenv", name: "processEvent" },
      { kind: "function", module: "externalMath", name: "add" },
      { kind: "function", module: "system", name: "getStatus" },
      { kind: "function", module: "logger", name: "logWarning" },
      { kind: "function", module: "customOps", name: "combineValues" },
    ];

    const mockImportObject: ASImports = {
      myenv: {},
      externalMath: {},
      system: {},
      logger: {},
      customOps: {},
    };

    supplyDefaultFunction(mockImportList, mockImportObject);

    expect(typeof mockImportObject["myenv"]?.["processEvent"]).toBe("function");
    expect(typeof mockImportObject["system"]?.["getStatus"]).toBe("function");
    expect(typeof mockImportObject["logger"]?.["logWarning"]).toBe("function");
    expect(typeof mockImportObject["customOps"]?.["combineValues"]).toBe("function");
  });
});
