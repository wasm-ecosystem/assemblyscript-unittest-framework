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
