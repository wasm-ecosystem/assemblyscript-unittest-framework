import { describe, test, expect, endTest } from "../../assembly";
import { emptyFunction } from "../../assembly/default";

// Default Stub Injection Tests
// Making sure that external functions can supplied with an empty default function so that users will be free of supplying their own

@external("myenv", "processEvent")
declare function processEvent(eventId: i32): void;

@external("externalMath", "add")
declare function add(a: i32, b: i32): i32;

@external("system", "getStatus")
declare function getStatus(): i32;

@external("logger", "logWarning")
declare function logWarning(messageId: i32): i32;

@external("customOps", "combineValues")
declare function combineValues(a: i32, b: f32, c: i64): i32;

describe("Default Stub Injection Tests", () => {
    test("Test processEvent (i32) -> void", () => {
        processEvent(101);
    });

    test("Test add (i32, i32) -> i32", () => {
        const result = add(10, 5);
        expect(result).equal(0);
    });

    test("Test getStatus () -> i32", () => {
        const result = getStatus();
        expect(result).equal(0);
    });

    test("Test logWarning (i32) -> i32", () => {
        const result = logWarning(12345);
        expect(result).equal(0);
    });

    test("Test combineValues (i32, f32, i64) -> i32", () => {
        const result = combineValues(1, 2.5, 1000);
        expect(result).equal(0);
    });
});

endTest();