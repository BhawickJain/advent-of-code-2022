import { firstHalf, secondHalf } from "./computeSolution";
import {
  Move,
  parseSerialisedStack,
  parseSerialsedMove,
  parseSupplyStacksInput,
} from "./SupplyStacks";

test("can correctly parse input into stacks and moves", () => {
  const data = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

  const stacks = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 `;

  const moves = `move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

  expect(parseSupplyStacksInput(data)).toStrictEqual([stacks, moves]);
});

test("can parse a serialised stack into an array of initial stack states", () => {
  const data = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 `;

  const answer = [["Z", "N"], ["M", "C", "D"], ["P"]];

  expect(parseSerialisedStack(data)).toStrictEqual(answer);
});

test("can parse a serialised move into an array of Move type objects", () => {
  const data = `move 1 from 1 to 2`;
  const answer: Move = { from: 1, to: 2, numberOfCrates: 1 };
  expect(parseSerialsedMove(data)).toStrictEqual(answer);
});

test("test firstHalf with mock data, then (iff pass) run with input", () => {
  const data = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;
  expect(firstHalf(data)).toBe("CMZ");
  console.log("firstHalf result:", firstHalf());
});

test("test secondHalf with mock data, then (iff pass) run with input", () => {
  const data = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;
  expect(secondHalf(data)).toBe("MCD");
  console.log("secondHalf result:", secondHalf());
});
