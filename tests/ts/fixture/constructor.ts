/**
 * Test for constructor with class members
 * In this case, The line range of the constructor will be 7-11;
 */

class Foo {
  private type: string = "enum";
  public name: string = "default";

  constructor(_name: string) {
    this.name = _name;
  }
}

export const f = new Foo("A struct");