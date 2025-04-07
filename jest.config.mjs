const config = {
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
  transformIgnorePatterns: ["<rootDir>/third_party"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testPathIgnorePatterns: ["/dist/", "/third_party/", "/node_modules/"],
  testTimeout: 10000,
};

export default config;
