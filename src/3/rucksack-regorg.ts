export function splitIntoCompartments(rucksack: string): [string, string] {
  const midpointlength = Math.floor(rucksack.length / 2);
  return [rucksack.slice(0, midpointlength), rucksack.slice(midpointlength)];
}

export function intersectListItems(listOfListItems: string[][]): Set<string> {
  const occurances = listOfListItems.map((l) => occurancesCount(l));
  const occurancesKeyCount = occurances.map(
    (l) => Array.from(Object.keys(l)).length,
  );
  const indexOfMax = occurancesKeyCount.findIndex(
    (el) => el === Math.max(...occurancesKeyCount),
  );
  const remainingOccuranceLists = [
    ...occurances.slice(0, indexOfMax),
    ...occurances.slice(indexOfMax + 1),
  ];
  const intersectingTypes: Set<string> = new Set([]);

  for (const t in occurances[indexOfMax]) {
    for (const _ of remainingOccuranceLists) {
      if (remainingOccuranceLists.every((l) => l[t])) {
        intersectingTypes.add(t);
      }
    }
  }

  return intersectingTypes;
}

export function occurancesCount(list: string[]): Record<string, number> {
  const occurances: Record<string, number> = {};

  for (const el of list) {
    const previous = occurances[el];
    const current = previous ? previous + 1 : 1;
    occurances[el] = current;
  }

  return occurances;
}

export function computePriority(): Record<string, number> {
  const priorityDictionary: Record<string, number> = {};
  // lowercase priorities: 1-26 ascii: 97-122
  for (let i = 1; i <= 26; i++) {
    priorityDictionary[String.fromCharCode(i + 96)] = i;
  }

  // lowercase priorities: 27-52 ascii: 65-90
  for (let i = 27; i <= 52; i++) {
    priorityDictionary[String.fromCharCode(i + 38)] = i;
  }

  return priorityDictionary;
}

export const priorityDictionary = computePriority();

/**
 * return priority score of rucksack
 * 1) split into compartments
 * 2) create list of intersection types across compartments
 * 3) calculate list of priorties
 * 4) calculate total priority of the rucksack
 * @param rucksack
 * @returns priority score of rucksack
 */
export function computeRucksackPriority(rucksack: string): number {
  const compartments = splitIntoCompartments(rucksack);
  const intersectingTypes = intersectListItems([
    compartments[0].split(""),
    compartments[1].split(""),
  ]);
  const priorityList = Array.from(intersectingTypes).map(
    (t) => priorityDictionary[t],
  );
  const totalPriority = priorityList.reduce((c, p) => c + p, 0);

  return totalPriority;
}
