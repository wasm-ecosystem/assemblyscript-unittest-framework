## Using Matchers

The simplest way to test a value is with exact equality.

```typescript
test('two plus two is four', () => {
  expect(2 + 2).equal(4);
});
```

In this code, `expect(2+2)` returns an "Value" object. You typically won't do much with these objects except call matchers on them. In this code, `.equal(4)` is the matcher. When Jest runs, it tracks all the failing matchers so that it can print out nice error messages for you.

### Not

`not` matcher can reverse the matching results of all subsequent `matcher` statements.

```ts
expect(1).not.equal(2); // success
expect(1).not.equal(1); // fail
```

### Equal

In the most condition, `equal` is similar as `==`, you can use this matcher to compare `i32 | i64 | u32 | u64 | f32 | f64 | string` just like `==`. What's more, it can also be used to compare some inner type, such as `Array | Map | Set`.

However, **Class** and **Interface** cannot be compared directly now.

`notEqual` is the opposite of `equal`

### Numbers

Most ways of comparing numbers have matcher equivalents, like `equal`, `greaterThan`, `greaterThanOrEqual`, `lessThan`, `lessThanOrEqual`.

Specially, for float type, use `closeTo` instead of `equal` to avoid rounding error.

### Nullable

`isNull` and `notNull` matchers can be used to a nullable object.
Of course, you can also use `equal` and `notEqual` to do same thing with explicit generic declaration `expect<T | null>()`

### Typing

`isa` and `isExactly` matchers can be used to compare typing.

In Assemblyscript, a variable has 2 kinds of types: the defined type and the runtime type. For example, when `Ext` extends `Base`, a variable declared as type `Base` may actually be of type `Ext` at runtime.

- `isa` will check whether runtime type of given value is instance of expected type. In previous example, the runtime type of variable is instance of both `Base` and `Ext`.
- `isExactly` will check whether runtime type of give value is exactly same as expected type. In previous example, the runtime type of variable is exactly `Ext` but not `Base`.
