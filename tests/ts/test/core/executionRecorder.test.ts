import { ExecutionRecorder } from "../../../../src/core/executionRecorder.js";

describe("execution recorder", () => {
  describe("description", () => {
    test("add single description", () => {
      const recorder = new ExecutionRecorder();
      recorder._addDescription("description");
      recorder._addTestCase(1);
      expect(recorder.testCases).toMatchObject([{ functionIndex: 1, fullName: "description" }]);

      recorder._startTestFunction("description");
      recorder.collectCheckResult(false, 0, "", "");
      expect(recorder.result.failedInfo).toHaveProperty("description");
    });
    test("add multiple descriptions", () => {
      const recorder = new ExecutionRecorder();
      recorder._addDescription("description1");
      recorder._addDescription("description2");
      recorder._addTestCase(1);
      expect(recorder.testCases).toMatchObject([{ functionIndex: 1, fullName: "description1 description2" }]);

      recorder._startTestFunction("description1 description2");
      recorder.collectCheckResult(false, 0, "", "");
      expect(recorder.result.failedInfo).toHaveProperty("description1 description2");
    });

    test("remove  descriptions", () => {
      const recorder = new ExecutionRecorder();
      recorder._addDescription("description1");
      recorder._addDescription("description2");
      recorder._removeDescription();
      recorder._addTestCase(1);
      expect(recorder.testCases).toMatchObject([{ functionIndex: 1, fullName: "description1" }]);

      recorder._startTestFunction("description1");
      recorder.collectCheckResult(false, 0, "", "");
      expect(recorder.result.failedInfo).toHaveProperty("description1");
    });
  });

  describe("setup and teardown", () => {
    test("base", () => {
      const recorder = new ExecutionRecorder();
      recorder._addDescription("description");
      recorder._registerSetup(10);
      recorder._registerSetup(11);
      recorder._registerTeardown(20);
      recorder._registerTeardown(21);
      recorder._addTestCase(1);
      expect(recorder.testCases).toMatchObject([{ setupFunctions: [10, 11], teardownFunctions: [20, 21] }]);
    });
    test("pop", () => {
      const recorder = new ExecutionRecorder();
      recorder._addDescription("description 1");
      recorder._registerSetup(10);
      recorder._registerTeardown(20);

      recorder._addDescription("description 2");
      recorder._registerSetup(11);
      recorder._registerTeardown(21);
      recorder._removeDescription();

      recorder._addTestCase(1);
      expect(recorder.testCases).toMatchObject([{ setupFunctions: [10], teardownFunctions: [20] }]);
    });

    test("out of block", () => {
      const recorder = new ExecutionRecorder();
      expect(recorder._registerSetup(10)).toBe(false);
      expect(recorder._registerTeardown(20)).toBe(false);
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
