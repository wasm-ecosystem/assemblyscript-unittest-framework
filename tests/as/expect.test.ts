import { describe, expect, test } from "../../assembly";

class Base {}
class Ext_0 extends Base {}
class Ext_0_0 extends Ext_0 {}
class Ext_1 extends Base {}
class Ext_1_1 extends Ext_1 {}

describe("expect", () => {
  test("< = >", () => {
    expect(1).greaterThan(0);
    expect(1).greaterThanOrEqual(0);
    expect(1).greaterThanOrEqual(1);
    expect(1).lessThan(2);
    expect(1).lessThanOrEqual(2);
    expect(1).lessThanOrEqual(1);
  });
  test("null", () => {
    expect<string | null>(null).isNull();
    expect<string | null>("test").notNull();
  });
  test("isa", () => {
    let ext: Base = new Ext_0_0();
    expect(ext).isa<Base>();
    expect(ext).isa<Ext_0>();
    expect(ext).isa<Ext_0_0>();
    expect(ext).isExactly<Ext_0_0>();
  });
});
