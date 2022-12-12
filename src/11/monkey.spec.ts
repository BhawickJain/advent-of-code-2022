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
  expect(firstHalf(dataFullMock)).toBe((10605));
  console.log("first half real data result:", firstHalf());
});

test("secondHalf should return the level of money business after 10_000 rounds", () => {
  expect(secondHalf(dataFullMock)).toBe((2713310158));
  console.log("second half real data result:", secondHalf());
});

test("lowestCommonMultiple returns the lowest common multiple across an array of numbers", () => {
  expect(lowestCommonMultiple([(2), (3)])).toBe((6));
  expect(lowestCommonMultiple([(5), (100)])).toBe((100));
  expect(
    lowestCommonMultiple([(1), (2), (3), (8)]),
  ).toBe((24));
});

test("monkey object correctly manages its state as inspect and catch class methods are instantiated", () => {
  const monkeyRecord = parseInput(dataD);

  const monkey0 = monkeyRecord[0];
  const thrownItems0 = monkey0.inspect(({reliefMult: 3}));
  expect(thrownItems0).toStrictEqual({ 3: [500, 620].map((n) => (n)) });

  const monkey1 = monkeyRecord[1];
  const thrownItems1 = monkey1.inspect(({reliefMult: 3}));
  expect(thrownItems1).toStrictEqual({
    0: [20, 23, 27, 26].map((n) => (n)),
  });

  const monkey2 = monkeyRecord[2];
  const thrownItems2 = monkey2.inspect(({reliefMult: 3}));
  expect(thrownItems2).toStrictEqual({
    1: [2080].map((n) => (n)),
    3: [1200, 3136].map((n) => (n)),
  });

  const monkey3 = monkeyRecord[3];
  const thrownItems3 = monkey3.inspect(({reliefMult: 3}));
  expect(thrownItems3).toStrictEqual({ 1: [25].map((n) => (n)) });
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
  expect(monkeyA.test((19 * 2))).toBe(true);

  const monkeyB = monkeyRecord[0];
  expect(monkeyB.id).toBe(0);
  expect(monkeyB.test((23 * 2))).toBe(true);
});

test("parseMonkeyString can return a monkey object given a serialised reprensation of an initial monkey state", () => {
  const monkeyA = parseMonkeyString(dataA);
  expect(monkeyA.id).toBe(1);
  expect(monkeyA.test((19 * 2))).toBe(true);

  const monkeyB = parseMonkeyString(dataB);
  expect(monkeyB.id).toBe(0);
  expect(monkeyB.test((23 * 2))).toBe(true);

  const monkeyE = parseMonkeyString(dataE);
  expect(monkeyE.id).toBe(3);
  expect(monkeyE.test((17 * 2))).toBe(true);
});

test("parseThrowConditionString can return a structured object of id to throw do for true and false", () => {
  expect(parseThrowConditionString(dataA)).toStrictEqual({ true: 2, false: 0 });
  expect(parseThrowConditionString(dataB)).toStrictEqual({ true: 2, false: 3 });
});

test("parseTestString can return a custom function that can evaluate whether is divisible according to input", () => {
  const dataATestFunction = parseTestString(dataA).testFn;
  expect(dataATestFunction((19))).toBe(true);
  expect(dataATestFunction((19 * 5))).toBe(true);

  const dataBTestFunction = parseTestString(dataB).testFn;
  expect(dataBTestFunction((23))).toBe(true);
  expect(dataBTestFunction((23 * 5))).toBe(true);

  const dataETestFunction = parseTestString(dataE).testFn;
  expect(dataETestFunction((17))).toBe(true);
  expect(dataETestFunction((17 * 5))).toBe(true);
});

test("parseOperationString can return a function that performs the instructed operation", () => {
  const dataAOperationFunction = parseOperationString(dataA);
  expect(dataAOperationFunction((4))).toBe((10));
  expect(dataAOperationFunction((10))).toBe((16));

  const dataBOperationFunction = parseOperationString(dataB);
  expect(dataBOperationFunction((1))).toBe((19));
  expect(dataBOperationFunction((10))).toBe((190));

  const dataEOperationFunction = parseOperationString(dataE);
  expect(dataEOperationFunction((7))).toBe((10));
  expect(dataEOperationFunction((17))).toBe((20));
});

test("parseStartItemsString can return a list of oldWorry values for each item", () => {
  expect(parseStartItemsString(dataA)).toStrictEqual(
    [54, 65, 75, 74].map((n) => (n)),
  );
  expect(parseStartItemsString(dataB)).toStrictEqual(
    [79, 98].map((n) => (n)),
  );
  expect(parseStartItemsString(dataE)).toStrictEqual(
    [74].map((n) => (n)),
  );
});

test("parseMonkeyIDString can return the monkey Id in numbe type", () => {
  expect(parseMonkeyIDString(dataA)).toStrictEqual(1);
  expect(parseMonkeyIDString(dataB)).toStrictEqual(0);
  expect(parseMonkeyIDString(dataE)).toStrictEqual(3);
});
