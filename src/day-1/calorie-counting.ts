/**
 * Returns each inventory from the day-1 puzzle input as a single entry in an array
 * @param puzzleInput: text input provided by day-1 puzzle
 * @returns array of strings, each string representing a single inventory from an elf
 */
export function getInventories(puzzleInput: string): string[] {
  const inventories = puzzleInput.split("\n\n");
  return inventories;
}

/**
 * Returns max calories present in a list of calory inventory
 * @param ListOfCaloriesCarried list of total calories in each inventory
 * @returns max calories found in inventory
 */
export function maxCaloriesCarried(ListOfCaloriesCarried: number[], topN: number = 1): number[] {
  return ListOfCaloriesCarried.sort((a, b) => b - a).slice(0, topN);
}

/**
 * Returns a list of calories belonging to a single inventory
 * @param text string input of calories in an inventory
 * @returns a list of numbers, with entry being a list of calories
 */
export function parseInventory(text: string): number[] {
  const calories = text.split("\n");
  const numberCalories = calories.map((c) => parseInt(c));
  return numberCalories;
}

/**
 * Return the sum of a list of numbers
 * @param listOfNumbers list of numbers
 * @returns sum of the list of numbers
 */
export function sumListOfNumbers(listOfNumbers: number[]): number {
  return listOfNumbers.reduce((a, b) => a + b);
}

/**
 * Compute result of Day-1 Puzzle
 * @param puzzleInput: text input provided by day-1 puzzle
 * @returns max calories found in inventory
 */
export function getMaxCaloriesFromPuzzleInput(puzzleInput: string): number[] {
  const inventories = getInventories(puzzleInput);
  const parsedInventory = inventories.map((inv) => parseInventory(inv));
  const ListOfCaloriesCarried = parsedInventory.map((inv) =>
    sumListOfNumbers(inv),
  );
  const maxCalories = maxCaloriesCarried(ListOfCaloriesCarried)[0];
	const topThreeSum = maxCaloriesCarried(ListOfCaloriesCarried, 3).reduce((a, b) => a + b)
  return [maxCalories, topThreeSum];
}
