## Setup And Teardown

Often while writing tests you have some setup work that needs to happen before tests run, and you have some finishing work that needs to happen after tests run. unittest framework provides helper functions to handle this.

If you have some work you need to do repeatedly for many tests, you can use `beforeEach` and `afterEach` hooks.

::: info
`beforeEach` and `afterEach` can only work inside describe which will limit its scope
:::

### How to Use

```ts
let setup = 0;
describe("setup", () => {
  // effect for the whole describe including sub-describe
  beforeEach(() => {
    setup = 10;
  });
  test("1st", () => {
    expect(setup).equal(10);
    setup = 100;
  });
  test("2nd", () => {
    expect(setup).equal(10);
    setup = 100;
  });
  test("3nd", () => {
    expect(setup).equal(10);
  });
});
```

:::info
If multiple `beforeEach` or `afterEach` is registered, they will be call in order.
:::
