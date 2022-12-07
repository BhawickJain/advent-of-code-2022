import { readFileSync } from "fs";
import {
  Move,
  parseSupplyStacksInput,
  parseSerialsedMove,
  parseSerialisedStack,
} from "./SupplyStacks";
import { SupplyStacks } from "./SupplyStacksClass";

/**
 * 1) split input into intial stack configuration and moves input
 * 2) parse stack config and load in to supply stacks class
 * 3) parse moves input into an array of move objects
 * 4) use move method in class to implement instruction
 * 5) read the top items in the stacks and return as a single string
 * @param input day-5 puzzle input
 * @returns what crate ends up on the top each stack
 */
export function firstHalf(input?: string): string {
  input = input ?? readFileSync("./src/5/input.txt", "utf-8");
  const [serialisedStack, serialisedMoves] = parseSupplyStacksInput(input);
  const arrayOfSupplies: string[][] = parseSerialisedStack(serialisedStack);
  const arrayOfMoves: Move[] = serialisedMoves
    .split("\n")
    .map((m) => parseSerialsedMove(m));
  const stacks = new SupplyStacks(...arrayOfSupplies);

  arrayOfMoves.forEach((m) => stacks.move(m));

  return stacks.readTopItems().join("");
}

export function secondHalf(input?: string): string {
  input = input ?? readFileSync("./src/5/input.txt", "utf-8");
  const [serialisedStack, serialisedMoves] = parseSupplyStacksInput(input);
  const arrayOfSupplies: string[][] = parseSerialisedStack(serialisedStack);
  const arrayOfMoves: Move[] = serialisedMoves
    .split("\n")
    .map((m) => parseSerialsedMove(m));
  const stacks = new SupplyStacks(...arrayOfSupplies);

  arrayOfMoves.forEach((m) => stacks.moveSameOrder(m));

  return stacks.readTopItems().join("");
}
