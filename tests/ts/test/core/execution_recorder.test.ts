import { ExecutionRecorder } from "../../../../src/core/execution_recorder.js";

describe("execution recorder", () => {
  describe("description", () => {
    test("add single description", () => {
      const recorder = new ExecutionRecorder();
      recorder._addDescription("description");

      recorder.collectCheckResult(false, 0, "", "");
      expect(recorder.failed_info).toHaveProperty("description");
    });
    test("add multiple descriptions", () => {
      const recorder = new ExecutionRecorder();
      recorder._addDescription("description1");
      recorder._addDescription("description2");

      recorder.collectCheckResult(false, 0, "", "");
      expect(recorder.failed_info).toHaveProperty("description1 - description2");
    });

    test("remove  descriptions", () => {
      const recorder = new ExecutionRecorder();
      recorder._addDescription("description1");
      recorder._addDescription("description2");
      recorder._removeDescription();

      recorder.collectCheckResult(false, 0, "", "");
      expect(recorder.failed_info).toHaveProperty("description1");
    });
  });

  describe("collectCheckResult", () => {
    test("collect false result", () => {
      const recorder = new ExecutionRecorder();
      recorder.collectCheckResult(false, 0, "actual", "expect");

      expect(recorder.total).toBe(1);
      expect(recorder.fail).toBe(1);
    });
    test("collect true results", () => {
      const recorder = new ExecutionRecorder();
      recorder.collectCheckResult(true, 0, "actual1", "expect1");

      expect(recorder.total).toBe(1);
      expect(recorder.fail).toBe(0);
    });
    test("collect multiple results", () => {
      const recorder = new ExecutionRecorder();
      recorder.collectCheckResult(true, 0, "actual1", "expect1");
      recorder.collectCheckResult(false, 1, "actual2", "expect2");

      expect(recorder.total).toBe(2);
      expect(recorder.fail).toBe(1);
    });
  });
});
