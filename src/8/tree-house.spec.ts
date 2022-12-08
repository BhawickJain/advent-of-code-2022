import { firstHalf, secondHalf } from "./compute-solution";
import {
  getAdjacentTrees,
  getSearchSpace,
  pivotArray,
  Pos,
  preprocessScan,
  viewingDistanceAlongArray,
} from "./tree-house";

test("find trees that are visible from the outside grid", () => {
  const data = `30373
25512
65332
33549
35390`;
  expect(firstHalf(data)).toBe(21);
  console.log("first half result:", firstHalf());
});

test("viewing distance is correctly calculated", () => {
  const data = `30373
25512
65332
33549
35390`;
  const treesRowMajor = preprocessScan(data);
  const treesColumnMajor = pivotArray(treesRowMajor);
  const viewingScoreInRow = viewingDistanceAlongArray(treesRowMajor[3], 2);
  const viewingScoreInColumn = viewingDistanceAlongArray(
    treesColumnMajor[2],
    3,
  );
  const viewingScore = viewingScoreInColumn * viewingScoreInRow;
  expect(viewingScore).toBe(8);
});

test("viewing distance is correctly calculated", () => {
  const data = `30373
25512
65332
33549
35390`;
  const treesRowMajor = preprocessScan(data);
  const treesColumnMajor = pivotArray(treesRowMajor);
  const viewingScoreInRow = viewingDistanceAlongArray(treesRowMajor[1], 2); // top-down, left-right
  const viewingScoreInColumn = viewingDistanceAlongArray(
    treesColumnMajor[2],
    1,
  );
  const viewingScore = viewingScoreInColumn * viewingScoreInRow;
  expect(viewingScore).toBe(4);
});

test("find trees that are visible from the outside grid", () => {
  const data = `30373
25512
65332
33549
35390`;
  expect(secondHalf(data)).toBe(8);
  console.log("second half result:", secondHalf());
});

test("given a Position and scan, can get all adjacent trees", () => {
  const data = `30373
25512
65332
33549
35390`;
  const trees = preprocessScan(data);

  expect(getAdjacentTrees(1, 1, trees)).toStrictEqual([2, 5, 0, 5]);
});

test("get search space of trees that may be visisble", () => {
  const data = `30373
25512
65332
33549
35390`;
  const trees = preprocessScan(data);
  const expected: [Pos, Pos] = [
    { x: 1, y: 1 },
    { x: 3, y: 3 },
  ];
  expect(getSearchSpace(trees)).toStrictEqual(expected);
});

test("pivotArray returns a row-major 2D Array of number into column major", () => {
  const data = [
    [1, 2],
    [1, 2],
    [1, 2],
  ];
  const expected = [
    [1, 1, 1],
    [2, 2, 2],
  ];

  expect(pivotArray(data)).toStrictEqual(expected);
});
