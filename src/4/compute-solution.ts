import { readFileSync } from "fs";
import {
  getFullyContainedPair,
  getAnyOverlapPair,
  parseAssignmentPairString,
} from "./camp-cleanup";

export function firstHalf(manualInput?: string): number {
  const input = manualInput ?? readFileSync("./src/4/input.txt", "utf-8");
  const serialisedPairList = input.split(/\n/g);
  const assignmentPairList = serialisedPairList.map((p) =>
    parseAssignmentPairString(p),
  );
  const fullyContainedCheckList = assignmentPairList.map((p) =>
    getFullyContainedPair(...p),
  );
  const countFullyContained = fullyContainedCheckList.filter(
    (c) => c != null,
  ).length;
  console.log("first half result:", countFullyContained);
  return countFullyContained;
}

export function secondHalf(manualInput?: string): number {
  const input = manualInput ?? readFileSync("./src/4/input.txt", "utf-8");
  const serialisedPairList = input.split(/\n/g);
  const assignmentPairList = serialisedPairList.map((p) =>
    parseAssignmentPairString(p),
  );
  const anyOverlappingPair = assignmentPairList.map((p) =>
    getAnyOverlapPair(...p),
  );
  const countAnyOverlapping = anyOverlappingPair.filter(
    (c) => c != null,
  ).length;
  console.log("second half result:", countAnyOverlapping);
  return countAnyOverlapping;
}
