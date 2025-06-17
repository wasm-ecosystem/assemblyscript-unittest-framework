# Getting Started

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
