import { firstHalf, secondHalf } from "./compute-solution";
import {
  computeRucksackPriority,
  intersectListItems,
  occurancesCount,
  priorityDictionary,
  splitIntoCompartments,
} from "./rucksack-regorg";

test("returns compartments of the rucksack", () => {
  expect(splitIntoCompartments("vJrwpWtwJgWrhcsFMMfFFhFp")).toStrictEqual([
    "vJrwpWtwJgWr",
    "hcsFMMfFFhFp",
  ]);
  expect(
    splitIntoCompartments("jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL"),
  ).toStrictEqual(["jqHRNqRjqzjGDLGL", "rsFMfFZSrLrFZsSL"]);
  expect(splitIntoCompartments("PmmdzqPrVvPwwTWBwg")).toStrictEqual([
    "PmmdzqPrV",
    "vPwwTWBwg",
  ]);
});

test("return correct rucksack priority", () => {
  expect(computeRucksackPriority("vJrwpWtwJgWrhcsFMMfFFhFp")).toBe(16);
  expect(computeRucksackPriority("jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL")).toBe(38);
  expect(computeRucksackPriority("PmmdzqPrVvPwwTWBwg")).toBe(42);
  expect(computeRucksackPriority("wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn")).toBe(22);
  expect(computeRucksackPriority("ttgJtRGJQctTZtZT")).toBe(20);
  expect(computeRucksackPriority("CrZsJsPPZsGzwwsLwLmpwMDw")).toBe(19);
});

test("return priority score of a type", () => {
  expect(priorityDictionary["A"]).toBe(27);
  expect(priorityDictionary["a"]).toBe(1);
});

test("returns dictionary of counts by unique elements", () => {
  expect(occurancesCount("aaa".split(""))).toStrictEqual({ a: 3 });
  expect(occurancesCount("aab".split(""))).toStrictEqual({ a: 2, b: 1 });
  expect(occurancesCount("abb".split(""))).toStrictEqual({ a: 1, b: 2 });
  expect(occurancesCount("aba".split(""))).toStrictEqual({ a: 2, b: 1 });
});

test("returns set of items that are common between two lists of strings", () => {
  expect(intersectListItems(["aab".split(""), "bcd".split("")])).toStrictEqual(
    new Set(["b"]),
  );
  expect(intersectListItems(["aabc".split(""), "bcd".split("")])).toStrictEqual(
    new Set(["b", "c"]),
  );
  expect(
    intersectListItems(["aabcdd".split(""), "bcd".split("")]),
  ).toStrictEqual(new Set(["b", "c", "d"]));
  expect(
    intersectListItems(["aabcddz".split(""), "bcdz".split(""), "z".split("")]),
  ).toStrictEqual(new Set(["z"]));
});

test("return total priorty sum for first half", () => {
  const data = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;
  expect(firstHalf(data)).toBe(157);
});

test("return total priorty sum for second half", () => {
  const data = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;
  expect(secondHalf(data)).toBe(70);
});
