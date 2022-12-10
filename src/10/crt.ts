import { readFileSync } from "fs";

export class CPU {
  registers: Record<string, number> = {};
  cycle = 0;

  /**
   * create and initialise list registers according to desired names
   * @param registerNames
   */
  constructor(registerNames: string[]) {
    registerNames.forEach((name) => (this.registers[name] = 1));
  }

  nextCycle() {
    this.cycle += 1;
  }

  add(registerName: string, valueToAdd: number) {
    this.registers[registerName] += valueToAdd;
    this.cycle += 1;
  }
}

export class CRT {
  cycle = 0;
  y = 0;
  x = 0;
  width: number;
  height: number;
  display: string[][] = [];
  sprite: number;
  spiteWidth = 3;

  constructor(width: number, height: number, sprite: number) {
    const displaybuffer = [...Array(width)].map((_) => ".");
    this.display = [...Array(height)].map((_) => [...displaybuffer]);
    this.width = width;
    this.height = height;
    this.sprite = sprite;
    this.look();
  }

  /**
   * print the display as if you are looking at it,
   * also give the cycle number
   */
  look() {
    console.log(`display cycle: ${this.cycle}`);
    for (const l of this.display) {
      console.log(l.join(""));
    }
    console.log("\n");
  }

  /**
   * update sprite
   * @param sprite horizontal x position of sprite
   */
  updateSprite(sprite: number) {
    this.sprite = sprite;
  }

  /**
   * increment display to next cycle, and render pixel of that cycle
   */
  nextCycle() {
    this.cycle += 1;
    this.renderPixel();
  }

  renderPixel() {
    const sprite = this.sprite;
    const xCursor = this.getX(this.cycle);
    const yCursor = this.getY(this.cycle);
    if (this.cursorOverlapsSpite(sprite, xCursor)) {
      this.display[yCursor][xCursor] = "#";
    }
  }

  cursorOverlapsSpite(sprite: number, xCursor: number) {
    const xOverlapping = xCursor >= sprite - 1 && xCursor <= sprite + 1;
    return xOverlapping;
  }

  getY(cycle: number): number {
    return Math.floor((cycle - 1) / this.width);
  }

  getX(cycle: number): number {
    return (cycle - 1) % this.width;
  }
}

export type Instruction = {
  cmd: string;
  register: string | null;
  argument: number | null;
};

/**
 * parses a single string intruction and interprets the command against the cpu state
 * @param cpu cpu Object
 * @param instruction single string instruction
 * @returns whether a cycle has been consumed
 */
export function executeInstruction(
  cpu: CPU,
  instruction: Instruction,
): boolean {
  switch (instruction.cmd) {
    case "noop":
      // console.log(`cycle: ${cpu.cycle} register: ${cpu.registers['x']} - noop`)
      return false;
    case "add":
      if (instruction.argument === null || instruction.register === null)
        throw "arg or register is null";
      cpu.add(instruction.register, instruction.argument);
      // console.log(`cycle: ${cpu.cycle} - add ${instruction.argument} to ${instruction.register} -> x: ${cpu.registers['x']}`)
      return true;
  }

  return false;
}

/**
 * parses an instruction and returns a structured instruction type
 * @param instruction string instruction
 * @returns instruction object which outlines command, register and argument
 */
export function parseInstruction(cpu: CPU, instruction: string): Instruction {
  cpu.nextCycle();
  // console.log(`cycle: ${cpu.cycle} register: ${cpu.registers['x']} - interpret: ${instruction}`)

  const addMatch = Array.from(instruction.matchAll(/add(.?)\s(-?\d+)/g));
  if (addMatch.length === 1) {
    const firstMatch = addMatch[0];
    return {
      cmd: "add",
      argument: parseInt(firstMatch[2]),
      register: firstMatch[1],
    };
  }

  return { cmd: "noop", argument: null, register: null };
}

export function firstHalf(input?: string): number {
  if (!input) input = readFileSync("./src/10/input.txt", "utf-8");
  const cpu = new CPU(["x"]);
  const split = input.split(/\n/g);
  const signalStrengthAtCycle: Record<number, number> = {};
  let xRegisterValueDuringCycle: number;

  for (const instruction of split) {
    const parsed = parseInstruction(cpu, instruction);

    xRegisterValueDuringCycle = cpu.registers["x"];
    if ([20, 60, 100, 140, 180].includes(cpu.cycle)) {
      signalStrengthAtCycle[cpu.cycle] = cpu.cycle * xRegisterValueDuringCycle;
      // console.log(`cycle: ${cpu.cycle} signal: ${signalStrengthAtCycle[cpu.cycle]} register: ${xRegisterValueDuringCycle}}`)
    }

    xRegisterValueDuringCycle = cpu.registers["x"];
    executeInstruction(cpu, parsed);
    if ([20, 60, 100, 140, 180, 220].includes(cpu.cycle)) {
      signalStrengthAtCycle[cpu.cycle] = cpu.cycle * xRegisterValueDuringCycle;
      // console.log(`cycle: ${cpu.cycle} signal: ${signalStrengthAtCycle[cpu.cycle]} register: ${xRegisterValueDuringCycle}}`)
    }
  }

  console.log("signalStrengthAtCycle:", signalStrengthAtCycle);

  let totalSignalStrength = 0;
  for (const cycle in signalStrengthAtCycle) {
    totalSignalStrength += signalStrengthAtCycle[cycle];
  }

  return totalSignalStrength;
}

export function secondHalf(input?: string): void {
  if (!input) input = readFileSync("./src/10/input.txt", "utf-8");
  const cpu = new CPU(["x"]);
  const crt = new CRT(40, 6, cpu.registers["x"]);
  const split = input.split(/\n/g);
  let xRegisterValueDuringCycle: number;

  for (const instruction of split) {
    xRegisterValueDuringCycle = cpu.registers["x"];
    crt.updateSprite(xRegisterValueDuringCycle);
    const parsed = parseInstruction(cpu, instruction);
    crt.nextCycle();

    xRegisterValueDuringCycle = cpu.registers["x"];
    crt.updateSprite(cpu.registers["x"]);
    if (executeInstruction(cpu, parsed)) crt.nextCycle();
  }

  crt.look();
}
