export type Pos = { x: number; y: number };
export function getSearchSpace(scan: number[][]): [Pos, Pos] {
  const startTreePos: Pos = { x: 1, y: 1 };
  const endTreePos: Pos = { x: scan[0].length - 2, y: scan.length - 2 };
  return [startTreePos, endTreePos];
}

export function getEdgePositions(scan: number[][]): number {
  return scan.length * 2 + scan[0].length * 2 - 4;
}

export function getAdjacentTrees(
  x: number,
  y: number,
  scan: number[][],
): [number, number, number, number] {
  const left: number = scan[y][x - 1];
  const right: number = scan[y][x + 1];
  const top: number = scan[y - 1][x];
  const bottom: number = scan[y + 1][x];
  return [left, right, top, bottom];
}

export function preprocessScan(scan: string): number[][] {
  const split = scan.split(/\n/g);
  const trees = split.map((r) => r.split("").map((s) => parseInt(s)));
  return trees;
}

export function pivotArray(arr: number[][]): number[][] {
  const pivotted: number[][] = [...Array(arr[0].length)].map((c) => []);
  for (const row of arr) {
    row.forEach((v, c) => pivotted[c].push(v));
  }
  return pivotted;
}

export function largestInEitherSide(arr: number[], target: number): boolean {
  // console.log('target', arr[target])
  const sideA = arr.slice(0, target);
  const sideB = arr.slice(target + 1);
  const isLargestOnSideA = sideA.every((v) => arr[target] > v);
  const isLargestOnSideB = sideB.every((v) => arr[target] > v);
  return isLargestOnSideA || isLargestOnSideB;
}

export function viewingDistanceAlongArray(
  arr: number[],
  targetIdx: number,
): number {
  const sideA = arr.slice(0, targetIdx).reverse();
  const sideB = arr.slice(targetIdx + 1);

  // console.log('sideA', sideA)
  // console.log('sideB', sideB)
  const sideAScore = calculateViewingDistance(sideA, arr[targetIdx]);
  const sideBScore = calculateViewingDistance(sideB, arr[targetIdx]);

  return sideAScore * sideBScore;
}

function calculateViewingDistance(side: number[], target: number): number {
  let sideScore = 0;
  for (let i = 0; i < side.length; i++) {
    sideScore += 1;
    if (side[i] >= target) break;
  }
  return sideScore;
}
