import {
  firstHalf,
  lowestCommonMultiple,
  parseInput,
  parseMonkeyIDString,
  parseMonkeyString,
  parseOperationString,
  parseStartItemsString,
  parseTestString,
  parseThrowConditionString,
  relief,
  secondHalf,
  smallestCommonMultiple,
} from "./monkey";

const dataA = `Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0`;

const dataB = `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3`;

const dataC = `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0`;

const dataD = `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`;

const dataE = `Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`;

const dataFullMock = `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`;

test("firstHalf should return the level of money business after 20 rounds", () => {
  expect(firstHalf(dataFullMock)).toBe(BigInt(10605));
  console.log("first half real data result:", firstHalf());
});

test("secondHalf should return the level of money business after 10_000 rounds", () => {
  expect(secondHalf(dataFullMock)).toBe(BigInt(2713310158));
  console.log("second half real data result:", secondHalf());
});

test("smallestCommonMultiple return the smallest number possible given the divisor", () => {
  expect(smallestCommonMultiple(BigInt(10), BigInt(2))).toBe(BigInt(5));
  expect(smallestCommonMultiple(BigInt(100), BigInt(10))).toBe(BigInt(1));
});

test("lowestCommonMultiple returns the lowest common multiple across an array of numbers", () => {
  expect(lowestCommonMultiple([BigInt(2), BigInt(3)])).toBe(BigInt(6));
  expect(lowestCommonMultiple([BigInt(5), BigInt(100)])).toBe(BigInt(100));
  expect(
    lowestCommonMultiple([BigInt(1), BigInt(2), BigInt(3), BigInt(8)]),
  ).toBe(BigInt(24));
});

test("monkey object correctly manages its state as inspect and catch class methods are instantiated", () => {
  const monkeyRecord = parseInput(dataD);

  const monkey0 = monkeyRecord[0];
  const thrownItems0 = monkey0.inspect(BigInt(3));
  expect(thrownItems0).toStrictEqual({ 3: [500, 620].map((n) => BigInt(n)) });

  const monkey1 = monkeyRecord[1];
  const thrownItems1 = monkey1.inspect(BigInt(3));
  expect(thrownItems1).toStrictEqual({
    0: [20, 23, 27, 26].map((n) => BigInt(n)),
  });

  const monkey2 = monkeyRecord[2];
  const thrownItems2 = monkey2.inspect(BigInt(3));
  expect(thrownItems2).toStrictEqual({
    1: [2080].map((n) => BigInt(n)),
    3: [1200, 3136].map((n) => BigInt(n)),
  });

  const monkey3 = monkeyRecord[3];
  const thrownItems3 = monkey3.inspect(BigInt(3));
  expect(thrownItems3).toStrictEqual({ 1: [25].map((n) => BigInt(n)) });
});

test("relief take take a worryLevel and return an integer with a relieved worry level", () => {
  expect(relief(3, 1501)).toBe(500);
  expect(relief(3, 1862)).toBe(620);
  expect(relief(3, 60)).toBe(20);
  expect(relief(3, 71)).toBe(23);
  expect(relief(3, 81)).toBe(27);
});

test("parseInput can take a serialised string of multiple Monkey initial states and return a record of Monkey Objects", () => {
  const monkeyRecord = parseInput(dataC);
  const monkeyA = monkeyRecord[1];
  expect(monkeyA.id).toBe(1);
  expect(monkeyA.test(BigInt(19 * 2))).toBe(true);

  const monkeyB = monkeyRecord[0];
  expect(monkeyB.id).toBe(0);
  expect(monkeyB.test(BigInt(23 * 2))).toBe(true);
});

test("parseMonkeyString can return a monkey object given a serialised reprensation of an initial monkey state", () => {
  const monkeyA = parseMonkeyString(dataA);
  expect(monkeyA.id).toBe(1);
  expect(monkeyA.test(BigInt(19 * 2))).toBe(true);

  const monkeyB = parseMonkeyString(dataB);
  expect(monkeyB.id).toBe(0);
  expect(monkeyB.test(BigInt(23 * 2))).toBe(true);

  const monkeyE = parseMonkeyString(dataE);
  expect(monkeyE.id).toBe(3);
  expect(monkeyE.test(BigInt(17 * 2))).toBe(true);
});

test("parseThrowConditionString can return a structured object of id to throw do for true and false", () => {
  expect(parseThrowConditionString(dataA)).toStrictEqual({ true: 2, false: 0 });
  expect(parseThrowConditionString(dataB)).toStrictEqual({ true: 2, false: 3 });
});

test("parseTestString can return a custom function that can evaluate whether is divisible according to input", () => {
  const dataATestFunction = parseTestString(dataA).testFn;
  expect(dataATestFunction(BigInt(19))).toBe(true);
  expect(dataATestFunction(BigInt(19 * 5))).toBe(true);

  const dataBTestFunction = parseTestString(dataB).testFn;
  expect(dataBTestFunction(BigInt(23))).toBe(true);
  expect(dataBTestFunction(BigInt(23 * 5))).toBe(true);

  const dataETestFunction = parseTestString(dataE).testFn;
  expect(dataETestFunction(BigInt(17))).toBe(true);
  expect(dataETestFunction(BigInt(17 * 5))).toBe(true);
});

test("parseOperationString can return a function that performs the instructed operation", () => {
  const dataAOperationFunction = parseOperationString(dataA);
  expect(dataAOperationFunction(BigInt(4))).toBe(BigInt(10));
  expect(dataAOperationFunction(BigInt(10))).toBe(BigInt(16));

  const dataBOperationFunction = parseOperationString(dataB);
  expect(dataBOperationFunction(BigInt(1))).toBe(BigInt(19));
  expect(dataBOperationFunction(BigInt(10))).toBe(BigInt(190));

  const dataEOperationFunction = parseOperationString(dataE);
  expect(dataEOperationFunction(BigInt(7))).toBe(BigInt(10));
  expect(dataEOperationFunction(BigInt(17))).toBe(BigInt(20));
});

test("parseStartItemsString can return a list of oldWorry values for each item", () => {
  expect(parseStartItemsString(dataA)).toStrictEqual(
    [54, 65, 75, 74].map((n) => BigInt(n)),
  );
  expect(parseStartItemsString(dataB)).toStrictEqual(
    [79, 98].map((n) => BigInt(n)),
  );
  expect(parseStartItemsString(dataE)).toStrictEqual(
    [74].map((n) => BigInt(n)),
  );
});

test("parseMonkeyIDString can return the monkey Id in numbe type", () => {
  expect(parseMonkeyIDString(dataA)).toStrictEqual(1);
  expect(parseMonkeyIDString(dataB)).toStrictEqual(0);
  expect(parseMonkeyIDString(dataE)).toStrictEqual(3);
});
