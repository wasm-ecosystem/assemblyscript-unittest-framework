#include "BasicBlockWalker.hpp"
#include <cfg/cfg-traversal.h>
#include "ir/branch-utils.h"

namespace wasmInstrumentation {

void BasicBlockWalker::basicBlockWalk() noexcept {
  // Iterate DefinedFunctions, generate coverage infos
  wasm::ModuleUtils::iterDefinedFunctions(*module, [this](wasm::Function *const func) noexcept {
    if ((!func->debugLocations.empty()) && basicBlockAnalysis.shouldIncludeFile(func->name.str)) {
      walkFunctionInModule(func, module);
    }
  });
}

void BasicBlockWalker::visitExpression(wasm::Expression *curr) noexcept {
  if (currBasicBlock == nullptr) {
    return;
  }
  // push information
  wasm::Function *const currFun = getFunction();
  currBasicBlock->contents.exprs.push_back(curr);
  const auto debugLocationIterator = currFun->debugLocations.find(curr);
  if (debugLocationIterator != currFun->debugLocations.cend()) {
    const auto &debugLocation = debugLocationIterator->second;
    currBasicBlock->contents.debugLocations.insert(debugLocation);
  }
}

void BasicBlockWalker::unlinkEmptyBlock() noexcept {
  const auto lambda = [](std::unique_ptr<BasicBlock> &block) {
    if (block->contents.exprs.empty() && block->out.size() == 1) {
      const auto outBlock = block->out[0];
      outBlock->in.erase(std::find(outBlock->in.begin(), outBlock->in.end(), block.get()));
      for (auto &inBlock : block->in) {
        inBlock->out.erase(std::find(inBlock->out.begin(), inBlock->out.end(), block.get()));
        inBlock->out.push_back(outBlock);
        outBlock->in.push_back(inBlock);
      }
      block->in.clear();
      block->out.clear();
      return true;
    }
    return false;
  };
  basicBlocks.erase(std::remove_if(basicBlocks.begin(), basicBlocks.end(), lambda),
                    basicBlocks.end());
}

void BasicBlockWalker::doWalkFunction(wasm::Function *const func) noexcept {
  wasm::CFGWalker<BasicBlockWalker, wasm::UnifiedExpressionVisitor<BasicBlockWalker>,
                  BasicBlockInfo>::doWalkFunction(func);
  unlinkEmptyBlock();
  // LCOV_EXCL_START
  if (basicBlocks.size() > UINT32_MAX) {
    std::cerr << "Error: BasicBlocks length exceeds UINT32_MAX\n";
    ::exit(EXIT_FAILURE);
  }
  // LCOV_EXCL_STOP
  for (size_t i = 0; i < basicBlocks.size(); i++) {
    basicBlocks[i]->contents.basicBlockIndex = static_cast<wasm::Index>(i);
  }

  FunctionAnalysisResult analysisResult;
  analysisResult.functionIndex = functionIndex;
  functionIndex++;
  for (const auto &basicBlock : basicBlocks) {
    const wasm::Index currBasicBlockIndex = basicBlock->contents.basicBlockIndex;
    // Generate Branch coverage info
    if (basicBlock->out.size() > 1U) {
      for (const auto &out : basicBlock->out) {
        analysisResult.branchInfo.emplace_back(currBasicBlockIndex, out->contents.basicBlockIndex);
      }
    }
    // Generate Line coverage info
    analysisResult.basicBlocks.push_back(basicBlock->contents);

    // Generate CovInstrument position
    if (exit != nullptr && currBasicBlockIndex == exit->contents.basicBlockIndex) {
      // For exit basicBlock, we instrument at the end of function
      setCovInstrumentPosition(func->body, {currBasicBlockIndex, false});
      continue;
    }
    wasm::Expression *expr = nullptr;
    bool pre = false;
    if (basicBlock->contents.exprs.empty()) {
      for (const auto &inBlock : basicBlock->in) {
        assert(!inBlock->contents.exprs.empty());
        setCovInstrumentPosition(inBlock->contents.exprs.back(), {currBasicBlockIndex, false});
      }
    } else {
      wasm::Expression *const lastExpression = basicBlock->contents.exprs.back();
      if (lastExpression->is<wasm::Return>() || lastExpression->is<wasm::Break>() ||
          lastExpression->is<wasm::Switch>()) {
        if (basicBlock->contents.exprs.size() == 1U) {
          expr = lastExpression;
          pre = true;
        } else {
          expr = basicBlock->contents.exprs[basicBlock->contents.exprs.size() - 2];
        }
      } else if (lastExpression->is<wasm::Block>() && basicBlock->contents.exprs.size() > 1U) {
        // Special treatment for for-loop-continue case.
        expr = basicBlock->contents.exprs[basicBlock->contents.exprs.size() - 2];
      } else {
        expr = lastExpression;
      }

      setCovInstrumentPosition(expr, {currBasicBlockIndex, pre});
    }
  }
  this->results[func->name.str] = std::move(analysisResult);
}

wasm::Index
BasicBlockWalker::getFunctionIndexByName(const std::string_view &funcName) const noexcept {
  const auto functionResultIterator = results.find(funcName);
  if (functionResultIterator != results.cend()) {
    return functionResultIterator->second.functionIndex;
  }
  return static_cast<wasm::Index>(-1);
}

void BasicBlockWalker::setCovInstrumentPosition(wasm::Expression *const expr,
                                                const InstrumentPosition &position) noexcept {
  auto positions = covInstrumentPosition.find(expr);
  if (positions != covInstrumentPosition.end()) {
    positions->second.emplace_back(position);
  } else {
    covInstrumentPosition.emplace(expr, std::vector<InstrumentPosition>{position});
  }
}

const std::vector<InstrumentPosition> *
BasicBlockWalker::getCovInstrumentPosition(wasm::Expression *const expr) const noexcept {
  const auto iterator = covInstrumentPosition.find(expr);
  if (iterator != covInstrumentPosition.cend()) {
    return &(iterator->second);
  }
  return nullptr;
}

BasicBlockAnalysis BasicBlockWalker::getBasicBlockAnalysis() const noexcept {
  return basicBlockAnalysis;
}

} // namespace wasmInstrumentation
