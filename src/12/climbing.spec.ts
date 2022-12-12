import {
  ElMap,
  getAdjecent,
  getPosForLetter,
  invertLetters,
  parseInput,
  parsePosition,
  Pos,
  serialisePosition,
  shortestPath,
} from "./climbing";

// disable jest `console.log` tags
// https://stackoverflow.com/questions/50942189/how-to-disable-jest-console-log-tags?noredirect=1&lq=1
beforeEach(() => {
  global.console = require("console");
});

const dataA = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

test("can find the shortest path given an elevation map, start and end Letter", () => {
  const elMap = parseInput(dataA);
  expect(shortestPath(elMap, "S", "E")["r2c5"]).toBe(31);
});

test("find the fewest steps required from any 'a' to 'E'", () => {
  /**
   * invert the elevation map and start plotting a shortest distance table from 'E"
   * completely exhaust the serach and loook up each 'a' position
   * choose the shortest distance among the 'a's
   */
  const elMap = parseInput().map((r) =>
    r.map((c) => (c !== "S" && c !== "E" ? invertLetters(c) : c)),
  );
  const officialStartPos = getPosForLetter(elMap, "S")[0];
  const officialEndPos = getPosForLetter(elMap, "E")[0];
  elMap[officialStartPos.row][officialStartPos.col] = "z"; // turn 'S' into 'a'
  elMap[officialEndPos.row][officialEndPos.col] = "S"; // turn 'S' into 'a'
  console.log("number of 'a's", getPosForLetter(elMap, "z").length);
  const listOfStartPositions = getPosForLetter(elMap, "z");

  const candElMap: ElMap = JSON.parse(JSON.stringify(elMap));
  const shortestDistance = shortestPath(Object.assign([...candElMap]), "S");

  const DistanceListToA = [];
  for (const z of listOfStartPositions) {
    DistanceListToA.push(shortestDistance[serialisePosition(z)]);
  }

  console.log(Math.min(...DistanceListToA));
});

test("invert the letter", () => {
  expect(invertLetters("a")).toBe("z");
  expect(invertLetters("b")).toBe("y");
  expect(invertLetters("c")).toBe("x");
});

test("can get position for letter", () => {
  const elMap = parseInput(dataA);
  expect(getPosForLetter(elMap, "S")).toStrictEqual([{ row: 0, col: 0 }]);
  expect(getPosForLetter(elMap, "E")).toStrictEqual([{ row: 2, col: 5 }]);
  expect(getPosForLetter(elMap, "a")).toStrictEqual([
    { row: 0, col: 1 },
    { row: 1, col: 0 },
    { row: 2, col: 0 },
    { row: 3, col: 0 },
    { row: 4, col: 0 },
  ]);
});

test("can get valid adjacent positions from an elevation map", () => {
  const elMapSE = parseInput(dataA);
  const elMap = Object.assign([...elMapSE]);
  elMap[0][0] = "a";
  const resultA: Pos[] = [
    { row: 0, col: 1 },
    { row: 1, col: 0 },
  ];
  expect(getAdjecent({ row: 0, col: 0 }, elMap)).toStrictEqual(resultA);

  const elMapSeReal: ElMap = parseInput();
  const elMapReal: ElMap = Object.assign([...elMapSeReal]);
  elMapReal[20][132] = "z";
});

test("can serialise and deserialise position", () => {
  const pos: Pos = { row: 0, col: 120 };
  expect(serialisePosition(pos)).toBe("r0c120");
  expect(parsePosition("r0c120")).toStrictEqual(pos);
});
