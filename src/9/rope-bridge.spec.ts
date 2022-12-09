import { firstHalf, secondHalf } from "./compute-solution";
import { Motion, parseInput, RopeInSpace } from "./rope-bridge";

test("parseInput can take a serial list of motions and return an array of Motion types", () => {
  const data = `R 4
U 4
L 3
D 1
R 2`;
  const expectedResult: Motion[] = [
    { dir: "R", mag: 4 },
    { dir: "U", mag: 4 },
    { dir: "L", mag: 3 },
    { dir: "D", mag: 1 },
    { dir: "R", mag: 2 },
  ];

  expect(parseInput(data)).toStrictEqual(expectedResult);
});

// disable jest `console.log` tags
// https://stackoverflow.com/questions/50942189/how-to-disable-jest-console-log-tags?noredirect=1&lq=1
beforeEach(() => {
  global.console = require("console");
});
test.skip("RopeInSpace can manage the Head Tail movements of a rope and display total state", () => {
  const rope = new RopeInSpace({ x: 0, y: 0 }, { x: 0, y: 0 });
  rope.moveHead({ dir: "R", mag: 4 });
  rope.moveHead({ dir: "U", mag: 4 });
  rope.moveHead({ dir: "L", mag: 3 });
  rope.moveHead({ dir: "D", mag: 1 });
  rope.moveHead({ dir: "R", mag: 4 });
  rope.moveHead({ dir: "D", mag: 1 });
  rope.moveHead({ dir: "L", mag: 5 });
  rope.moveHead({ dir: "R", mag: 2 });
  rope.print();
});

test.skip("run first half", () => {
  const data = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;
  console.log(firstHalf(data));
  // console.log(firstHalf())
});

test("run second half", () => {
  // 	const data = `R 5
  // U 8
  // L 8
  // D 3
  // R 17
  // D 10
  // L 25
  // U 20`

  const data = `R 4
  U 4
  L 3
  D 1
  R 4
  D 1
  L 5
  R 2`;

  console.log(secondHalf(data));
  // console.log(secondHalf());
});
