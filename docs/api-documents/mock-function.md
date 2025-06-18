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
