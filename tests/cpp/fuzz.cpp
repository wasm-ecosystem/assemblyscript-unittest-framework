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
  const std::filesystem::path project_path = testUtils::getProjectPath();
  const std::filesystem::path build_path = project_path / "build";
  const std::filesystem::path wasmPath =
      project_path / "test" / "fuzz" / "assemblyscript.debug.wasm";
  const std::filesystem::path mapPath =
      project_path / "test" / "fuzz" / "assemblyscript.debug.wasm.map";
  const std::filesystem::path targetPath =
      build_path / "assemblyscript.debug.wasm.instrumented.wasm";
  const std::filesystem::path targetDebugInfoPath =
      build_path / "assemblyscript.debug.wasm.debuginfo.json";
  const std::filesystem::path targetExpectInfoPath =
      build_path / "assemblyscript.debug.wasm.expectinfo.json";
  const char *reportName = "assembly/env/traceExpression";
  wasmInstrumentation::InstrumentationConfig config;
  config.fileName = wasmPath.c_str();
  config.debugInfoOutputFilePath = targetDebugInfoPath.c_str();
  config.sourceMap = mapPath.c_str();
  config.targetName = targetPath.c_str();
  config.expectInfoOutputFilePath = targetExpectInfoPath.c_str();
  config.reportFunction = reportName;
  wasmInstrumentation::CoverageInstru instrumentor(&config);
  ASSERT_EQ(instrumentor.instrument(), wasmInstrumentation::InstrumentationResponse::NORMAL);
}
