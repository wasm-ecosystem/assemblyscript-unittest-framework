# Assemblyscript Unittest Framework

<div style="text-align: center;">
  <a href="https://deepwiki.com/wasm-ecosystem/assemblyscript-unittest-framework">
    <img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki" />
  </a>
  <a href="https://www.npmjs.com/package/assemblyscript-unittest-framework">
    <img src="https://img.shields.io/npm/v/assemblyscript-unittest-framework.svg?color=007acc&logo=npm" alt="npm" />
  </a>
  <a href="https://discord.gg/assemblyscript">
    <img
      src="https://img.shields.io/discord/721472913886281818.svg?label=discord&logo=discord&logoColor=ffffff&color=7389D8"
      alt="Discord online"
    />
  </a>
</div>

A comprehensive AssemblyScript testing solution, offering developers a robust suite of features to ensure their code performs as expected:

- Function Mocking
- Coverage statistics
- Expectations

## Getting Started

Install Assemblyscript Unittest Framework using npm

```bash
npm install --save-dev assemblyscript-unittest-framework
```

Let's get started by writing a test for a simple function that add two numbers. Assume that there is already environment of assemblyscript.

First, create `source/sum.ts`:

```Typescript
export function add(a: i32, b: i32): i32 {
  return a + b;
}
```

Then, create a file named `tests/sum.test.ts`. This will contain our actual test:

```Typescript
import { test, expect, endTest } from "assemblyscript-unittest-framework/assembly";
import { add } from "../source/sum";

test("sum", () => {
  expect(add(1, 2)).equal(3);
  expect(add(1, 1)).equal(3);
});
endTest();  // Don't forget it!
```

**Don't forget `endTest()` at the end of `*.test.ts` files**

Create a config file in project root `as-test.config.js`:

for cjs:

```javascript
module.exports = {
  include: ["source", "tests"],
};
```

for mjs:

```javascript
export default {
  include: ["source", "tests"],
};
```

Add the following section to your `package.json`

```json
{
  "scripts": {
    "test": "as-test"
  }
}
```

Finally, run `npm run test` and as-test will print this message:

```
transform source/sum.ts => build/source/sum.ts.cov
transform build/source/sum.ts.cov => build/source/sum.ts
transform tests/sum.test.ts => build/tests/sum.test.ts
(node:489815) ExperimentalWarning: WASI is an experimental feature. This feature could change at any time

test case: 1/2 (success/total)

Error Message:
        sum:
                tests/sum.test.ts:6:3 (6:3, 6:29)
```

You can also use `npx as-test -h` for more information to control detail configurations

## Configuration

This is the template of `as-test.config.js`:

```javascript
module.exports = {
  // test related code folder
  include: ["source", "tests"],
  exclude: [],

  /** optional: assemblyscript compile flag, default is --exportStart _start -O0 */
  flags: "",

  /**
   * optional: import functions
   * @param {ImportsArgument} runtime
   * @returns
   */
  imports(runtime) {
    return {
      env: {
        logInfo(ptr, len) {
          if (runtime.exports) {
            let arrbuf = runtime.exports.__getArrayBuffer(ptr);
            let str = Buffer.from(arrbuf).toString("utf8");
            console.log(str);
          }
        },
      },
      builtin: {
        getU8FromLinkedMemory(a) {
          return 1;
        },
      },
    };
  },

  /**  optional: template file path, default "coverage" */
  // temp: "coverage",

  /**  optional: report file path, default "coverage" */
  // output: "coverage",

  /** optional: test result output format, default "table" */
  // mode: ["html", "json", "table"],
};

```

## Using Matchers

The simplest way to test a value is with exact equality.

```typescript
test('two plus two is four', () => {
  expect(2 + 2).equal(4);
});
```

In this code, `expect(2+2)` returns an "Value" object. You typically won't do much with these objects except call matchers on them. In this code, `.equal(4)` is the matcher. When Jest runs, it tracks all the failing matchers so that it can print out nice error messages for you.

### Equal

In the most condition, `equal` is similar as `==`, you can use this matcher to compare `i32 | i64 | u32 | u64 | f32 | f64 | string` just like `==`. What's more, it can also be used to compare some inner type, such as `Array | Map | Set`.

However, **Class** and **Interface** cannot be compared directly now.

`notEqual` is the opposite of `equal`

### Numbers

Most ways of comparing numbers have matcher equivalents, like `equal`, `greaterThan`, `greaterThanOrEqual`, `lessThan`, `lessThanOrEqual`.

Specially, for float type, use `closeTo` instead of `equal` to avoid rounding error.

## Nullable

`isNull` and `notNull` matcher can be used to a nullable object.
Of cource, you can also use `equal` and `notEqual` to do same thing with explicit generic declartion `expect<T | null>()`

## Using Mock Function

Because Assemblyscript's grammar is not as flexible as javascript, mock function have a lot of limitation and API design is not similar as jest (a javascript test framework).

However, There is a way to do some mock function.

Imagine that we are testing a function which includes a system-interface:

```typescript
// source.ts
declare function sys_getTime(): i32;
export function getTime(): bool {
  let errno = sys_getTime();
  if (errno < 0) {
    // error handle
    return false;
  }
  // do something
  return true;
}
```

To test error handle part, we need to inject some code to `sys_getTime` and expect to return a errno.

```typescript
// source.test.ts
test("getTime error handle", () => {
  const fn = mock(sys_getTime, () => {
    return -1;
  });
  expect(getTime()).equal(false); // success
  expect(fn.calls).equal(1);      // success
});
endTest();
```

mock API can temporary change the behavior of function, effective scope is each test.
In this mock function, you can do every thing include expecting arguments, mock return values and so on.

Tips:

- Because Assemblyscript is a strongly typed language, you should keep the function signature aligned.
- AssemblyScript does not support closures. If a mock function needs to be called several times in one test, and you want it to return different values or match arguments to different values, using a global counter for this function is a good way to achieve this.

### Example for MockFn

1. expect arguments

   ```typescript
   test("check argument", () => {
     const fn = mock(add, (a: i32, b: i32) => {
       expect(a).equal(1);
       return a + b;
     });
     expect(fn.calls).greaterThanOrEqual(1);
   });
   ```

2. return difference value

   ```typescript
   const ret = [1,2,3,4,5,6,7,8];  // global variant
   const calls = 0;                // global variant
   test("check argument", () => {
     const fn = mock(add, (a: i32, b: i32) => {
       return ret[calls++];
     });
     expect(fn.calls).greaterThanOrEqual(1);
   });
   ```

3. re-call origin

   ```typescript
   test("call origin", () => {
     mock(add, (a: i32, b: i32) => {
       unmock(add);
       const res = add(a,b);
       remock(add);
       return res;
     });
   });
   ```

## Coverage Report

After testing, you can get a html / json / table format test coverage report include "Statements Coverage", "Branches Coverage", "Functions Coverage", "Lines Coverage"

## Architecture

- `assembly/` written in Assemblyscript, provides user-accessible testing APIs such as test, inspect, mock, etc.
- `src/` written in Typescript, implements the test functionality.
