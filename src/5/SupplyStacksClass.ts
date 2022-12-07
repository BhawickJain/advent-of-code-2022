import { Move } from "./SupplyStacks";

export class SupplyStacks {
  readonly stacks: Record<number, string[]> = {};

  constructor(...initialStackStates: string[][]) {
    for (let i = 1; i <= initialStackStates.length; i++) {
      this.stacks[i] = initialStackStates[i - 1];
    }
  }

  move(move: Move): void {
    for (let c = 1; c <= move.numberOfCrates; c++) {
      const fromItem = this.stacks[move.from].pop();
      if (fromItem !== undefined) this.stacks[move.to].push(fromItem);
    }
  }

  moveSameOrder(move: Move): void {
    const grabbedItems = this.stacks[move.from].slice(-1 * move.numberOfCrates);
    this.stacks[move.from] = this.stacks[move.from].slice(
      0,
      -1 * move.numberOfCrates,
    );
    this.stacks[move.to].push(...grabbedItems);
  }

  readTopItems(): string[] {
    const s = this.stacks;
    const topItems: string[] = [];
    for (const key in s) {
      const stack = s[key];
      topItems.push(stack[stack.length - 1]);
    }
    return topItems;
  }
}
