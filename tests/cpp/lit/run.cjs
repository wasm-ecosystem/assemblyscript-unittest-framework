const fs = require("fs");
const wasmBuffer = fs.readFileSync(process.argv[2]);
const mockInstruFunc = {
  _mockStatus: new Map(),

  hasMocked(functionIndex) {
    const mockObject = this._mockStatus.get(functionIndex);
    if (mockObject === undefined) {
      return false;
    }
    return !mockObject.ignore;
  },

  // isCall = true,  return -1 if not mocked;
  // isCall = false, return oldIndex if not mocked.
  checkMock(functionIndex, isCall) {
    if (this.hasMocked(functionIndex)) {
      const mockObject = this._mockStatus.get(functionIndex);
      mockObject.calls++;
      return mockObject.mockFunctionIndex;
    }
    return isCall ? -1 : functionIndex;
  },

  setMockFunction(originalFunctionIndex, mockFunctionIndex) {
    const mockObject = {
      calls: 0,
      ignore: false,
      mockFunctionIndex,
    }
    this._mockStatus.set(originalFunctionIndex, mockObject);
  },

  getMockedFunctionCalls(originalFunctionIndex, mockFunctionIndex) {
    const mockObject = this._mockStatus.get(originalFunctionIndex);
    if (mockObject === undefined || mockObject.mockFunctionIndex !== mockFunctionIndex) {
      return 0;
    }
    return mockObject.calls;
  },

  setMockedFunctionIgnore(originalFunctionIndex, ignore) {
    const mockObject = this._mockStatus.get(originalFunctionIndex);
    if (mockObject === undefined) {
      return;
    }
    mockObject.ignore = ignore;
  },

  clear() {
    this._mockStatus.clear();
  }
};
const imports = {
  __unittest_framework_env: {
    ...mockInstruFunc,
    traceExpression(functionIndex, index, type) {
      // console.log(consumer);
      switch (type) {
        case 1: // call in
          console.log(`make directly call to function index=${functionIndex}`);
          break;
        case 2: // call out
          console.log(`exit from function call index=${functionIndex}`);
          break;
        default:
          console.log(`basic block entry trace to: function=${functionIndex}, basic block=${index}`);
          break;
      }
    },
  },
  env: {
    memory: sharedMemory,
    abort(_msg, _file, line, column) {
      console.error("abort called at index.ts:" + line + ":" + column);
    },
    seed: function () {
      return 0xa5534817; // make tests deterministic
    },
    log(ptr) {
      console.log(getString(ptr));
    },
    logi(i) {
      console.log(i);
    },
    "Date.now": function () {
      return new Date().getTime();
    },
    trace(msg, n, ...args) {
      const memory = sharedMemory;
      console.log(`trace: ${getString(msg)}${n ? " " : ""}${args.slice(0, n).join(", ")}`);
    },
  },
};
function getString(ptr) {
  if (!ptr) return "null";
  var U32 = new Uint32Array(sharedMemory.buffer);
  var U16 = new Uint16Array(sharedMemory.buffer);
  var length = U32[(ptr - 4) >>> 2] >>> 1;
  var offset = ptr >>> 1;
  return String.fromCharCode.apply(String, U16.subarray(offset, offset + length));
}

var sharedMemory = new WebAssembly.Memory({ initial: 1 });

WebAssembly.instantiate(wasmBuffer, imports).then((wasmModule) => {
  wasmExample = wasmModule;
  const { main, memory } = wasmModule.instance.exports;
  sharedMemory = memory;
  main();
});
