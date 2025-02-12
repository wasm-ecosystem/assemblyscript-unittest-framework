export function mycmp<T>(a: T, b: T): bool {
    if (a > b) {
        return true;
    } else {
        return false;
    }
}

export function instancecmp<T>(a: T, b: T): bool {
    if (isInteger<T>()) {
        if (a > b) {
            return true;
        } else {
            return false;
        }
    } else if (isFloat<T>()) {
        if (a > b) {
            return true;
        } else {
            return false;
        }
    }
    return false;
}
