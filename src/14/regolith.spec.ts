import {
  Cave,
  getCaveDim,
  interpolateBetweenPoints,
  parseInput,
  parsePath,
  Pos,
  simulate,
} from "./regolith";

// disable jest `console.log` tags
// https://stackoverflow.com/questions/50942189/how-to-disable-jest-console-log-tags?noredirect=1&lq=1
beforeEach(() => {
  global.console = require("console");
});

test.skip("can parse a path and give an interpolated list of positions of rocks", () => {
  const dataA = `498,4 -> 498,6 -> 496,6`;
  console.log(parsePath(dataA));
});

test.skip("can return a list of rock positions given a list of scans in string", () => {
  const dataA = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;
  console.log(parseInput(dataA));
});

test.skip("can interpolate between two points", () => {
  console.log(interpolateBetweenPoints({ y: 498, x: 4 }, { y: 498, x: 6 }));
  console.log(interpolateBetweenPoints({ y: 498, x: 6 }, { y: 496, x: 6 }));
  console.log(interpolateBetweenPoints({ y: 503, x: 4 }, { y: 502, x: 4 }));
  console.log(interpolateBetweenPoints({ y: 502, x: 4 }, { y: 502, x: 9 }));
  console.log(interpolateBetweenPoints({ y: 502, x: 9 }, { y: 494, x: 9 }));
  console.log(interpolateBetweenPoints({ y: 0, x: 0 }, { y: 3, x: 3 })); // highlights limitation which problem does not need solving
});

test("can generate and add / get features from the cave class", () => {
  const rocks = parseInput();
  const sandSource: Pos = { x: 500, y: 0 };
  const { width, depth, startPos } = getCaveDim([...rocks, sandSource]);
  console.log(width, depth, startPos);
  const cave = new Cave(width, depth, startPos);
  cave.addFeature({ x: 500, y: 0 }, "+");
  const dataA = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;
  for (const r of rocks) {
    cave.addFeature(r, "#");
  }

  simulate(cave, sandSource).look();
});

test("can generate and add / get features from the cave class", () => {
  const rocks = parseInput();
  const sandSource: Pos = { x: 500, y: 0 };
  const { width, depth, startPos } = getCaveDim([...rocks, sandSource]);
  console.log(width, depth + 2, startPos);
  const shiftedPos: Pos = { x: startPos.x - 75, y: startPos.y };
  const cave = new Cave(width + 250, depth + 2, shiftedPos);
  cave.addFeature({ x: 500, y: 0 }, "+");
  const dataA = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;
  for (const r of rocks) {
    cave.addFeature(r, "#");
  }
  for (const x of [...Array(width + 250)].map((_, x) => x + shiftedPos.x)) {
    // console.log(x)
    cave.addFeature({ x: x, y: depth + 1 }, "#");
  }

  simulate(cave, sandSource).look();
});
