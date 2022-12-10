import {
  CPU,
  firstHalf,
  executeInstruction,
  parseInstruction,
  Instruction,
  CRT,
  secondHalf,
} from "./crt";

// disable jest `console.log` tags
// https://stackoverflow.com/questions/50942189/how-to-disable-jest-console-log-tags?noredirect=1&lq=1
beforeEach(() => {
  global.console = require("console");
});

test.skip("cpu can instantiated and tracks register and cycle state", () => {
  const cpu = new CPU(["x"]);
  expect(cpu.cycle).toBe(0);
  expect(cpu.registers).toStrictEqual({ x: 1 });

  cpu.nextCycle();
  expect(cpu.cycle).toBe(1);
  expect(cpu.registers).toStrictEqual({ x: 1 });

  cpu.nextCycle();
  cpu.add("x", 3);
  expect(cpu.cycle).toBe(3);
  expect(cpu.registers).toStrictEqual({ x: 4 });

  cpu.nextCycle();
  cpu.add("x", -5);
  expect(cpu.cycle).toBe(5);
  expect(cpu.registers).toStrictEqual({ x: -1 });
});

test.skip("parseInstruction can take a string instruction and return a structured instruction", () => {
  const cpu = new CPU(["x"]);
  expect(cpu.cycle).toBe(0);
  expect(parseInstruction(cpu, "noop")).toStrictEqual({
    cmd: "noop",
    argument: null,
    register: null,
  });
  expect(cpu.cycle).toBe(1);
  expect(parseInstruction(cpu, "addx 3")).toStrictEqual({
    cmd: "add",
    argument: 3,
    register: "x",
  });
  expect(cpu.cycle).toBe(2);
  expect(parseInstruction(cpu, "addx -5")).toStrictEqual({
    cmd: "add",
    argument: -5,
    register: "x",
  });
  expect(cpu.cycle).toBe(3);
});

test.skip("interpretInstruction can take a cpu and and instruction and correctly modify its state", () => {
  const cpu = new CPU(["x"]);
  expect(cpu.cycle).toBe(0);
  expect(cpu.registers).toStrictEqual({ x: 1 });

  let parsed: Instruction;

  parsed = parseInstruction(cpu, "noop");
  executeInstruction(cpu, parsed);
  expect(cpu.cycle).toBe(1);
  expect(cpu.registers).toStrictEqual({ x: 1 });

  parsed = parseInstruction(cpu, "addx 3");
  expect(cpu.cycle).toBe(2);
  executeInstruction(cpu, parsed);
  expect(cpu.cycle).toBe(3);
  expect(cpu.registers).toStrictEqual({ x: 4 });

  parsed = parseInstruction(cpu, "addx -5");
  executeInstruction(cpu, parsed);
  expect(cpu.cycle).toBe(5);
  expect(cpu.registers).toStrictEqual({ x: -1 });
});

test.skip("first half can return the sum of signal strengths", () => {
  const data = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`;

  console.log("first half using mock data: ", firstHalf(data));
  console.log("\n\n");
  console.log("first half using real data: ", firstHalf());
});

test.skip("crt can render an image and draw overlapping sprites", () => {
  const crt = new CRT(40, 6, 1);
  crt.nextCycle();
  crt.look();
  crt.nextCycle();
  crt.look();
  crt.updateSprite(5);
  crt.nextCycle();
  crt.nextCycle();
  crt.nextCycle();
  crt.nextCycle();
  crt.nextCycle();
  crt.nextCycle();
  crt.nextCycle();
  crt.nextCycle();
  crt.look();
});

test("test secondhalf", () => {
  const data = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`;

  secondHalf();
});

// ##..##..##..##..##..##..##..##..##..##..
// ##..##..##..##..##..#
