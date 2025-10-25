enable_testing()

include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/releases/download/v1.16.0/googletest-1.16.0.tar.gz
  DOWNLOAD_EXTRACT_TIMESTAMP TRUE
)
FetchContent_MakeAvailable(googletest)

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
