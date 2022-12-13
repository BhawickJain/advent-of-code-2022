import {
  extractItemsOfSerialisedList,
  firstHalf,
  isPacketPairInRightOrder,
  Packet,
  PacketPair,
  parseNestedList,
  parsePacketStream,
  secondHalf,
} from "./packets";

test("can parse input into list of pairs", () => {
  const dataA = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]`;
  const expectedAnswer = [
    [
      [1, 1, 3, 1, 1],
      [1, 1, 5, 1, 1],
    ],
    [
      [[1], [2, 3, 4]],
      [[1], 4],
    ],
    [[9], [[8, 7, 6]]],
  ];
  expect(parsePacketStream(dataA)).toStrictEqual(expectedAnswer);
});

test("can extract items from the serialised list", () => {
  const dataA = `[1,1,5,1,1]`;
  const dataJ = `[1,[2,[3,[4,[5,6,7]]]],8,9]`;
  expect(extractItemsOfSerialisedList(dataA)).toBe(`1,1,5,1,1`);
  expect(extractItemsOfSerialisedList(dataJ)).toBe(`1,[2,[3,[4,[5,6,7]]]],8,9`);
});

test("can parse serialised nested list", () => {
  const dataA: Packet = [1, 1, 3, 1, 1];
  const dataB: Packet = [1, 1, 5, 1, 1];
  const dataC: Packet = [[1], [2, 3, 4]];
  const dataD: Packet = [[1], 4];
  const dataE: Packet = [9];
  const dataF: Packet = [[8, 7, 6]];
  const dataG: Packet = [[4, 4], 4, 4];
  const dataH: Packet = [[4, 4], 4, 4, 4];
  const dataI: Packet = [7, 7, 7, 7];
  const dataJ: Packet = [7, 7, 7];
  const dataK: Packet = [];
  const dataL: Packet = [3];
  const dataM: Packet = [[[]]];
  const dataN: Packet = [[]];
  const dataO: Packet = [1, [2, [3, [4, [5, 6, 7]]]], 8, 9];

  expect(parseNestedList(`[1,1,3,1,1]`)[0]).toStrictEqual(dataA);
  expect(parseNestedList(`[1,1,5,1,1]`)[0]).toStrictEqual(dataB);
  expect(parseNestedList(`[[1],[2,3,4]]`)[0]).toStrictEqual(dataC);
  expect(parseNestedList(`[[1],4]`)[0]).toStrictEqual(dataD);
  expect(parseNestedList(`[9]`)[0]).toStrictEqual(dataE);
  expect(parseNestedList(`[[8,7,6]]`)[0]).toStrictEqual(dataF);
  expect(parseNestedList(`[[4,4],4,4]`)[0]).toStrictEqual(dataG);
  expect(parseNestedList(`[[4,4],4,4,4]`)[0]).toStrictEqual(dataH);
  expect(parseNestedList(`[7,7,7,7]`)[0]).toStrictEqual(dataI);
  expect(parseNestedList(`[7,7,7]`)[0]).toStrictEqual(dataJ);
  expect(parseNestedList(`[]`)[0]).toStrictEqual(dataK);
  expect(parseNestedList(`[3]`)[0]).toStrictEqual(dataL);
  expect(parseNestedList(`[[[]]]`)[0]).toStrictEqual(dataM);
  expect(parseNestedList(`[[]]`)[0]).toStrictEqual(dataN);
  expect(parseNestedList(`[1,[2,[3,[4,[5,6,7]]]],8,9]`)[0]).toStrictEqual(
    dataO,
  );
  expect(JSON.parse(`[1,[2,[3,[4,[5,6,7]]]],8,9]`)).toStrictEqual(dataO);
});

test("can evaluate a pair of packets of having the right / wrong order", () => {
  const PairA: PacketPair = [
    [1, 1, 3, 1, 1],
    [1, 1, 5, 1, 1],
  ];
  expect(isPacketPairInRightOrder(PairA)).toBe(true);

  const PairB: PacketPair = [
    [[1], [2, 3, 4]],
    [[1], 4],
  ];
  expect(isPacketPairInRightOrder(PairB)).toBe(true);

  const PairC: PacketPair = [[9], [[8, 7, 6]]];
  expect(isPacketPairInRightOrder(PairC)).toBe(false);

  const PairD: PacketPair = [
    [[4, 4], 4, 4],
    [[4, 4], 4, 4, 4],
  ];
  expect(isPacketPairInRightOrder(PairD)).toBe(true);

  const PairE: PacketPair = [
    [7, 7, 7, 7],
    [7, 7, 7],
  ];
  expect(isPacketPairInRightOrder(PairE)).toBe(false);

  const PairF: PacketPair = [[], [3]];
  expect(isPacketPairInRightOrder(PairF)).toBe(true);

  const PairG: PacketPair = [[[[]]], [[]]];
  expect(isPacketPairInRightOrder(PairG)).toBe(false);

  const PairH: PacketPair = [
    [1, [2, [3, [4, [5, 6, 7]]]], 8, 9],
    [1, [2, [3, [4, [5, 6, 0]]]], 8, 9],
  ];
  expect(isPacketPairInRightOrder(PairH)).toBe(false);

  const PairI: PacketPair = [
    [[3]],
    [
      [2, [], []],
      [
        [5, 8, [6]],
        [[0, 6, 8, 10], []],
        [[9, 6], 6, 8],
      ],
      [[], 4, 2, [0, [1, 4, 2, 7], 6], [0, 7]],
    ],
  ];
  expect(isPacketPairInRightOrder(PairI)).toBe(false);

  const PairJ: PacketPair = [
    [
      [6, 8],
      [
        [9, [2, 0, 7], 4, 10],
        [[0, 2, 10, 6, 4], 8, [7, 7, 2, 8, 7]],
      ],
      [],
      [6, []],
      [[[3, 0, 6]]],
    ],
    [
      [
        9,
        [[], [1, 6, 1, 0, 6], [8], [2]],
        [8, [2, 5, 10, 0, 10], 1, [7], [6, 5]],
      ],
      [2, [9, 0, [1, 5, 5, 0, 8]], 9, 2],
      [],
    ],
  ];
  expect(isPacketPairInRightOrder(PairJ)).toBe(true);

  const PairK: PacketPair = [[[[[], [7], [2, 5]], 3], [4, 1, 1, 6], []], [[]]];
  expect(isPacketPairInRightOrder(PairK)).toBe(false);
});

test("can evaluate a list of packet pairs and return a list of booleans for right order", () => {
  const mockData = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`;

  expect(firstHalf(mockData)).toBe(13);
  console.log("first half with real data:", firstHalf());
});

test("can evaluate a list of packet pairs and return a decoder key for its ordered version", () => {
  const mockData = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`;

  expect(secondHalf(mockData)).toBe(140);
  console.log("second half with real data:", secondHalf());
});
