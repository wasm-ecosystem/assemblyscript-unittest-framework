find_package(GTest REQUIRED)
include(FetchContent)

file(GLOB test_sources CONFIGURE_DEPENDS *.cpp ./utils/*.cpp) # innclude lit test by default

add_executable(
  wasm-instrumentation-test
  ${test_sources}
)
target_link_libraries(
  wasm-instrumentation-test
  PUBLIC
  wasm-instrumentation
  GTest::gtest_main
  binaryen
  jsoncpp_static
)
include(GoogleTest)
gtest_discover_tests(wasm-instrumentation-test)

if(ENABLE_E2E)
  add_custom_target(npm-install ALL
    COMMAND npm install
    WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/test-asc
  )
  add_custom_target(compile-asc ALL
    DEPENDS npm-install
    COMMAND npm run ascbuild
    WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/test-asc
  )
  add_dependencies(wasm-instrumentation-test copy-files)
  add_custom_target(copy-files ALL
    DEPENDS compile-asc
    COMMAND ${CMAKE_COMMAND} -E copy_directory
    ${CMAKE_CURRENT_SOURCE_DIR}/test-asc/build
    ${CMAKE_CURRENT_BINARY_DIR}/test-asc/build
  )
endif()

if(CMAKE_COMPILER_IS_GNUCXX)
  LIST(APPEND CMAKE_MODULE_PATH ${PROJECT_SOURCE_DIR}/CMakeModules)
  include(CodeCoverage)
  APPEND_COVERAGE_COMPILER_FLAGS()
  setup_target_for_coverage_gcovr_xml(NAME cov
    EXECUTABLE wasm-instrumentation-test
    DEPENDENCIES wasm-instrumentation-test
    BASE_DIRECTORY "${PROJECT_SOURCE_DIR}/instrumentation")

  setup_target_for_coverage_gcovr_html(NAME cov_html
    EXECUTABLE wasm-instrumentation-test
    DEPENDENCIES wasm-instrumentation-test
    BASE_DIRECTORY "${PROJECT_SOURCE_DIR}/instrumentation")
endif()
