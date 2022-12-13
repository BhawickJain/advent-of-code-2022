import { readFileSync } from "fs";

export type Packet = (number | Packet)[];
export type PacketPair = [Packet, Packet];

// testing types
const packetA: Packet = [[1], [2, 3, 4]];
const packetB: Packet = [[1], 4];
const packetC: Packet = [9];
const packetD: Packet = [[8, 7, 6]];
const packetE: Packet = [1, [2, [3, [4, [5, 6, 7]]]], 8, 9];
const packetF: Packet = [1, [2, [3, [4, [5, 6, 0]]]], 8, 9];
const packetG: Packet = [];
const packetH: Packet = [3];
const packetI: Packet = [[[]]];
const packetJ: Packet = [[]];

export function parsePacketStream(input?: string): PacketPair[] {
  if (!input) input = readFileSync("./src/13/input.txt", "utf-8");
  const serialPairs = input.split(/\n\n/g);
  const packetPairs: PacketPair[] = [];
  serialPairs.forEach((p) => {
    const [Left, Right] = p.split(/\n/g);
    // const onePair: PacketPair = [parseNestedList(Left)[0], parseNestedList(Right)[0]]
    const onePair: PacketPair = [JSON.parse(Left), JSON.parse(Right)];
    packetPairs.push(onePair);
  });
  return packetPairs;
}

export function extractItemsOfSerialisedList(serialisedList: string): string {
  const listItemsRegex = /\[(.*)\]/g;
  return Array.from(serialisedList.matchAll(listItemsRegex))[0][1];
}

/**
 * another option was to eval(stringified lists) but that would be a little dangerous
 * this parser is imperfect, passes all my tests but there are edges cases in the real data
 * TODO: find edge cases
 * used JSON.parse instead which maybe the author's intention
 * @param serialisedNestedList
 * @returns
 */
export function parseNestedList(
  serialisedNestedList: string,
): [Packet, number] {
  const packet: Packet = [];
  let idx = 1;
  while (idx < serialisedNestedList.length) {
    const char = serialisedNestedList[idx];
    if (/\d+/g.test(char)) {
      packet.push(parseInt(char));
      idx += 1;
      continue;
    }
    if (/\[/g.test(char)) {
      const [nestedPacket, newIdx] = parseNestedList(
        serialisedNestedList.slice(idx),
      );
      packet.push(nestedPacket);
      idx += newIdx;
      continue;
    }
    if (/\]/g.test(char)) {
      return [packet, idx + 1];
    }
    idx += 1;
  }
  return [packet, idx + 1];
}

export function isPacketPairInRightOrder(
  packetPair: PacketPair,
): boolean | null {
  let idx = 0;
  const left = packetPair[0];
  const right = packetPair[1];
  const length = Math.max(left.length, right.length);
  // console.log('compare:', left, 'vs', right)
  while (idx < length) {
    const iLeft = left[idx];
    const iRight = right[idx];
    // console.log('compare:', iLeft, 'vs', iRight)
    if (typeof iRight === "undefined") {
      return false;
    }
    if (typeof iLeft === "undefined") {
      return true;
    }
    if (typeof iLeft === "number" && typeof iRight === "number") {
      if (iLeft < iRight) return true;
    }
    if (typeof iLeft === "number" && typeof iRight === "number") {
      if (iLeft > iRight) return false;
    }
    if (Array.isArray(iLeft) && Array.isArray(iRight)) {
      const result = isPacketPairInRightOrder([
        iLeft as Packet,
        iRight as Packet,
      ]);
      if (result !== null) return result;
    }
    if (typeof iLeft === "number" && Array.isArray(iRight)) {
      const result = isPacketPairInRightOrder([[iLeft], iRight as Packet]);
      if (result !== null) return result;
    }
    if (Array.isArray(iLeft) && typeof iRight === "number") {
      const result = isPacketPairInRightOrder([iLeft as Packet, [iRight]]);
      if (result !== null) return result;
    }
    idx += 1;
  }
  return null;
}

export function firstHalf(input?: string): number {
  const listOfPacketPairs = parsePacketStream(input);
  const listOfRightOrder = listOfPacketPairs.map((pair) =>
    isPacketPairInRightOrder(pair),
  );
  // console.log(listOfRightOrder)
  const indexOfRightPair: number[] = [];
  listOfRightOrder.forEach(
    (o, idx) => o === true && indexOfRightPair.push(idx + 1),
  );
  // console.log(indexOfRightPair)
  return indexOfRightPair.reduce((a, b) => a + b);
}

export function secondHalf(input?: string): number {
  const listOfPacketPairs = parsePacketStream(input);
  const listOfPackets: Packet[] = [];
  listOfPacketPairs.forEach((p) => listOfPackets.push(p[0], p[1]));
  listOfPackets.push([[2]], [[6]]);
  const orderedList = listOfPackets.sort((left, right) =>
    isPacketPairInRightOrder([left, right]) ? -1 : 0,
  );
  const dividerIdxList: number[] = [];
  orderedList.forEach(
    (packet, idx) =>
      (JSON.stringify(packet) === JSON.stringify([[2]]) ||
        JSON.stringify(packet) === JSON.stringify([[6]])) &&
      dividerIdxList.push(idx + 1),
  );
  // console.log(dividerIdxList)
  return dividerIdxList.reduce((i, j) => i * j);
}
