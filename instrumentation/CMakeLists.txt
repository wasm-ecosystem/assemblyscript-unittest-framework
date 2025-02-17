aux_source_directory(${CMAKE_CURRENT_SOURCE_DIR} sources)

if(EMSCRIPTEN)
  add_executable(wasm-instrumentation ${sources})

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
  add_library(wasm-instrumentation ${sources})
endif()

target_link_libraries(wasm-instrumentation PUBLIC binaryen jsoncpp_static)
target_include_directories(wasm-instrumentation SYSTEM PUBLIC ${PROJECT_SOURCE_DIR}/third_party/binaryen/src ${PROJECT_SOURCE_DIR}/third_party/jsoncpp/include)
