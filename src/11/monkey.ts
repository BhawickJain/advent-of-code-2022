import { readFileSync } from "fs";

type MonkeyId = number;

export function firstHalf(input?: string): number {
  if (!input) input = readFileSync("./src/11/input.txt", "utf-8");
  const monkeys: Record<MonkeyId, Monkey> = parseInput(input);
  const rounds = 20;
  const lowestCommonMultiple = getLowestCommonMultipleForMonkeys(monkeys);

  for (let r = 0; r < rounds; r++) {
    for (const mId in monkeys) {
      const m = monkeys[mId];
      const throws: Record<MonkeyId, number[]> = m.inspect({ reliefMult: 3 });
      throwToMonkeys(throws, monkeys);
    }
  }

  const monkeyBusiness = calculateMonkeyBusiness(monkeys);
  return monkeyBusiness;
}

export function secondHalf(input?: string): number {
  if (!input) input = readFileSync("./src/11/input.txt", "utf-8");
  const monkeys: Record<MonkeyId, Monkey> = parseInput(input);
  const lowestCommonMultiple = getLowestCommonMultipleForMonkeys(monkeys);
  const rounds = 10_000;

  for (let r = 0; r < rounds; r++) {
    for (const mId in monkeys) {
      const m = monkeys[mId];
      const throws: Record<MonkeyId, number[]> = m.inspect({
        lcm: lowestCommonMultiple,
      }); // relief mult of 1
      throwToMonkeys(throws, monkeys);
    }
  }

  const monkeyBusiness = calculateMonkeyBusiness(monkeys);
  return monkeyBusiness;
}

export function throwToMonkeys(
  throws: Record<MonkeyId, number[]>,
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
  const startItems: number[] = parseStartItemsString(monkeyString);
  const operation: (old: number) => number = parseOperationString(monkeyString);
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
  items: number[];
  inspectionCount = 0;
  operation: (old: number) => number;
  test: (divisble: number) => boolean;
  divisor: number;
  throwCondition: { true: MonkeyId; false: MonkeyId };

  constructor(
    id: MonkeyId,
    startItems: number[],
    operation: (old: number) => number,
    divisor: number,
    test: (divisible: number) => boolean,
    throwCondition: { true: MonkeyId; false: MonkeyId },
  ) {
    this.id = id;
    this.items = startItems;
    this.operation = operation;
    this.test = test;
    this.divisor = divisor;
    this.throwCondition = throwCondition;
  }

  inspect(kwargs: {
    lcm?: number;
    reliefMult?: number;
  }): Record<MonkeyId, number[]> {
    const { lcm, reliefMult } = kwargs;
    const throwItemsTo: Record<MonkeyId, number[]> = {};

    this.inspectionCount += this.items.length;
    const oldWorry = [...this.items];
    this.items = [];

    const newWorry = oldWorry.map((o) => this.operation(o));
    const relievedWorry = newWorry.map((n) =>
      reliefMult ? relief(reliefMult, n) : n,
    );
    const test = relievedWorry.map((r) => this.test(r));

    test.forEach((divisble, i) => {
      const divisibleString = divisble ? "true" : "false";
      const throwTo = this.throwCondition[divisibleString];
      const reduce = lcm ? relievedWorry[i] % lcm : relievedWorry[i];
      if (!throwItemsTo[throwTo]) throwItemsTo[throwTo] = [];
      throwItemsTo[throwTo].push(reduce);
    });

    return Object.assign({ ...throwItemsTo });
  }

  catch(items: number[]) {
    items.forEach((i) => this.items.push(i));
  }
}

export function relief(mult: number, worryLevel: number): number {
  const relievedWorryLevel = Math.floor(worryLevel / mult);
  return relievedWorryLevel;
}

export function calculateMonkeyBusiness(
  monkeys: Record<MonkeyId, Monkey>,
): number {
  const inspectionCountList: number[] = [];

  for (const mId in monkeys) {
    const inspectionCount = monkeys[mId].inspectionCount;
    inspectionCountList.push(inspectionCount);
  }

  const topTwo = inspectionCountList.sort((a, b) => b - a);
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

export function parseStartItemsString(monkeyString: string): number[] {
  const matches = Array.from(
    monkeyString.matchAll(/Starting\sitems:\s(.+)/g),
  )[0];
  if (!matches)
    throw new Error(`no start items not found in string: ${monkeyString}`);
  const startItemsString = matches[1];
  const arrayOfStringNumbers = startItemsString.split(/,\s/g);
  const arrayOfNumbers = arrayOfStringNumbers.map((s) => parseInt(s));
  return arrayOfNumbers;
}

export function parseOperationString(
  monkeyString: string,
): (old: number) => number {
  const matches = Array.from(
    monkeyString.matchAll(/Operation: new = (.*)/g),
  )[0];
  if (!matches)
    throw new Error(`operation string not found in string: ${monkeyString}`);
  const tokens = Array.from(matches[1].matchAll(/(.?(old|\d+?|[+*]).?)/g)).map(
    (m) => m[0].trim(),
  );
  let operator: (arg1: number, arg2: number) => number;
  const args: (number | "old")[] = [];

  for (const t of tokens) {
    if (t === "*") {
      operator = (arg1: number, arg2) => arg1 * arg2;
      continue;
    }
    if (t === "+") {
      operator = (arg1: number, arg2) => arg1 + arg2;
      continue;
    }
    if (t === "old") {
      args.push("old");
      continue;
    }
    if (/\d+?/g.test(t)) {
      args.push(parseInt(t));
      continue;
    }

    throw new Error(`unknown token! '${t}'`);
  }

  const newWorryFunction: (oldWorry: number) => number = (oldWorry: number) => {
    const arg1 = args[0] === "old" ? oldWorry : args[0];
    const arg2 = args[1] === "old" ? oldWorry : args[1];
    const result = operator(arg1, arg2);
    return result;
  };

  return (oldWorry: number) => newWorryFunction(oldWorry);
}

export function parseTestString(monkeyString: string): {
  testFn: (divisble: number) => boolean;
  divisor: number;
} {
  const matches = Array.from(monkeyString.matchAll(/Test:.+?(\d+)/g))[0];
  if (!matches)
    throw new Error(`test string not found in string: ${monkeyString}`);
  const divisor = parseInt(matches[1]);
  return {
    testFn: (divisible: number) => divisible % divisor === 0,
    divisor: divisor,
  };
}

export function getLowestCommonMultipleForMonkeys(
  monkeys: Record<number, Monkey>,
): number {
  const divisorArray: number[] = [];

  for (const mId in monkeys) {
    divisorArray.push(monkeys[mId].divisor);
  }

  return lowestCommonMultiple(divisorArray);
}

export function lowestCommonMultiple(divisor: number[]): number {
  let lcm = divisor[0];
  for (let i = 1; i < divisor.length; i++)
    lcm = (divisor[i] * lcm) / greatestCommonDivisor(divisor[i], lcm);

  return lcm;
}

export function greatestCommonDivisor(a: number, b: number): number {
  if (b == 0) return a;
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
