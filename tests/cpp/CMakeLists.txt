enable_testing()

find_package(GTest REQUIRED CONFIG)
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
