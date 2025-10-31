#include "utils.h"
#include "json/value.h"
#include <gmock/gmock.h>
#include <unordered_map>
#include <unordered_set>

namespace testUtils {

bool compareDebugInfoJson(Json::Value const &fixtureJson,
                          Json::Value const &debugInfoJson) noexcept {
  if ((!fixtureJson.isObject()) && (!debugInfoJson.isObject())) {
    std::cerr << "Not same with types\n";
    return false;
  }

  // compare debug files
  const auto &files1 = fixtureJson["debugFiles"];
  const auto &files2 = debugInfoJson["debugFiles"];
  if (!(files1 == files2)) {
    std::cerr << "Not same with files\n";
    return false;
  }

  // compare function debug info
  const Json::Value &debugInfos1 = fixtureJson["debugInfos"];
  const Json::Value &debugInfos2 = debugInfoJson["debugInfos"];
  const Json::Value::Members &functionNames = debugInfos1.getMemberNames();
  const Json::Value::Members &compareFunctionNames = debugInfos2.getMemberNames();
  EXPECT_THAT(functionNames, testing::UnorderedElementsAreArray(compareFunctionNames));
  if (functionNames != compareFunctionNames) {
    return false;
  }
  for (const std::string_view functionName : functionNames) {
    const Json::Value &functionDebugInfo = debugInfos1[functionName.data()];
    const Json::Value &compareFunctionDebugInfo = debugInfos2[functionName.data()];
    if (functionDebugInfo["index"] != compareFunctionDebugInfo["index"]) {
      std::cerr << "Not same with function index\n";
      return false;
    }

    if (functionDebugInfo["lineInfo"] != compareFunctionDebugInfo["lineInfo"]) {
      std::cerr << "Not same with function line info\n";
      return false;
    }

    // for branch info, compare without order
    std::unordered_map<uint32_t, std::unordered_set<uint32_t>> branchInfos;
    if (functionDebugInfo["branchInfo"].size() != compareFunctionDebugInfo["branchInfo"].size()) {
      std::cerr << "Not same with function branch info size\n";
      return false;
    }
    for (const Json::Value &branchPair : functionDebugInfo["branchInfo"]) {
      branchInfos[branchPair[0U].asUInt()].insert(branchPair[1U].asUInt());
    }
    for (const Json::Value &branchPair : compareFunctionDebugInfo["branchInfo"]) {
      const auto &findIterator = branchInfos.find(branchPair[0U].asUInt());
      if (findIterator == branchInfos.cend()) {
        std::cerr << "Not same with function branch info\n";
        return false;
      }
      if (findIterator->second.find(branchPair[1U].asUInt()) == findIterator->second.cend()) {
        std::cerr << "Not same with function branch info\n";
        return false;
      }
    }
  }
  return true;
}
} // namespace testUtils
