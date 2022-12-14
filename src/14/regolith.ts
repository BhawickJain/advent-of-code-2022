import { readFileSync } from "fs";
export type RegMap = string[][];
export type Pos = { y: number; x: number };

export function parsePath(path: string): Pos[] {
  const cornerList = path.split(" -> ");
  const cornerPosList: Pos[] = cornerList.map((c) => ({
    y: parseInt(c.split(",")[1]),
    x: parseInt(c.split(",")[0]),
  }));
  const rockPosList: Pos[] = [];

  let posA: Pos | undefined = cornerPosList.pop();
  let posB: Pos | undefined = cornerPosList.pop();
  while (cornerPosList.length + 1) {
    if (!posA || !posB) break;
    rockPosList.push(...interpolateBetweenPoints(posA, posB));
    posA = JSON.parse(JSON.stringify(posB));
    posB = cornerPosList.pop();
  }

  return rockPosList;
}

export function getCaveDim(scanPos: Pos[]): {
  width: number;
  depth: number;
  startPos: Pos;
} {
  const xRange = scanPos.map((p) => p.x);
  const yRange = scanPos.map((p) => p.y);
  const xMin = Math.min(...xRange);
  const yMin = Math.min(...yRange);
  const xMax = Math.max(...xRange);
  const yMax = Math.max(...yRange);
  const width = xMax - xMin + 1;
  const depth = yMax - yMin + 1;
  const startPos: Pos = { x: xMin, y: yMin };
  return { width: width, depth: depth, startPos: startPos };
}

export class Cave {
  infiniteFloor = false;
  width: number;
  depth: number;
  startPos: Pos;
  cave: string[][] = [];
  constructor(
    width: number,
    depth: number,
    startPos: Pos,
    infiniteFloor?: boolean,
  ) {
    this.width = width;
    this.depth = depth;
    this.startPos = startPos;
    this.generateCave();
    if (infiniteFloor) this.infiniteFloor = infiniteFloor;
  }

  generateCave() {
    const xRange = [...Array(this.width)].map((_, i) => i);
    const yRange = [...Array(this.depth)].map((_, i) => i);
    for (const y of yRange) {
      const row: string[] = [];
      for (const x of xRange) {
        row.push(".");
      }
      this.cave.push(row);
    }
  }

  checkIndicesOutOfBounds(pos: Pos): boolean {
    const x = pos.x - this.startPos.x;
    const y = pos.y - this.startPos.y;
    return x < 0 || y < 0 || x >= this.width || y >= this.depth;
  }

  transformToIndices(pos: Pos): Pos {
    const x = pos.x - this.startPos.x;
    const y = pos.y - this.startPos.y;
    if (x < 0 || y < 0 || x >= this.width || y >= this.depth)
      throw new Error(`position (${pos.x}, ${pos.y}) out of bounds`);
    return { x: x, y: y };
  }

  addFeature(pos: Pos, feature: string) {
    const { x, y } = this.transformToIndices(pos);
    this.cave[y][x] = feature;
  }

  getFeature(pos: Pos): string {
    const { x, y } = this.transformToIndices(pos);
    return this.cave[y][x];
  }

  look() {
    for (const d in this.cave) [console.log(this.cave[d].join(""))];
  }
}

export function interpolateBetweenPoints(posA: Pos, posB: Pos): Pos[] {
  const interpolatedPoints: Pos[] = [];
  const yRange = [...Array(Math.abs(posB.y - posA.y) + 1)].map(
    (_, i) => i * Math.sign(posB.y - posA.y) + posA.y,
  );
  const xRange = [...Array(Math.abs(posB.x - posA.x) + 1)].map(
    (_, i) => i * Math.sign(posB.x - posA.x) + posA.x,
  );
  for (const y of yRange) {
    for (const x of xRange) {
      interpolatedPoints.push({ y: y, x: x });
    }
  }
  return interpolatedPoints;
}

export function parseInput(input?: string): Pos[] {
  if (!input) input = readFileSync("./src/14/input.txt", "utf-8");
  const pathStrings: string[] = input.split("\n");
  const rockPos: Pos[] = pathStrings
    .map((p) => parsePath(p))
    .reduce((rockPosList, posList) => [...rockPosList, ...posList], []);
  return rockPos;
}

export function simulate(cave: Cave, sandSource: Pos): Cave {
  let flow = false;
  let numberOfSandUnitsDispensed = 0;

  for (const i in [...Array(48500)].map((e, i) => i)) {
    if (flow === true) {
      break;
    } else {
      numberOfSandUnitsDispensed += 1;
    }
    [cave, flow] = simulateUnitOfSand(cave, sandSource);
  }

  console.log(
    "total number in the cave (ex. the one stuck in the spout):",
    numberOfSandUnitsDispensed - 1,
  );

  return cave;
}

export function simulateUnitOfSand(
  cave: Cave,
  sandSource: Pos,
): [Cave, boolean] {
  let currPos: Pos = JSON.parse(JSON.stringify(sandSource));
  let below = { x: currPos.x, y: currPos.y + 1 };
  let belowLeft = { x: currPos.x - 1, y: currPos.y + 1 };
  let belowRight = { x: currPos.x + 1, y: currPos.y + 1 };
  let outOfBounds = [below, belowLeft, belowRight].some((b) =>
    cave.checkIndicesOutOfBounds(b),
  );

  if (isObstructed(currPos, cave)) {
    console.log("sand particle stuck in spout");
    return [cave, true];
  }

  while (true) {
    below = { x: currPos.x, y: currPos.y + 1 };
    belowLeft = { x: currPos.x - 1, y: currPos.y + 1 };
    belowRight = { x: currPos.x + 1, y: currPos.y + 1 };
    outOfBounds = cave.checkIndicesOutOfBounds(currPos);
    if (outOfBounds) break;
    if (cave.checkIndicesOutOfBounds(below) || !isObstructed(below, cave)) {
      currPos = below;
      continue;
    }
    if (
      cave.checkIndicesOutOfBounds(belowLeft) ||
      !isObstructed(belowLeft, cave)
    ) {
      currPos = belowLeft;
      continue;
    }
    if (
      cave.checkIndicesOutOfBounds(belowRight) ||
      !isObstructed(belowRight, cave)
    ) {
      currPos = belowRight;
      continue;
    }
    cave.addFeature(currPos, "o");
    return [cave, false];
  }

  return [cave, true];
}

export function isObstructed(pos: Pos, cave: Cave) {
  const object = cave.getFeature(pos);
  switch (object) {
    case "o":
      return true;
    case "+":
      return false;
    case ".":
      return false;
    case "#":
      return true;
    default:
      throw new Error(`unknown obstruction found: ${object}`);
  }
}
