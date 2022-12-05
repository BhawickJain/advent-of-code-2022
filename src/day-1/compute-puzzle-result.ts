import { getMaxCaloriesFromPuzzleInput } from "./calorie-counting";
import { readFileSync } from "fs";

async function compute(): Promise<void> {
  const puzzleInput = readFileSync("./src/day-1/input.txt", "utf-8");
  const puzzleResult = getMaxCaloriesFromPuzzleInput(puzzleInput);
  console.log(puzzleResult);
}

compute();
