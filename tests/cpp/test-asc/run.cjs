const fs = require('fs');
const sourceMap = require("source-map");

const wasmBuffer = fs.readFileSync('./build/debug.wasm.instrumented.wasm');
const wasmMap = JSON.parse(fs.readFileSync('build/debug.wasm.map'));

promise = new sourceMap.SourceMapConsumer(wasmMap);
promise.then((consumer) => {
  const mock = {
    checkMock(index) {
      if (mock["mockFunctionStatus.has"](index)) {
        return mock["mockFunctionStatus.get"](index);
      }
      return -1;
    },
    "mockFunctionStatus.last": 0,
    "mockFunctionStatus.state": new Map(),
    "mockFunctionStatus.clear": function () {
      mock["mockFunctionStatus.state"].clear();
    },
    "mockFunctionStatus.set": function (k, v) {
      const value = {
        calls: 0,
        ignore: false,
        newIndex: v
      }
      mock["mockFunctionStatus.state"].set(k, value);
    },
    "mockFunctionStatus.get": function (k) {
      const fn = mock["mockFunctionStatus.state"].get(k);
      fn.calls++;
      mock["mockFunctionStatus.last"] = k;
      return fn.newIndex;
    },
    "mockFunctionStatus.lastGet": function () {
      return mock["mockFunctionStatus.last"];
    },
    "mockFunctionStatus.has": function (k) {
      if (mock["mockFunctionStatus.state"].has(k)) {
        const fn = mock["mockFunctionStatus.state"].get(k);
        return !fn.ignore;
      }
      return false;
    },
    "mockFunctionStatus.getCalls": function (k) {
      const fn = mock["mockFunctionStatus.state"].get(k);
      return fn.calls;
    },
    "mockFunctionStatus.setIgnore": function (k, v) {
      const fn = mock["mockFunctionStatus.state"].get(k);
      fn.ignore = v;
    }
  };
  const imports = {
    mock,
    "env": {
      memory: sharedMemory,
      abort(_msg, _file, line, column) {
        console.error("abort called at index.ts:" + line + ":" + column);
      },
      seed: function () {
        return 0xA5534817; // make tests deterministic
      },
      log(ptr) { console.log(getString(ptr)); },
      logi(i) { console.log(i); },
      "Date.now": function () {
        return new Date().getTime();
      },
      trace(msg, n, ...args) {
        const memory = sharedMemory;
        console.log(`trace: ${getString(msg)}${n ? " " : ""}${args.slice(0, n).join(", ")}`);
      },
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
      }
    }
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

  WebAssembly.instantiate(wasmBuffer, imports).then(wasmModule => {
    wasmExample = wasmModule;
    const { memory, add } = wasmModule.instance.exports;
    sharedMemory = memory;
    add();
    console.log("finished");
  });

});


