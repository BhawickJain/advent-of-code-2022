import {
  getInventories,
  getMaxCaloriesFromPuzzleInput,
  maxCaloriesCarried,
  parseInventory,
  sumListOfNumbers,
} from "./calorie-counting";

test("Can extract the a list of inventories from puzzle input", () => {
  const data = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`;

  const expectedResult = [
    `1000
2000
3000`,
    `4000`,
    `5000
6000`,
    `7000
8000
9000`,
    `10000`,
  ];

  expect(getInventories(data)).toStrictEqual(expectedResult);
});

test("Get max calories found in inventory from a list of total calories for each inventory", () => {
  const data = [100, 200, 400, 60, 70, 900];

  const expectedResult = [900];

  expect(maxCaloriesCarried(data)).toStrictEqual(expectedResult);
});

test("Parse a Calories Inventory into a list of calories of number[] type", () => {
  const data = `1000
2000
3000`;
  const expectedResult = [1000, 2000, 3000];

  expect(parseInventory(data)).toStrictEqual(expectedResult);
});

test("Gets Sum from a list of numbers", () => {
  const list = [50, 50, 50];

  expect(sumListOfNumbers(list)).toBe(150);
});

test("Returns max calories from day-1 puzzle input", () => {
  const data = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`;

  expect(getMaxCaloriesFromPuzzleInput(data)).toStrictEqual([24000, 45000]);
});
