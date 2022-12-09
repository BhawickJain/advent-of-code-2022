import { readFileSync } from "fs";
import { parseInput, Pos, RopeInSpace, LongRopeInSpace } from "./rope-bridge";
/**
 * 1) read input and parse into array of motions
 * 2) instantiate rope in space with Head/Tail position
 * 3) initialise tail position tracker as a Set of serialised positions
 * 4) for each motion
 * 5a) move head: class updates internally tail as well
 * 5b) get new tail position
 * 5c) serialise tail position and add to set
 * 6) get length of Tail Position Tracker
 * 7) return length
 * @param input puzzle input for day-9
 * @returns
 */
export function firstHalf(input?: string): number {
  if (!input) input = readFileSync("./src/9/input.txt", "utf-8");
  const rope = new RopeInSpace({ x: 0, y: 0 }, { x: 0, y: 0 });
  const tailPosition = new Set<string>([]);
  const moves = parseInput(input);
  moves.forEach((m) => {
    rope.moveHead(m);
  });

  rope.tailPosHistory.forEach((t) => {
    tailPosition.add(`${t.x},${t.y}`);
  });

  rope.print();

  return Array.from(tailPosition).length;
}

export function secondHalf(input?: string): number {
  if (!input) input = readFileSync("./src/9/input.txt", "utf-8");
  const rope = new LongRopeInSpace({ x: 0, y: 0 }, 10);
  const tailPosition = new Set<string>([]);
  const moves = parseInput(input);
  moves.forEach((m) => {
    rope.moveHead(m);
  });

  rope.history.slice(-1)[0].forEach((t) => {
    tailPosition.add(`${t.x},${t.y}`);
  });

  rope.print();
  console.log(rope.rope);

  // console.log('ropehistory)', rope.history)

  return Array.from(tailPosition).length;
}
