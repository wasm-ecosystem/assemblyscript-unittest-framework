#ifndef __TEST_UTILS_UTILS_H__
#define __TEST_UTILS_UTILS_H__
#include "json/value.h"
#include <algorithm>
#include <cstdint>
#include <filesystem>
#include <iostream>
#include <string_view>
#include <unordered_set>
#include <utility>

namespace testUtils {

constexpr std::string_view PROJECT_NAME("wasm-instrumentation");

///
/// @brief Get the project path
///
/// @return path of project
inline const std::filesystem::path getProjectPath() noexcept {
  const std::filesystem::path currentFile = std::filesystem::current_path();
  const std::string currentPath = currentFile.string();
  return currentPath.substr(0U, currentPath.rfind(PROJECT_NAME) + PROJECT_NAME.size());
}

///
/// @brief Compare two debug info json object
///
/// @param debugInfoJson1
/// @param debugInfoJson2
/// @return Return true if the are same debug info json object
bool compareDebugInfoJson(Json::Value &debugInfoJson1, Json::Value &debugInfoJson2) noexcept;

} // namespace testUtils

#endif // __TEST_UTILS_UTILS_H__
