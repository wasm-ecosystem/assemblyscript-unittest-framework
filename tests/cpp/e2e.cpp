#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <filesystem>
#include <gtest/gtest.h>
#include "../../instrumentation/CoverageInstru.hpp"
#include "../../instrumentation/InstrumentResponse.hpp"
#include "utils/utils.h"

TEST(e2e, asc) {
  const std::filesystem::path project_path = testUtils::getProjectPath();
  const std::filesystem::path build_path = project_path / "build";
  const std::filesystem::path wasmPath =
      project_path / "test" / "test-asc" / "build" / "debug.wasm";
  const std::filesystem::path mapPath =
      project_path / "test" / "test-asc" / "build" / "debug.wasm.map";
  const std::filesystem::path targetPath = wasmPath.parent_path() / "debug.wasm.instrumented.wasm";
  const std::filesystem::path targetDebugInfoPath =
      wasmPath.parent_path() / "debug.wasm.debuginfo.json";
  const std::filesystem::path targetExpectInfoPath =
      wasmPath.parent_path() / "debug.wasm.expectInfo.json";
  const char *reportName = "assembly/env/traceExpression";
  wasmInstrumentation::InstrumentationConfig config;
  config.fileName = wasmPath.c_str();
  config.debugInfoOutputFilePath = targetDebugInfoPath.c_str();
  config.sourceMap = mapPath.c_str();
  config.targetName = targetPath.c_str();
  config.reportFunction = reportName;
  config.expectInfoOutputFilePath = targetExpectInfoPath.c_str();
  wasmInstrumentation::CoverageInstru instrumentor(&config);
  ASSERT_EQ(instrumentor.instrument(), wasmInstrumentation::InstrumentationResponse::NORMAL);
}
TEST(e2e, empty_config) {
  wasmInstrumentation::InstrumentationConfig config;
  wasmInstrumentation::CoverageInstru instrumentor(&config);
  ASSERT_EQ(instrumentor.instrument(), wasmInstrumentation::InstrumentationResponse::CONFIG_ERROR);
}

TEST(e2e, illegal_path_config) {
  const std::filesystem::path project_path = testUtils::getProjectPath();
  const std::filesystem::path build_path = project_path / "build";
  const std::filesystem::path wasmPath =
      project_path / "test" / "test-asc" / "build" / "debug.wasm";
  const std::filesystem::path mapPath =
      project_path / "test" / "test-asc" / "build" / "debug.wasm.map";
  const std::filesystem::path targetPath = wasmPath.parent_path() / "debug.wasm.instrumented.wasm";
  const std::filesystem::path targetExpectInfoPath =
      wasmPath.parent_path() / "debug.wasm.expectInfo.json";
  const char *reportName = "assembly/env/traceExpression";
  wasmInstrumentation::InstrumentationConfig config;
  config.fileName = wasmPath.c_str();
  config.debugInfoOutputFilePath = "this path will not be existed";
  config.sourceMap = mapPath.c_str();
  config.targetName = targetPath.c_str();
  config.reportFunction = reportName;
  config.expectInfoOutputFilePath = targetExpectInfoPath.c_str();
  wasmInstrumentation::CoverageInstru instrumentor(&config);
  ASSERT_EQ(instrumentor.instrument(),
            wasmInstrumentation::InstrumentationResponse::CONFIG_FILEPATH_ERROR);
}
