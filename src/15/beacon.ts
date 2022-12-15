import { readFileSync } from "fs";
export type Pos = { x: number; y: number };
export type SensorBeaconPair = { s: Pos; b: Pos };

// export function allPossibleBeaconPositions(sensorPos: Pos, manhattenDistance: number): Pos[] {

// }

export function manhattenDistance(pos1: Pos, pos2: Pos): number {
  return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
}

export function parseInput(input?: string): {
  sensorBeaconPairs: SensorBeaconPair[];
  xMin: number;
  xMax: number;
} {
  if (!input) input = readFileSync("./src/15/input.txt", "utf-8");
  const lines = input.split("\n");
  const coordArrayList = lines.map((l) =>
    Array.from(l.matchAll(/-?\d+/g)).map((c) => parseInt(c[0])),
  );
  const sbPosArray: SensorBeaconPair[] = coordArrayList.map((m) => ({
    s: { x: m[0], y: m[1] },
    b: { x: m[2], y: m[3] },
  }));
  const xList: number[] = [];
  coordArrayList.forEach((a) => xList.push(a[0], a[2]));
  // console.log(coordArrayList)
  return {
    sensorBeaconPairs: sbPosArray,
    xMin: Math.min(...xList),
    xMax: Math.max(...xList),
  };
}

export type serPos = string; // serialised position

export function parsePosition(serialisedPosition: serPos): Pos {
  const split = serialisedPosition.split("x")[1].split("y");
  return { x: parseInt(split[0]), y: parseInt(split[1]) };
}

export function serialisePosition(pos: Pos): serPos {
  return `x${pos.x}y${pos.y}`;
}

export function tuningFrequency(pos: Pos): number {
  return pos.x * 4000000 + pos.y;
}

export type range = [number, number];
export function subtractRange(r1: range, r2: range): range[] {
  if (r2[0] <= r1[0] && r1[1] <= r2[1]) {
    console.log(0);
    return [];
  }
  if (r2[0] < r1[0] && r2[1] < r1[0]) return [r1];
  if (r2[0] > r1[0] && r2[1] > r1[0]) return [r1];
  if (r2[0] > r1[0] && r2[1] <= r1[0]) return [r1];
  if (r2[0] <= r1[0] && r1[1] > r2[1]) {
    console.log(1);
    return [[r2[1] + 1, r1[1]]];
  }
  if (r2[0] > r1[0] && r1[1] <= r2[1]) {
    console.log(2);
    return [[r1[0], r2[0] - 1]];
  }
  if (r2[0] > r1[0] && r1[1] > r2[1]) {
    console.log(3);
    return [
      [r1[0], r2[1] - 1],
      [r2[1] + 1, r1[1]],
    ];
  }
  console.log(4);
  return [r1];
}

export function secondHalf() {
  const dataA = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`;

  const { sensorBeaconPairs, xMin, xMax } = parseInput();
  // console.log(sensorBeaconPairs, xMax, xMin)
  const posDictionary: { [pos: string]: string } = {};
  sensorBeaconPairs.forEach((sb) => {
    posDictionary[serialisePosition(sb.s)] = "s";
    posDictionary[serialisePosition(sb.b)] = "b";
  });
  const sensorManhattenFromBeacon: { [pos: string]: number } = {};
  // console.log(posDictionary)
  sensorBeaconPairs.forEach(
    (sb) =>
      (sensorManhattenFromBeacon[serialisePosition(sb.s)] = manhattenDistance(
        sb.s,
        sb.b,
      )),
  );
  // console.log(sensorManhattenFromBeacon)
  // ko
  const possibleBeacon: Pos[] = [];
  // const targetY = 2000000
  const max = 4000000;
  // const max = 20
  const candPosList: Pos[] = [];
  const min = 0;
  for (const y of [...Array(Math.abs(min - max + 1))].map((_, i) => min + i)) {
    console.log(y);
    for (const x of [...Array(Math.abs(max - min + 1))].map(
      (_, i) => min + i,
    )) {
      const candPos: Pos = { x: x, y: y };
      const withinManhattenDistanceOfSensor = sensorBeaconPairs.every((sb) => {
        const manhattenCand = manhattenDistance(candPos, sb.s);
        const withinDistanceOfSensor =
          manhattenCand > sensorManhattenFromBeacon[serialisePosition(sb.s)];
        // if (x===25) {console.log(x, withinDistanceOfSensor, sb.s, manhattenCand, sensorManhattenFromBeacon[serialisePosition(sb.s)])}
        return withinDistanceOfSensor;
      });
      // console.log(candPos, posDictionary[serialisePosition(candPos)])
      const objectAlreadyKnownAtPosition =
        posDictionary[serialisePosition(candPos)] !== undefined;
      !objectAlreadyKnownAtPosition &&
        withinManhattenDistanceOfSensor &&
        possibleBeacon.push(candPos);
    }
  }
  // console.log(candPosList.length)
  console.log(
    possibleBeacon,
    possibleBeacon.map((b) => tuningFrequency(b)),
  );
}

// secondHalf()
