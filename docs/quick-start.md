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
import { test, expect } from "assemblyscript-unittest-framework/assembly";
import { add } from "../source/sum";

test("sum", () => {
  expect(add(1, 2)).equal(3);
  expect(add(1, 1)).equal(3);
});
```

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
> as-test@1.0.0 test
> as-test

(node:144985) ExperimentalWarning: WASI is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
code analysis: OK
compile testcases: OK
instrument: OK
execute testcases: OK

test case: 1/2 (success/total)

Error Message: 
  sum: 
    tests/sum.test.ts:6:2  value: 2  expect: = 3
---------|---------|----------|---------|--------
File     | % Stmts | % Branch | % Funcs | % Lines
---------|---------|----------|---------|--------
source   | 100     | 100      | 100     | 100    
  sum.ts | 100     | 100      | 100     | 100    
---------|---------|----------|---------|--------

Test Failed
```

You can also use `npx as-test -h` for more information to control detail configurations
