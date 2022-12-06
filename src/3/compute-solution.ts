import { readFileSync } from "fs";
import {
  computeRucksackPriority,
  intersectListItems,
  priorityDictionary,
} from "./rucksack-regorg";
/**
 * 0) split rucksacks
 * 1) split into compartments
 * 2) compute rucksack priority score
 * 3) sum rucksack priority score
 */
export function firstHalf(textInput?: string): number {
  const input = textInput ?? readFileSync("./src/3/input.txt", "utf-8");
  const splitList = input.split(/\n/g);
  const rucksackList = splitList.map((r) => r.replace(/[\n\r]+/g, ""));
  const priorityScoreOfEachRucksack = rucksackList.map((r) =>
    computeRucksackPriority(r),
  );
  const totalPriority = priorityScoreOfEachRucksack.reduce((c, p) => c + p, 0);

  console.log("first half result:", totalPriority);
  return totalPriority;
}

firstHalf();

export function secondHalf(textInput?: string): number {
  const input = textInput ?? readFileSync("./src/3/input.txt", "utf-8");
  const splitList = input.split(/\n/g);
  const rucksackList = splitList.map((r) => r.replace(/[\n\r]+/g, ""));
  let totalPriority = 0;

  for (let i = 0; i < rucksackList.length; i += 3) {
    const intersectingTypes = intersectListItems([
      rucksackList[i].split(""),
      rucksackList[i + 1].split(""),
      rucksackList[i + 2].split(""),
    ]);
    const priorityScoreList = Array.from(intersectingTypes).map(
      (t) => priorityDictionary[t],
    );
    const total = priorityScoreList.reduce((c, p) => c + p, 0);
    totalPriority += total;
    // const priorityScoreOfEachRucksack = .map((r) => computeRucksackPriority(r))
  }

  console.log("second half result:", totalPriority);
  return totalPriority;
}

secondHalf();
