#include "json/reader.h"
#include "json/value.h"
#include <algorithm>
#include <filesystem>
#include <fstream>
#include <gtest/gtest.h>
#include <sstream>
#include <string>
#include <string_view>
#include <vector>
#include "../../instrumentation/CoverageInstru.hpp"
#include "../../instrumentation/InstrumentResponse.hpp"
#include "utils/utils.h"

TEST(lit, coverageInstrumentation) {
  // step 1, prepare
  const std::filesystem::path projectPath = testUtils::getProjectPath();
  const std::filesystem::path wasmOptPath =
      projectPath / "build" / "third_party" / "binaryen" / "bin" / "wasm-opt";
  const std::filesystem::path fixtureFolder =
      projectPath / "tests" / "cpp" / "lit" / "covInstrument";
  const std::filesystem::path tmpDir = projectPath / "tests" / "cpp" / "lit" / "build";
  const std::filesystem::path executor = projectPath / "tests" / "cpp" / "lit" / "run.cjs";
  const std::filesystem::path checkPy = projectPath / "tests" / "cpp" / "check.py";

  if (!exists(tmpDir)) {
    create_directory(tmpDir);
  }

  // step 2, build

  const std::string separator(" ");
  std::vector<std::filesystem::path> wastFiles;
  for (const auto &entity : std::filesystem::recursive_directory_iterator(fixtureFolder)) {
    if (entity.is_regular_file() && entity.path().extension() == ".wast") {
      std::stringstream cmd;
      cmd << wasmOptPath;
      wastFiles.push_back(entity.path().filename());
      cmd << separator << entity << separator << "-o" << separator << tmpDir << "/"
          << entity.path().filename() << ".out.wasm" << separator << "-osm" << separator << tmpDir
          << "/" << entity.path().filename() << ".out.wasm.map" << separator << "-g" << separator
          << "-q";
      ASSERT_EQ(system(cmd.str().c_str()), 0);
    }
  }
  const char *include = "[\"main\",\"assembly/.*\"]";
  Json::Reader jsonReader;
  // step 3, instrument , run and check;
  for (std::filesystem::path const &wastPath : wastFiles) {
    const std::string wast = wastPath.string();
    const std::filesystem::path wasmFile = tmpDir / (wast + ".out.wasm");
    const std::filesystem::path wasmFileMap = tmpDir / (wast + ".out.wasm.map");
    const std::filesystem::path wasmTarget = tmpDir / (wast + ".instrumented.wasm");
    const std::filesystem::path debugTarget = tmpDir / (wast + ".debug.json");
    const std::filesystem::path expectTarget = tmpDir / (wast + ".expect.json");
    const char *traceFunName = "assembly/env/traceExpression";
    wasmInstrumentation::InstrumentationConfig config;
    std::cout << "running lit - " << fixtureFolder << "/" << wast << std::endl;
    const std::string wasmFileStr = wasmFile.string();
    const std::string debugTargetStr = debugTarget.string();
    const std::string expectTargetStr = expectTarget.string();
    const std::string wasmFileMapStr = wasmFileMap.string();
    const std::string wasmTargetStr = wasmTarget.string();
    config.fileName = wasmFileStr;
    config.debugInfoOutputFilePath = debugTargetStr;
    config.expectInfoOutputFilePath = expectTargetStr;
    config.sourceMap = wasmFileMapStr;
    config.targetName = wasmTargetStr;
    config.reportFunction = traceFunName;
    config.includes = include;
    config.excludes = "";
    wasmInstrumentation::CoverageInstru instrumentor(&config);
    ASSERT_EQ(instrumentor.instrument(), wasmInstrumentation::InstrumentationResponse::NORMAL);
    std::stringstream cmd;
    cmd << "node " << executor << " " << wasmTarget << " >" << tmpDir << "/" << wast << ".run.log";
    const std::filesystem::path fixtureFilePath = fixtureFolder / (wast + ".debug.json");
    std::ifstream fixtureStream(fixtureFilePath);
    std::ifstream debugInfoStream(debugTarget);
    Json::Value fixtureJson;
    Json::Value debugInfoJson;
    jsonReader.parse(fixtureStream, fixtureJson, false);
    jsonReader.parse(debugInfoStream, debugInfoJson, false);

    ASSERT_TRUE(testUtils::compareDebugInfoJson(fixtureJson, debugInfoJson));
    std::stringstream runLogCmpCmd;
    runLogCmpCmd << "python3 " << checkPy << separator << fixtureFolder << "/" << wast << ".run.log"
                 << separator << tmpDir << "/" << wast << ".run.log";
    ASSERT_EQ(system(cmd.str().c_str()), 0);
    ASSERT_EQ(system(runLogCmpCmd.str().c_str()), 0);
  }
}

TEST(lit, expectInstrumentation) {
  const std::filesystem::path projectPath = testUtils::getProjectPath();
  const std::filesystem::path fixtureFolder =
      projectPath / "tests" / "cpp" / "lit" / "expectInstrument";
  const std::filesystem::path tmpDir = projectPath / "tests" / "cpp" / "lit" / "build";
  const std::filesystem::path checkPy = projectPath / "tests" / "cpp" / "check.py";

  if (!exists(tmpDir)) {
    create_directory(tmpDir);
  }

  wasmInstrumentation::InstrumentationConfig config;
  const std::filesystem::path wasmFile = fixtureFolder / "expect.test.wasm";
  const std::filesystem::path wasmFileMap = fixtureFolder / "expect.test.wasm.map";
  const std::filesystem::path debugTarget = tmpDir / "expect.test.debug.json";
  const std::filesystem::path expectTarget = tmpDir / "expect.test.expect.json";
  const std::filesystem::path wasmTarget = tmpDir / "expect.test.instrumented.wasm";
  const char *traceFunName = "assembly/env/traceExpression";
  const char *include = "[\"tests-as\",\"assembly/.*\"]";
  const std::string wasmFileStr = wasmFile.string();
  const std::string wasmFileMapStr = wasmFileMap.string();
  const std::string debugTargetStr = debugTarget.string();
  const std::string expectTargetStr = expectTarget.string();
  const std::string wasmTargetStr = wasmTarget.string();
  config.fileName = wasmFileStr;
  config.sourceMap = wasmFileMapStr;
  config.debugInfoOutputFilePath = debugTargetStr;
  config.expectInfoOutputFilePath = expectTargetStr;
  config.targetName = wasmTargetStr;
  config.reportFunction = traceFunName;
  config.includes = include;
  config.excludes = "";
  wasmInstrumentation::CoverageInstru instrumentor(&config);
  ASSERT_EQ(instrumentor.instrument(), wasmInstrumentation::InstrumentationResponse::NORMAL);

  std::stringstream assertExpectInfoCmd;
  assertExpectInfoCmd << "python3 " << checkPy << " " << fixtureFolder << "/"
                      << "expect.test.expect.json"
                      << " " << tmpDir << "/"
                      << "expect.test.expect.json";
  ASSERT_EQ(system(assertExpectInfoCmd.str().c_str()), 0);
}
