import { equal, isNull } from "./comparison";
import { assertResult } from "./env";
import { toJson } from "./formatPrint";


@inline
const EXPECT_MAX_INDEX = 2147483647;

export class Value<T> {
  data: T;
  constructor(_data: T) {
    this.data = _data;
  }
  isNull(codeInfoIndex: u32 = EXPECT_MAX_INDEX): Value<T> {
    assertResult.collectCheckResult(
      isNull<T>(this.data),
      codeInfoIndex,
      toJson(this.data),
      "to be null",
    );
    return this;
  }
  notNull(codeInfoIndex: u32 = EXPECT_MAX_INDEX): Value<T> {
    assertResult.collectCheckResult(
      !isNull<T>(this.data),
      codeInfoIndex,
      toJson(this.data),
      "notNull",
    );
    return this;
  }

  equal(checkValue: T, codeInfoIndex: u32 = EXPECT_MAX_INDEX): Value<T> {
    assertResult.collectCheckResult(
      equal<T>(this.data, checkValue),
      codeInfoIndex,
      toJson(this.data),
      "= " + toJson(checkValue),
    );
    return this;
  }
  notEqual(checkValue: T, codeInfoIndex: u32 = EXPECT_MAX_INDEX): Value<T> {
    assertResult.collectCheckResult(
      !equal<T>(this.data, checkValue),
      codeInfoIndex,
      toJson(this.data),
      " != " + toJson(checkValue),
    );
    return this;
  }

  greaterThan(checkValue: T, codeInfoIndex: u32 = EXPECT_MAX_INDEX): Value<T> {
    assertResult.collectCheckResult(
      this.data > checkValue,
      codeInfoIndex,
      toJson(this.data),
      " > " + toJson(checkValue),
    );
    return this;
  }
  greaterThanOrEqual(
    checkValue: T,
    codeInfoIndex: u32 = EXPECT_MAX_INDEX,
  ): Value<T> {
    assertResult.collectCheckResult(
      this.data >= checkValue,
      codeInfoIndex,
      toJson(this.data),
      " >= " + toJson(checkValue),
    );
    return this;
  }
  lessThan(checkValue: T, codeInfoIndex: u32 = EXPECT_MAX_INDEX): Value<T> {
    assertResult.collectCheckResult(
      this.data < checkValue,
      codeInfoIndex,
      toJson(this.data),
      " < " + toJson(checkValue),
    );
    return this;
  }
  lessThanOrEqual(
    checkValue: T,
    codeInfoIndex: u32 = EXPECT_MAX_INDEX,
  ): Value<T> {
    assertResult.collectCheckResult(
      this.data <= checkValue,
      codeInfoIndex,
      toJson(this.data),
      " <= " + toJson(checkValue),
    );
    return this;
  }

  closeTo(
    checkValue: T,
    delta: number,
    codeInfoIndex: u32 = EXPECT_MAX_INDEX,
  ): Value<T> {
    const data = this.data;
    if (isFloat<T>(checkValue) && isFloat<T>(data)) {
      assertResult.collectCheckResult(
        abs(data - checkValue) < delta,
        codeInfoIndex,
        toJson(this.data),
        " closeTo " + toJson(checkValue),
      );
    } else {
      ERROR("closeTo should only be used in f32 | f64");
    }
    return this;
  }
}
