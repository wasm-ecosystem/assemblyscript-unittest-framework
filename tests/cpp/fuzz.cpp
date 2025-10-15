#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <filesystem>
#include <gtest/gtest.h>
#include <string_view>
#include "../../instrumentation/CoverageInstru.hpp"
#include "../../instrumentation/InstrumentResponse.hpp"
#include "utils/utils.h"

TEST(fuzz, asc) {
  const std::filesystem::path projectPath = testUtils::getProjectPath();
  const std::filesystem::path build_path = projectPath / "build";
  const std::filesystem::path wasmPath =
      projectPath / "tests" / "cpp" / "fuzz" / "assemblyscript.debug.wasm";
  const std::filesystem::path mapPath =
      projectPath / "tests" / "cpp" / "fuzz" / "assemblyscript.debug.wasm.map";
  const std::filesystem::path targetPath =
      build_path / "assemblyscript.debug.wasm.instrumented.wasm";
  const std::filesystem::path targetDebugInfoPath =
      build_path / "assemblyscript.debug.wasm.debuginfo.json";
  const std::filesystem::path targetExpectInfoPath =
      build_path / "assemblyscript.debug.wasm.expectinfo.json";
  const char *reportName = "assembly/env/traceExpression";
  const std::string wasmPathStr = wasmPath.string();
  const std::string targetDebugInfoPathStr = targetDebugInfoPath.string();
  const std::string mapPathStr = mapPath.string();
  const std::string targetPathStr = targetPath.string();
  const std::string targetExpectInfoPathStr = targetExpectInfoPath.string();
  wasmInstrumentation::InstrumentationConfig config;
  config.fileName = wasmPathStr;
  config.debugInfoOutputFilePath = targetDebugInfoPathStr;
  config.sourceMap = mapPathStr;
  config.targetName = targetPathStr;
  config.expectInfoOutputFilePath = targetExpectInfoPathStr;
  config.reportFunction = reportName;
  wasmInstrumentation::CoverageInstru instrumentor(&config);
  ASSERT_EQ(instrumentor.instrument(), wasmInstrumentation::InstrumentationResponse::NORMAL);
}
