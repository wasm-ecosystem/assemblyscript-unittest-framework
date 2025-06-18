## Mock Method

Since AS doesn't fully support `this` as parameter in function type.
We can cast the method to a normal function type and mock it.

```typescript
type Fn = (self: MockClass) => i32;
test("class method mock", () => {
  const mockClass = new MockClass();
  mock<Fn>(changetype<Fn>(mockClass.method), (self: MockClass): i32 => {
    self.v = 100;
    return 1;
  });
  expect(mockClass.method()).equal(1);
  expect(mockClass.v).equal(100);
});
```
