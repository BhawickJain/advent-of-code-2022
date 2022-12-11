import { readFileSync } from "fs";

type MonkeyId = number;

export function firstHalf(input?: string): bigint {
  if (!input) input = readFileSync("./src/11/input.txt", "utf-8");
  const monkeys: Record<MonkeyId, Monkey> = parseInput(input);
  const rounds = 20;

  for (let r = 0; r < rounds; r++) {
    for (const mId in monkeys) {
      const m = monkeys[mId];
      const throws: Record<MonkeyId, bigint[]> = m.inspect(BigInt(3));
      throwToMonkeys(throws, monkeys);
    }
  }

  const monkeyBusiness = calculateMonkeyBusiness(monkeys);

  return monkeyBusiness;
}

export function secondHalf(input?: string): bigint {
  if (!input) input = readFileSync("./src/11/input.txt", "utf-8");
  const monkeys: Record<MonkeyId, Monkey> = parseInput(input);
  getLowestCommonMultipleForMonkeys(monkeys);
  const rounds = 10_000;

  // console.log('max number value:', Number.MAX_SAFE_INTEGER)

  for (let r = 0; r < rounds; r++) {
    // display worry levels
    // for (const mId in monkeys) {
    // 	console.log(`monkey: ${mId}: ${monkeys[mId].items}`)
    // }

    for (const mId in monkeys) {
      const m = monkeys[mId];
      const throws: Record<MonkeyId, bigint[]> = m.inspect(); // relief mult of 1
      throwToMonkeys(throws, monkeys);
    }
  }

  const monkeyBusiness = calculateMonkeyBusiness(monkeys);

  return monkeyBusiness;
}

export function throwToMonkeys(
  throws: Record<MonkeyId, bigint[]>,
  monkeys: Record<MonkeyId, Monkey>,
): void {
  for (const throwToId in throws) {
    const thrownItems = throws[throwToId];
    monkeys[throwToId].catch([...thrownItems]);
  }
}

export function parseInput(input: string): Record<MonkeyId, Monkey> {
  const monkeyRecord: Record<MonkeyId, Monkey> = {};
  const stringOfMonkeys = input.split("\n\n");
  const arrayOfMonkeys = stringOfMonkeys.map((str) => parseMonkeyString(str));
  arrayOfMonkeys.forEach((m) => (monkeyRecord[m.id] = m));
  return monkeyRecord;
}

export function parseMonkeyString(monkeyString: string): Monkey {
  const monkeyID: MonkeyId = parseMonkeyIDString(monkeyString);
  const startItems: bigint[] = parseStartItemsString(monkeyString);
  const operation: (old: bigint) => bigint = parseOperationString(monkeyString);
  const { testFn, divisor } = parseTestString(monkeyString);
  const throwCondition: { true: MonkeyId; false: MonkeyId } =
    parseThrowConditionString(monkeyString);
  const monkey = new Monkey(
    monkeyID,
    startItems,
    operation,
    divisor,
    testFn,
    throwCondition,
  );
  return monkey;
}

export class Monkey {
  id: MonkeyId;
  items: bigint[];
  inspectionCount = BigInt(0);
  operation: (old: bigint) => bigint;
  test: (divisble: bigint) => boolean;
  divisor: bigint;
  throwCondition: { true: MonkeyId; false: MonkeyId };
  lowestCommonMultiple: bigint | undefined;

  constructor(
    id: MonkeyId,
    startItems: bigint[],
    operation: (old: bigint) => bigint,
    divisor: bigint,
    test: (divisible: bigint) => boolean,
    throwCondition: { true: MonkeyId; false: MonkeyId },
    lowestCommonMultiple?: bigint,
  ) {
    this.id = id;
    this.items = startItems;
    this.operation = operation;
    this.test = test;
    this.divisor = divisor;
    this.throwCondition = throwCondition;
  }

  inspect(reliefMult?: bigint): Record<MonkeyId, bigint[]> {
    const throwItemsTo: Record<MonkeyId, bigint[]> = {};

    this.inspectionCount += BigInt(this.items.length);
    const oldWorry = [...this.items];
    this.items = [];

    const newWorry = oldWorry.map((o) => this.operation(o));
    const relievedWorry = newWorry.map((n) =>
      reliefMult
        ? relief(parseInt(reliefMult.toString()), parseInt(n.toString()))
        : n,
    );
    const test = relievedWorry.map((r) => this.test(BigInt(r)));

    test.forEach((divisble, i) => {
      const divisibleString = divisble ? "true" : "false";
      const throwTo = this.throwCondition[divisibleString];
      // console.log('before reduce:', relievedWorry[i])
      // console.log('reducer boolean:', this.lowestCommonMultiple && relievedWorry[i] % this.lowestCommonMultiple === BigInt(0))
      const reduce =
        this.lowestCommonMultiple && divisble
          ? BigInt(relievedWorry[i]) % this.lowestCommonMultiple
          : relievedWorry[i];
      // const reduce = this.lowestCommonMultiple && relievedWorry[i] % this.lowestCommonMultiple === BigInt(0) ? smallestCommonMultiple(relievedWorry[i], this.lowestCommonMultiple) : relievedWorry[i]
      // console.log('after reduce:', reduce)
      if (!throwItemsTo[throwTo]) throwItemsTo[throwTo] = [];
      throwItemsTo[throwTo].push(BigInt(reduce));
    });

    return Object.assign({ ...throwItemsTo });
  }

  catch(items: bigint[]) {
    items.forEach((i) => this.items.push(i));
  }
}

export function smallestCommonMultiple(num: bigint, divisor: bigint): bigint {
  let smallest = num;
  while (smallest % divisor === BigInt(0)) {
    smallest = smallest / divisor;
  }
  return smallest;
}

export function relief(mult: number, worryLevel: number): number {
  const relievedWorryLevel = Math.floor(worryLevel / mult);
  return relievedWorryLevel;
}

export function calculateMonkeyBusiness(
  monkeys: Record<MonkeyId, Monkey>,
): bigint {
  const inspectionCountList: bigint[] = [];

  for (const mId in monkeys) {
    const inspectionCount = monkeys[mId].inspectionCount;
    inspectionCountList.push(inspectionCount);
  }

  // console.log('inspectionCountList', inspectionCountList)

  const topTwo = inspectionCountList.sort((a, b) =>
    parseInt((b - a).toString()),
  );
  const monkeyBusinessLevel = topTwo
    .slice(0, 2)
    .reduce((product, count) => product * count);
  return monkeyBusinessLevel;
}

export function parseMonkeyIDString(monkeyString: string): MonkeyId {
  const matches = Array.from(monkeyString.matchAll(/Monkey (\d+):/g))[0];
  if (!matches)
    throw new Error(`no Monkey ID found in string: ${monkeyString}`);
  const monkeyIdString = matches[1];
  const id = parseInt(monkeyIdString);
  return id;
}

export function parseStartItemsString(monkeyString: string): bigint[] {
  const matches = Array.from(
    monkeyString.matchAll(/Starting\sitems:\s(.+)/g),
  )[0];
  if (!matches)
    throw new Error(`no start items not found in string: ${monkeyString}`);
  const startItemsString = matches[1];
  const arrayOfStringNumbers = startItemsString.split(/,\s/g);
  const arrayOfNumbers = arrayOfStringNumbers.map((s) => BigInt(s));
  return arrayOfNumbers;
}

export function parseOperationString(
  monkeyString: string,
): (old: bigint) => bigint {
  const matches = Array.from(
    monkeyString.matchAll(/Operation: new = (.*)/g),
  )[0];
  if (!matches)
    throw new Error(`operation string not found in string: ${monkeyString}`);
  const tokens = Array.from(matches[1].matchAll(/(.?(old|\d+?|[+*]).?)/g)).map(
    (m) => m[0].trim(),
  );
  let operator: (arg1: bigint, arg2: bigint) => bigint;
  const args: (bigint | "old")[] = [];

  for (const t of tokens) {
    if (t === "*") {
      operator = (arg1: bigint, arg2) => arg1 * arg2;
      continue;
    }
    if (t === "+") {
      operator = (arg1: bigint, arg2) => arg1 + arg2;
      continue;
    }
    if (t === "old") {
      args.push("old");
      continue;
    }
    if (/\d+?/g.test(t)) {
      args.push(BigInt(t));
      continue;
    }

    throw new Error(`unknown token! '${t}'`);
  }

  const newWorryFunction: (oldWorry: bigint) => bigint = (oldWorry: bigint) => {
    const arg1 = args[0] === "old" ? oldWorry : args[0];
    const arg2 = args[1] === "old" ? oldWorry : args[1];
    const result = operator(arg1, arg2);
    return result;
  };

  return (oldWorry: bigint) => newWorryFunction(oldWorry);
}

export function parseTestString(monkeyString: string): {
  testFn: (divisble: bigint) => boolean;
  divisor: bigint;
} {
  const matches = Array.from(monkeyString.matchAll(/Test:.+?(\d+)/g))[0];
  if (!matches)
    throw new Error(`test string not found in string: ${monkeyString}`);
  const divisor = BigInt(matches[1]);
  return {
    testFn: (divisible: bigint) => divisible % divisor === BigInt(0),
    divisor: divisor,
  };
}

export function getLowestCommonMultipleForMonkeys(
  monkeys: Record<number, Monkey>,
): void {
  const divisorArray: bigint[] = [];

  for (const mId in monkeys) {
    divisorArray.push(monkeys[mId].divisor);
  }

  const lcm = lowestCommonMultiple(divisorArray);

  for (const mId in monkeys) {
    monkeys[mId].lowestCommonMultiple = lcm;
  }
}

export function lowestCommonMultiple(divisor: bigint[]): bigint {
  let lcm = divisor[0];
  for (let i = 1; i < divisor.length; i++)
    lcm = (divisor[i] * lcm) / greatestCommonDivisor(divisor[i], lcm);

  return lcm;
}

export function greatestCommonDivisor(a: bigint, b: bigint): bigint {
  if (b == BigInt(0)) return a;
  return greatestCommonDivisor(b, a % b);
}

export function parseThrowConditionString(monkeyString: string): {
  true: number;
  false: number;
} {
  const trueRegex = /If true:.+?(\d+)/g;
  const falseRegex = /If false:.+?(\d+)/g;

  const trueMatches = Array.from(monkeyString.matchAll(trueRegex))[0];
  if (!trueMatches)
    throw new Error(`test string not found in string: ${monkeyString}`);
  const throwToIdWhenTrue: number = parseInt(trueMatches[1]);

  const falseMatches = Array.from(monkeyString.matchAll(falseRegex))[0];
  if (!falseMatches)
    throw new Error(`test string not found in string: ${monkeyString}`);
  const throwToIdWhenfalse: number = parseInt(falseMatches[1]);

  return { true: throwToIdWhenTrue, false: throwToIdWhenfalse };
}

// Lessons learnt
// ensure all primitive information are easily available in objects
// ensure flexibility and reduces the presumptions.
// LCM calculation has caused an awkward handling of extracting the divisor
