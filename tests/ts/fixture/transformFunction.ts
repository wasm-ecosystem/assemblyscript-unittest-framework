export const timerTimeoutCallback = (_userData: i32): void => {

  const result = subscribe((first, second): i32 => {
    return first + second;

  });

  const a = 1 + result;

}

let a1 = function(): void {}, a = function(): i32 { return 1; };

let a2:() => i32 = () => {return 1};

let a3:() => i32 = () => 1;

@inline
function a4():void {
  function b(): void {

  }
}

declare function a5(): i32;

export function subscribe(cb: (data: i32, userData: i32) => i32, defaultValue: u32 = 0): i32 {
  return cb(100, 200);
}

subscribe((first, second): i32 => 
{
  return second - first;
});


export class Foo {
  private static className: string = "";
  private bar: string = "";
  public name: string = "default";
  public historyIndex: u32 = 0;
  foo(): void {}

  constructor(_name: string) {
    this.name = _name;
  }

  static bar(): void {
    this.className = "AS-FOO";
  }
}