import { readFileSync } from "fs";
import {
  getAdjacentTrees,
  getEdgePositions,
  getSearchSpace,
  pivotArray,
  preprocessScan,
  largestInEitherSide,
  viewingDistanceAlongArray,
  Pos,
} from "./tree-house";

/**
 * TODO REWRITE ALGO
 * 1) use heuristic to not check any trees around the edges
 * 2) create grid that is searched
 * 3) for each tree in serach space
 * 3a) get adjecant trees around the tree
 * 3b) determine if visible
 * 3c) increment count of visible trees by one
 * @param input day-8 input
 * @returns
 */
export function firstHalf(input?: string): number {
  if (!input) input = readFileSync("./src/8/input.txt", "utf-8");
  const treesRowMajor = preprocessScan(input);
  // console.log(treesRowMajor.length, treesRowMajor[0].length)
  // console.log(treesRowMajor)
  const treesColumnMajor = pivotArray(treesRowMajor);
  // console.log(treesColumnMajor)
  const [startTreePos, endTreePos] = getSearchSpace(treesRowMajor);
  let visibleCount = 0;

  for (let x = startTreePos.x; x <= endTreePos.x; x++) {
    for (let y = startTreePos.y; y <= endTreePos.y; y++) {
      const isShortestInRow = largestInEitherSide(treesRowMajor[y], x);
      const isShortestInColumn = largestInEitherSide(treesColumnMajor[x], y);
      if (isShortestInColumn || isShortestInRow) visibleCount += 1;
    }
  }

  // add all trees in the edge
  visibleCount += getEdgePositions(treesRowMajor);

  return visibleCount;
}

export function secondHalf(input?: string): number {
  if (!input) input = readFileSync("./src/8/input.txt", "utf-8");
  const treesRowMajor = preprocessScan(input);
  const treesColumnMajor = pivotArray(treesRowMajor);
  const startTreePos: Pos = { x: 0, y: 0 };
  const endTreePos: Pos = {
    x: treesRowMajor[0].length - 1,
    y: treesRowMajor.length - 1,
  };
  let highestViewingDistanceScore = 0;
  const highestPos: Pos = { x: 0, y: 0 };

  for (let x = startTreePos.x; x <= endTreePos.x; x++) {
    for (let y = startTreePos.y; y <= endTreePos.y; y++) {
      const viewingScoreInRow = viewingDistanceAlongArray(treesRowMajor[y], x);
      const viewingScoreInColumn = viewingDistanceAlongArray(
        treesColumnMajor[x],
        y,
      );
      const viewingScore = viewingScoreInColumn * viewingScoreInRow;
      if (viewingScore > highestViewingDistanceScore)
        highestViewingDistanceScore = viewingScore;
    }
  }

  console.log("highestPos", highestPos);

  return highestViewingDistanceScore;
}
