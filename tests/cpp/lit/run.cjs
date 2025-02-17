const fs = require("fs");
const wasmBuffer = fs.readFileSync(process.argv[2]);
const mockInstruFunc = {
  // isCall = true,  return -1 if not mocked;
  // isCall = false, return oldIndex if not mocked.
  checkMock(index, isCall) {
    if (mockInstruFunc["mockFunctionStatus.has"](index)) {
      return mockInstruFunc["mockFunctionStatus.get"](index);
    }
    return isCall ? -1 : index;
  },
  "mockFunctionStatus.last": 0,
  "mockFunctionStatus.state": new Map(),
  "mockFunctionStatus.clear": function () {
    mockInstruFunc["mockFunctionStatus.state"].clear();
  },
  "mockFunctionStatus.set": function (k, v) {
    const value = {
      calls: 0,
      ignore: false,
      newIndex: v,
    };
    mockInstruFunc["mockFunctionStatus.state"].set(k, value);
  },
  "mockFunctionStatus.get": function (k) {
    const fn = mockInstruFunc["mockFunctionStatus.state"].get(k);
    assert(fn);
    fn.calls++;
    mockInstruFunc["mockFunctionStatus.last"] = k;
    return fn.newIndex;
  },
  "mockFunctionStatus.lastGet": function () {
    return mockInstruFunc["mockFunctionStatus.last"];
  },
  "mockFunctionStatus.has": function (k) {
    const fn = mockInstruFunc["mockFunctionStatus.state"].get(k);
    if (fn === undefined) {
      return false;
    }
    return !fn.ignore;
  },
  "mockFunctionStatus.getCalls": function (oldIndex, newIndex) {
    const fn = mockInstruFunc["mockFunctionStatus.state"].get(oldIndex);
    if (fn === undefined || fn.newIndex !== newIndex) {
      return 0;
    }
    return fn.calls;
  },
  "mockFunctionStatus.setIgnore": function (k, v) {
    const fn = mockInstruFunc["mockFunctionStatus.state"].get(k);
    if (fn === undefined) {
      return;
    }
    fn.ignore = v;
  },
};
const imports = {
  mockInstrument: mockInstruFunc,
  covInstrument: {
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
