function bar(a: i32): i32 {
  if (a > 10) {
    a;
    a = a++ + 10;
    a--;
    return -1;
  } else {
    return 0;
  }
}

function foo(): void {
  let a = 11;
  if (bar(a) < 0) {
    return;
  }
}

export function add(a: i32, b: i32): i32 {
  foo();
  return a + b;
}
/// test

export class Test {
  data: i32 = 2;
  getTwo(): i32 {
    return this.data;
  }
  static getThree(): i32 {
    return 3;
  }
}
