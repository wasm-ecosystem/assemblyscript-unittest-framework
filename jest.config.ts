import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  roots: ["tests/ts"],
  extensionsToTreatAsEsm: [".ts"],
  verbose: true,
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  coverageDirectory: "coverage-ts",
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts"],
  transform: {
    "^.+\\.(ts|tsx)?$": ["ts-jest", { useESM: true }],
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  modulePathIgnorePatterns: ["tests/ts/e2e"],
  testPathIgnorePatterns: ["./dist"],
  testTimeout: 10000,
};

export default config;
