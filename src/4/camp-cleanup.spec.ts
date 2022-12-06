import {
  getFullyContainedPair,
  getAnyOverlapPair,
  parseAssignmentPairString,
} from "./camp-cleanup";
import { firstHalf, secondHalf } from "./compute-solution";

test("extract pairs from a single line", () => {
  expect(parseAssignmentPairString("2-4,6-8")).toStrictEqual([
    [2, 4],
    [6, 8],
  ]);
  expect(parseAssignmentPairString("2-3,4-5")).toStrictEqual([
    [2, 3],
    [4, 5],
  ]);
  expect(parseAssignmentPairString("5-7,7-9")).toStrictEqual([
    [5, 7],
    [7, 9],
  ]);
});

test("if a one of the assignments overlap the other in a given pair", () => {
  expect(getFullyContainedPair([5, 7], [7, 9])).toBe(null);
  expect(getFullyContainedPair([2, 8], [3, 7])).toBe(1);
  expect(getFullyContainedPair([3, 7], [2, 8])).toBe(0);
  expect(getFullyContainedPair([6, 6], [4, 6])).toBe(0);
});

test("if a one of the assignments overlap the other in a given pair", () => {
  expect(getAnyOverlapPair([5, 7], [7, 9])).toBe(0);
  expect(getAnyOverlapPair([2, 8], [3, 7])).toBe(1);
  expect(getAnyOverlapPair([6, 6], [4, 6])).toBe(0);
  expect(getAnyOverlapPair([2, 6], [4, 8])).toBe(0);
});

test("get first half result", () => {
  const data = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;
  expect(firstHalf(data)).toBe(2);
  firstHalf();
});

test("get second half result", () => {
  const data = `5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;
  expect(secondHalf(data)).toBe(4);
  secondHalf();
});
