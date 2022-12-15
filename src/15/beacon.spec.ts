import {
  manhattenDistance,
  parseInput,
  Pos,
  SensorBeaconPair,
  serialisePosition,
  subtractRange,
  tuningFrequency,
} from "./beacon";

/**
 * 1) calculate the manhatten distance between sensor and closest beacon
 * 2) take one position along target row
 * 3) check position is  known beacon, if so continue to next position
 * 4) calculate manhatten distance to all sensors to that position
 * 5) check if respective manhatten distance is less than or equal than sensor's distnace to its beacon
 * 6) if true, there can't be a beacon there, else its possible
 * 7) repeat from (2) until all positions read
 */
test("can parse input into an array of Sensor and nearest beacon positions", () => {
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

  const { sensorBeaconPairs, xMin, xMax } = parseInput(dataA);
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
  const noBeaconPosList: Pos[] = [];
  const targetY = 10;
  for (const x of [...Array(Math.abs(xMax - xMin + 1))].map(
    (_, i) => xMin + i,
  )) {
    const candPos: Pos = { x: x, y: targetY };
    const withinManhattenDistanceOfSensor = sensorBeaconPairs.some((sb) => {
      const manhattenCand = manhattenDistance(candPos, sb.s);
      const withinDistanceOfSensor =
        manhattenCand <= sensorManhattenFromBeacon[serialisePosition(sb.s)];
      // if (x===25) {console.log(x, withinDistanceOfSensor, sb.s, manhattenCand, sensorManhattenFromBeacon[serialisePosition(sb.s)])}
      return withinDistanceOfSensor;
    });
    // console.log(candPos, posDictionary[serialisePosition(candPos)])
    const objectAlreadyKnownAtPosition =
      posDictionary[serialisePosition(candPos)] !== undefined;
    !objectAlreadyKnownAtPosition &&
      withinManhattenDistanceOfSensor &&
      noBeaconPosList.push(candPos);
  }
  console.log(noBeaconPosList.length);
});

test.skip("can subtract ranges", () => {
  expect(subtractRange([-2, 2], [0, 0])).toStrictEqual([
    [-2, -1],
    [1, 2],
  ]);
  expect(subtractRange([-2, 2], [-3, 3])).toStrictEqual([]);
  expect(subtractRange([-2, 2], [-2, 2])).toStrictEqual([]);
  expect(subtractRange([-2, 2], [-3, 0])).toStrictEqual([[1, 2]]);
  expect(subtractRange([-2, 2], [0, 3])).toStrictEqual([[-2, -1]]);
  expect(subtractRange([-2, 2], [0, 3])).toStrictEqual([[-2, -1]]);
  expect(subtractRange([-2, 2], [-4, -3])).toStrictEqual([[-2, -2]]);
});

test("can parse input into an array of Sensor and nearest beacon positions", () => {
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

  const { sensorBeaconPairs, xMin, xMax } = parseInput(dataA);
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
  // const max = 4000000
  const max = 20;
  const candPosList: string[] = [];
  const min = 0;
  for (const y of [...Array(Math.abs(min - max + 1))].map((_, i) => min + i)) {
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
        possibleBeacon.push(candPos) &&
        console.log(candPos, tuningFrequency(candPos));
      if (possibleBeacon.length > 0) break;
    }
    if (possibleBeacon.length > 0) break;
  }
  // console.log(candPosList.length)
  console.log(
    possibleBeacon,
    possibleBeacon.map((b) => tuningFrequency(b)),
  );
});
