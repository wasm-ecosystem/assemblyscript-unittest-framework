import { FunctionCoverageResult, Rate } from "../../../src/interface.js";
import { SingleFileCoverageAnalysis } from "../../../src/parser/singleFileAnalysis.js";

describe("singleFileAnalysis", () => {
  const source = "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n";

  test("setTotalFunction 0", () => {
    const analyzer = new SingleFileCoverageAnalysis("main", source);
    analyzer.setTotalFunction(0);
    expect(analyzer.getResult().functionCoverageRate.toString()).toEqual("0/0");
  });

  test("setUnTestedFunction", () => {
    const analyzer = new SingleFileCoverageAnalysis("main", source);
    analyzer.setTotalFunction(5);
    analyzer.setUnTestedFunction([
      [2, 4],
      [7, 9],
    ]);
    const result = analyzer.getResult();
    expect(result.functionCoverageRate.toString()).toEqual("0/5");
    expect(result.lineCoverageRate.toString()).toEqual("0/6");
    expect(result.statementCoverageRate.toString()).toEqual("0/6");
    expect(result.sourceUsedCount.map((count) => count.usedCount)).toEqual([
      -1, 0, 0, 0, -1, -1, 0, 0, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    ]);
  });

  test("merge", () => {
    const analyzer = new SingleFileCoverageAnalysis("main", source);
    analyzer.setTotalFunction(5);
    const rate_A = new Rate();
    rate_A.used = 1;
    rate_A.total = 2;
    const funcResult_A: FunctionCoverageResult = {
      functionName: "A",
      lineRange: [6, 9],
      branchCoverageRate: rate_A,
      uncoveredlines: new Set<number>([]),
      sourceUsedCount: new Map([
        [6, 3],
        [7, 0],
        [9, 3],
      ]),
    };
    const rate_B = new Rate();
    rate_B.used = 1;
    rate_B.total = 4;
    const funcResult_B: FunctionCoverageResult = {
      functionName: "B",
      lineRange: [10, 14],
      branchCoverageRate: rate_B,
      uncoveredlines: new Set<number>([]),
      sourceUsedCount: new Map([
        [10, 2],
        [11, 0],
        [12, 3],
        [14, 5],
      ]),
    };
    analyzer.merge([funcResult_A, funcResult_B]);
    analyzer.setUnTestedFunction([
      [2, 4],
      [16, 16],
      [17, 19],
    ]);
    const result = analyzer.getResult();
    expect(result.functionCoverageRate.toString()).toEqual("2/5");
    expect(result.lineCoverageRate.toString()).toEqual("5/14");
    expect(result.statementCoverageRate.toString()).toEqual("5/14");
    expect(result.sourceUsedCount.map((count) => count.usedCount)).toEqual([
      -1, 0, 0, 0, -1, 3, 0, -1, 3, 2, 0, 3, -1, 5, -1, 0, 0, 0, 0, -1,
    ]);
  });

  test("setUnTestedFunction error", () => {
    const analyzer = new SingleFileCoverageAnalysis("main", source);
    expect(() => analyzer.setUnTestedFunction([[30, 31]])).toThrow("unknown error: There is no 29 Line in file main");
  });

  test("merge error", () => {
    const analyzer = new SingleFileCoverageAnalysis("main", source);
    analyzer.setTotalFunction(5);
    const rate = new Rate();
    rate.used = 1;
    rate.total = 2;
    const funcResult: FunctionCoverageResult = {
      functionName: "A",
      lineRange: [6, 30],
      branchCoverageRate: rate,
      uncoveredlines: new Set<number>([]),
      sourceUsedCount: new Map([
        [6, 3],
        [7, 0],
        [30, 3],
      ]),
    };
    expect(() => analyzer.merge([funcResult])).toThrow();
  });
});
