function quick_sort_impl(number: i32[], first: i32, last: i32): void {
  let i: i32;
  let j: i32;
  let pivot: i32;
  let temp: i32;
  if (first < last) {
    pivot = first;
    i = first;
    j = last;
    while (i < j) {
      while (number[i] <= number[pivot] && i < last) i++;
      while (number[j] > number[pivot]) j--;
      if (i < j) {
        temp = number[i];
        number[i] = number[j];
        number[j] = temp;
      }
    }
    temp = number[pivot];
    number[pivot] = number[j];
    number[j] = temp;
    quick_sort_impl(number, first, j - 1);
    quick_sort_impl(number, j + 1, last);
  } else {
    0;
  }
}

export function quick_sort(data: i32[]): void {
  quick_sort_impl(data, 0, data.length - 1);
}
