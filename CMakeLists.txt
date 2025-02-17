cmake_minimum_required(VERSION 3.15)
project(instrumentation)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

if(NOT CMAKE_BUILD_TYPE)
  set(CMAKE_BUILD_TYPE Release)
endif()

set(JSONCPP_WITH_TESTS OFF)
set(BUILD_STATIC_LIBS ON)
set(BUILD_SHARED_LIBS OFF)
set(BUILD_OBJECT_LIBS OFF)
add_subdirectory(third_party/jsoncpp)

set(BUILD_TESTS OFF)
set(BUILD_STATIC_LIB ON)
add_subdirectory(third_party/binaryen)

add_subdirectory(instrumentation)
