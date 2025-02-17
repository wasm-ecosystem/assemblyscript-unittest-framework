import { CovInfo, FunctionCoverageResult } from "../../../src/interface.js";
import { SingleFunctionCoverageAnalysis } from "../../../src/parser/singleFunctionAnalysis.js";

describe("singleFunctionAnalysis", () => {
  test("function with two if-else statement", () => {
    const covInfo: CovInfo = {
      branchInfo: [
        [1, 2],
        [1, 6],
        [2, 3],
        [2, 4],
      ],
      lineInfo: new Map([
        [1, new Set([6, 7])],
        [2, new Set([8, 9])],
        [3, new Set([10])],
        [4, new Set([12])],
        [5, new Set([])],
        [6, new Set([15, 16])],
      ]),
    };
    const traceInfo = [1, 2, 3, 5, 6];
    const analyzer = new SingleFunctionCoverageAnalysis(covInfo, "main");
    const result = analyzer.update(traceInfo);
    expect(result.lineRange).toEqual([6, 16]);
    expect(result.branchCoverageRate.toString()).toEqual("2/4");
    expect(result.branchCoverageRate.getRate()).toBeCloseTo(50);
    expect(result.sourceUsedCount).toEqual(
      new Map([
        [6, 1],
        [7, 1],
        [8, 1],
        [9, 1],
        [10, 1],
        [12, 0],
        [15, 1],
        [16, 1],
      ])
    );
  });

  test("function with only one basic block", () => {
    const covInfo: CovInfo = {
      branchInfo: [],
      lineInfo: new Map([[1, new Set([3, 4, 5])]]),
    };
    const traceInfo = [1, 1, 1];
    const analyzer = new SingleFunctionCoverageAnalysis(covInfo, "main");
    const result = analyzer.update(traceInfo);
    expect(result.lineRange).toEqual([3, 5]);
    expect(result.branchCoverageRate.toString()).toEqual("0/0");
    expect(result.branchCoverageRate.getRate()).toBeCloseTo(100);
    expect(result.sourceUsedCount).toEqual(
      new Map([
        [3, 3],
        [4, 3],
        [5, 3],
      ])
    );
  });

  test("forLoop", () => {
    const covInfo: CovInfo = {
      branchInfo: [
        [1, 2],
        [1, 3],
      ],
      lineInfo: new Map([
        [0, new Set([17, 18])],
        [1, new Set([18])],
        [2, new Set([18, 20])],
        [3, new Set([])],
        [4, new Set([22])],
      ]),
    };
    const traceInfo = [0, 1, 3, 4];
    const analyzer = new SingleFunctionCoverageAnalysis(covInfo, "main");
    const result = analyzer.update(traceInfo);
    expect(result.uncoveredlines).toEqual(new Set([18]));
  });

  test("ifWithoutElse", () => {
    const covInfo: CovInfo = {
      branchInfo: [
        [0, 1],
        [0, 2],
      ],
      lineInfo: new Map([
        [0, new Set([2])],
        [1, new Set([3])],
        [2, new Set([5])],
      ]),
    };
    const traceInfo = [0, 1];
    const analyzer = new SingleFunctionCoverageAnalysis(covInfo, "main");
    const result = analyzer.update(traceInfo);
    expect(result.uncoveredlines).toEqual(new Set([2]));
  });

  test("threeOperandOperator", () => {
    const covInfo: CovInfo = {
      branchInfo: [
        [0, 1],
        [0, 2],
      ],
      lineInfo: new Map([
        [0, new Set([26])],
        [1, new Set([26])],
        [2, new Set([26])],
        [3, new Set([26])],
      ]),
    };
    const traceInfo = [3, 0, 1];
    const analyzer = new SingleFunctionCoverageAnalysis(covInfo, "main");
    const result = analyzer.update(traceInfo);
    expect(result.uncoveredlines).toEqual(new Set([26]));
  });

  test("whileLoop", () => {
    const covInfo: CovInfo = {
      branchInfo: [
        [1, 2],
        [1, 3],
      ],
      lineInfo: new Map([
        [0, new Set([9])],
        [1, new Set([10])],
        [2, new Set([11])],
        [3, new Set([])],
        [4, new Set([10, 13])],
      ]),
    };
    const traceInfo = [0, 1, 3, 4];
    const analyzer = new SingleFunctionCoverageAnalysis(covInfo, "main");
    const result = analyzer.update(traceInfo);
    expect(result.uncoveredlines).toEqual(new Set([10]));
  });
});

test("mergeFromGeneric()", () => {
  const genericType_i64: CovInfo = {
    branchInfo: [],
    lineInfo: new Map([[1, new Set([2, 5, 8, 9])]]),
  };
  const trace_i64 = [1, 1, 1, 1];
  const analyzer_i64 = new SingleFunctionCoverageAnalysis(genericType_i64, "A<i64>");
  const result_i64 = analyzer_i64.update(trace_i64);

  const genericType_array: CovInfo = {
    branchInfo: [
      [2, 3],
      [2, 4],
    ],
    lineInfo: new Map([
      [1, new Set([68])],
      [2, new Set([68])],
      [3, new Set([71, 72])],
      [4, new Set([68])],
      [5, new Set([71, 74, 75, 76])],
    ]),
  };
  const trace_array = [1, 2, 4, 1, 4, 5];
  const analyzer_array = new SingleFunctionCoverageAnalysis(genericType_array, "A<~lib/array/Array<i32>|null>");
  const result_array = analyzer_array.update(trace_array);

  const result = FunctionCoverageResult.mergeFromGeneric("A", [result_i64, result_array]);
  expect(result.lineRange).toEqual([2, 76]);
  expect(result.branchCoverageRate.toString()).toEqual("1/2");
  expect(result.branchCoverageRate.getRate()).toBeCloseTo(50);
  expect(result.sourceUsedCount).toEqual(
    new Map([
      [2, 4],
      [5, 4],
      [8, 4],
      [9, 4],
      [68, 5],
      [71, 1],
      [72, 0],
      [74, 1],
      [75, 1],
      [76, 1],
    ])
  );
});
