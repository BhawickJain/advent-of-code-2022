import { readFileSync } from "fs";
import { uniqueOccDict } from "./tuning-trouble";
/**
 * 1) initialise an occurances dictionary with the first 4 letters in input
 * 2) set tail index at index 0 and set head index to index 3
 * 3) while dictionary unique keys count is not 4
 * 3a) look up key according to value at tail pointer
 * 3b) delete (if count was 1) or decrement (count > 1) from occurance dict
 * 3c) move head and tail pointer by +1
 * 3d) if value at any poiner undefined break loop
 * 3d) register value at head to occurance dictionary
 * 4) check if occurance dictionary has 4 unique keys
 * 5) if not, return null
 * 6) return tail-index pointer to mark the beginning of first unique 4 letter string
 * @param input day-6 input
 */
export function firstHalf(input?: string): number {
  if (!input) input = readFileSync("./src/6/input.txt", "utf-8");
  const occ = new uniqueOccDict();
  input
    .slice(0, 4)
    .split("")
    .forEach((c) => occ.add(c));
  let tail = 0;
  let head = 3;
  while (occ.uniques() !== 4) {
    const lastKey = input[tail];
    occ.remove(lastKey);
    tail += 1;
    head += 1;
    if (head >= input.length || tail >= input.length) break;
    occ.add(input[head]);
  }

  if (occ.uniques() !== 4) return -1;
  return head + 1;
}

export function secondHalf(input?: string): number {
  if (!input) input = readFileSync("./src/6/input.txt", "utf-8");
  const occ = new uniqueOccDict();
  input
    .slice(0, 14)
    .split("")
    .forEach((c) => occ.add(c));
  let tail = 0;
  let head = 13;
  while (occ.uniques() !== 14) {
    const lastKey = input[tail];
    occ.remove(lastKey);
    tail += 1;
    head += 1;
    if (head >= input.length || tail >= input.length) break;
    occ.add(input[head]);
  }

  if (occ.uniques() !== 14) return -1;
  return head + 1;
}
