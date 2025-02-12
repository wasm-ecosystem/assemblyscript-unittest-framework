import { describe, endTest, expect, test } from "../assembly";
import { mycmp, instancecmp } from "../assembly/diytest"

describe("cmp test", () => {
    // 要考虑到流图可能不同，导致总branch数可能不同，所以计算branch覆盖率只能进行加权平均
    test("a>b", () => {
        let a: i32 = 1;
        let b: i32 = 0;
        expect(mycmp(a, b)).equal(true);
    });
    test("a<b", () => {
        let a: f32 = 0;
        let b: f32 = 0.5;
        expect(mycmp(a, b)).equal(false);
    });
});

describe("instance test", () => {
    test("a>b", () => {
        let a: i32 = 1;
        let b: i32 = 0;
        expect(instancecmp(a, b)).equal(true);
    });
    test("a<b", () => {
        let a: f32 = 0;
        let b: f32 = 0.5;
        expect(instancecmp(a, b)).equal(false);
    });
});

endTest();
