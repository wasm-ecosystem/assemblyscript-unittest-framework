import { ExecutionRecorder } from "../../../../src/core/executionRecorder.js";

describe("execution recorder", () => {
  describe("description", () => {
    test("add single description", () => {
      const recorder = new ExecutionRecorder();
      recorder._addDescription("description");
      recorder._registerTestFunction(1);
      expect(recorder.registerFunctions).toEqual([["description", 1]]);

      recorder.startTestFunction("description");
      recorder.collectCheckResult(false, 0, "", "");
      expect(recorder.result.failedInfo).toHaveProperty("description");
    });
    test("add multiple descriptions", () => {
      const recorder = new ExecutionRecorder();
      recorder._addDescription("description1");
      recorder._addDescription("description2");
      recorder._registerTestFunction(1);
      expect(recorder.registerFunctions).toEqual([["description1 description2", 1]]);

      recorder.startTestFunction("description1 description2");
      recorder.collectCheckResult(false, 0, "", "");
      expect(recorder.result.failedInfo).toHaveProperty("description1 description2");
    });

    test("remove  descriptions", () => {
      const recorder = new ExecutionRecorder();
      recorder._addDescription("description1");
      recorder._addDescription("description2");
      recorder._removeDescription();
      recorder._registerTestFunction(1);
      expect(recorder.registerFunctions).toEqual([["description1", 1]]);

      recorder.startTestFunction("description1");
      recorder.collectCheckResult(false, 0, "", "");
      expect(recorder.result.failedInfo).toHaveProperty("description1");
    });
  });

  describe("collectCheckResult", () => {
    test("collect false result", () => {
      const recorder = new ExecutionRecorder();
      recorder.collectCheckResult(false, 0, "actual", "expect");

      expect(recorder.result.total).toBe(1);
      expect(recorder.result.fail).toBe(1);
    });
    test("collect true results", () => {
      const recorder = new ExecutionRecorder();
      recorder.collectCheckResult(true, 0, "actual1", "expect1");

      expect(recorder.result.total).toBe(1);
      expect(recorder.result.fail).toBe(0);
    });
    test("collect multiple results", () => {
      const recorder = new ExecutionRecorder();
      recorder.collectCheckResult(true, 0, "actual1", "expect1");
      recorder.collectCheckResult(false, 1, "actual2", "expect2");

      expect(recorder.result.total).toBe(2);
      expect(recorder.result.fail).toBe(1);
    });
  });
});
