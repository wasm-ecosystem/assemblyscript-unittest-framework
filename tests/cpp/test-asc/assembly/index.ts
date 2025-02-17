class A{
  a:i32
}
export function add(a:i32): i32 {
  let aInstance = new A();
  aInstance.a = 42;
  return aInstance.a;
}
