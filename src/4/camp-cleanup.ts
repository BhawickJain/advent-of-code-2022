/**
 * return a structured pair of assignments
 * @param pair serialised string of pair
 */
export function parseAssignmentPairString(
  pair: string,
): [[number, number], [number, number]] {
  const matches = Array.from(pair.matchAll(/(\d+)-(\d+),(\d+)-(\d+)/g))[0]; // one match expected
  return [
    [parseInt(matches[1]), parseInt(matches[2])],
    [parseInt(matches[3]), parseInt(matches[4])],
  ];
}

export function getFullyContainedPair(
  pairA: [number, number],
  pairB: [number, number],
): number | null {
  const isPairAContained = pairA[0] >= pairB[0] && pairA[1] <= pairB[1];
  if (isPairAContained) {
    return 0;
  }

  const isPairBContained = pairB[0] >= pairA[0] && pairB[1] <= pairA[1];
  if (isPairBContained) {
    return 1;
  }

  return null;
}

/**
 * returns 0, or 1 if first pair or second pair any overlap with the other, respectively
 * return is eager, so the very criteria of satifaction (fully container, then partial contained) will return a result
 * @param pairA [number, number]
 * @param pairB [number, number]
 * @returns 0 for pairA overlapping within pairB, 1 for pairB overlapping within pairA
 */
export function getAnyOverlapPair(
  pairA: [number, number],
  pairB: [number, number],
): number | null {
  const fullyContained = getFullyContainedPair(pairA, pairB);
  if (fullyContained !== null) return fullyContained;

  // check for any overlap

  const isPairARangesOverlapping =
    withinRange(pairB[0], pairB[1], pairA[0]) ||
    withinRange(pairB[0], pairB[1], pairA[1]);
  if (isPairARangesOverlapping) {
    return 0;
  }

  const isPairBRangesOverlapping =
    withinRange(pairA[0], pairA[1], pairB[0]) ||
    withinRange(pairA[0], pairA[1], pairB[1]);
  if (isPairBRangesOverlapping) {
    return 1;
  }

  return null;
}

/**
 * return whether a value is within range (all inclusive)
 * @param min minimum value of range
 * @param max maximum value of range
 * @param value value to be check if within range
 * @returns boolean
 */
function withinRange(min: number, max: number, value: number): boolean {
  return value >= min && value <= max;
}
