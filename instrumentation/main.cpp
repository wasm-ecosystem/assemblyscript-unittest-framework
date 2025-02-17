#include <cstring>
#include <iostream>
#include "CoverageInstru.hpp"

int main(int argc, char **argv) {
  wasmInstrumentation::InstrumentationConfig config;
  if (argc != 13) {
    // print help documentation
    std::cout << "wasm-instrumentation is a tool that instrument wasm binary "
                 "for code covareage report \n";
    std::cout << "-----------------------------\n";
    std::cout << "-i    input wasm file\n";
    std::cout << "-o    output file\n";
    std::cout << "-r    report function name\n";
    std::cout << "-d    debugInfo output file\n";
    std::cout << "-m    source map file\n";
    std::cout << "-e    expect codeInfo output file\n";
    std::cout << "-----------------------------\n";
    return 0;
  }
  for (int i = 1; i < argc; i = i + 2) {
    if (strcmp(argv[i], "-i") == 0) {
      config.fileName = argv[i + 1];
    }
    if (strcmp(argv[i], "-o") == 0) {
      config.targetName = argv[i + 1];
    }
    if (strcmp(argv[i], "-d") == 0) {
      config.debugInfoOutputFilePath = argv[i + 1];
    }
    if (strcmp(argv[i], "-r") == 0) {
      config.reportFunction = argv[i + 1];
    }
    if (strcmp(argv[i], "-m") == 0) {
      config.sourceMap = argv[i + 1];
    }
    if (strcmp(argv[i], "-e") == 0) {
      config.expectInfoOutputFilePath = argv[i + 1];
    }
  }
  wasmInstrumentation::CoverageInstru instrumenter(&config);
  instrumenter.instrument();
}
