cmake_minimum_required(VERSION 3.5)
project(instrumentation VERSION 0.1.0)

set(CMAKE_CXX_STANDARD 23)

set(JSONCPP_WITH_TESTS OFF)
add_subdirectory(${CMAKE_CURRENT_LIST_DIR}/../third_party/jsoncpp)

set(BUILD_TESTS 0)
set(BUILD_STATIC_LIBS ON)
set(BUILD_SHARED_LIBS OFF)
set(BUILD_OBJECT_LIBS OFF)
add_subdirectory(${CMAKE_CURRENT_LIST_DIR}/../third_party/binaryen)

aux_source_directory(${CMAKE_CURRENT_LIST_DIR}/src sources)

add_executable(wasm-instrumentation ${sources})

target_link_libraries(wasm-instrumentation binaryen jsoncpp_static)
target_include_directories(wasm-instrumentation SYSTEM PRIVATE ${CMAKE_CURRENT_LIST_DIR}/thirdparty/binaryen/src ${CMAKE_CURRENT_LIST_DIR}/thirdparty/jsoncpp/include)

if(EMSCRIPTEN)
  target_link_libraries(wasm-instrumentation "-sSINGLE_FILE")
  target_link_libraries(wasm-instrumentation "-sFORCE_FILESYSTEM")
  target_link_libraries(wasm-instrumentation "-sALLOW_MEMORY_GROWTH")

  # target_link_libraries(wasm-instrumentation "-sINITIAL_MEMORY=33554432")
  target_link_libraries(wasm-instrumentation "-sNODERAWFS=1")
  target_link_libraries(wasm-instrumentation "-sENVIRONMENT=node")
  target_link_libraries(wasm-instrumentation "-sSTACK_SIZE=4mb")
  target_link_libraries(wasm-instrumentation "-sMODULARIZE=1")
  target_link_libraries(wasm-instrumentation "-sEXPORT_NAME=initInstrumenter")
  target_link_libraries(wasm-instrumentation "-sEXPORT_ES6=1")
  target_link_libraries(wasm-instrumentation "-sEXPORTED_RUNTIME_METHODS=allocateUTF8")
  target_link_libraries(wasm-instrumentation "-sEXPORTED_FUNCTIONS=_malloc,_free")
else()
endif()

add_executable(wasm-instrumentation main.cpp ${sources})
