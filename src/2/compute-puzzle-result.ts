import { readFileSync } from "fs";
import {
  decryptionKeys,
  decryptionKeysPartTwo,
  roundScoreDictionary,
  serialisedRoundOutcome,
} from "./rock-paper-scissors";

function firstHalf(): number {
  const input = readFileSync("./src/2/input.txt", "utf-8");

  const roundList = input.split("\n");
  const decryptedRoundList = roundList.map(
    (r) => decryptionKeys[r[0]] + decryptionKeys[r[2]],
  );
  const secondPlayerScoreList = decryptedRoundList.map(
    (r) => roundScoreDictionary[r.split("").reverse().join("")],
  );
  const totalScore = secondPlayerScoreList.reduce((a, b) => a + b);

  console.log("first half:", totalScore);
  return totalScore;
}

firstHalf();

export function secondHalf(textInput?: string): number {
  const input = textInput ?? readFileSync("./src/2/input.txt", "utf-8");
  const roundList = input.split("\n");
  const decryptFirstPlayer = roundList.map((r) => decryptionKeys[r[0]] + r[2]);
  const decryptedRoundList = decryptFirstPlayer.map(
    (r) => r[0] + serialisedRoundOutcome[decryptionKeysPartTwo[r[1]]][r[0]],
  );
  const secondPlayerScoreList = decryptedRoundList.map(
    (r) => roundScoreDictionary[r.split("").reverse().join("")],
  );
  const totalScore = secondPlayerScoreList.reduce((a, b) => a + b);

  console.log("second half:", totalScore);
  return totalScore;
}

secondHalf();
