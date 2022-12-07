import { firstHalf, secondHalf } from "./computeSolution";
import { uniqueOccDict } from "./tuning-trouble";

test("returns the first char position of unique 4 letter string in datasteam", () => {
  expect(firstHalf("bvwbjplbgvbhsrlpgdmjqwftvncz")).toBe(5);
  expect(firstHalf("mjqjpqmgbljsphdztnvjfqwrcgsmlb")).toBe(7);
  expect(firstHalf("nppdvjthqldpwncqszvftbrmjlhg")).toBe(6);
  expect(firstHalf("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg")).toBe(10);
  expect(firstHalf("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw")).toBe(11);
  console.log("first half result:", firstHalf());
});

test("returns the second char position of unique 4 letter string in datasteam", () => {
  expect(secondHalf("mjqjpqmgbljsphdztnvjfqwrcgsmlb")).toBe(19);
  expect(secondHalf("bvwbjplbgvbhsrlpgdmjqwftvncz")).toBe(23);
  expect(secondHalf("nppdvjthqldpwncqszvftbrmjlhg")).toBe(23);
  expect(secondHalf("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg")).toBe(29);
  expect(secondHalf("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw")).toBe(26);
  console.log("second half result:", secondHalf());
});

test("occuranceDict can correctly add, remove item counts and track lengths", () => {
  const occ = new uniqueOccDict();
  expect(occ).toBeInstanceOf(uniqueOccDict);
  expect(occ.uniques()).toBe(0);

  occ.add("a");
  expect(occ.uniques()).toBe(1);

  occ.add("a");
  expect(occ.uniques()).toBe(0);

  occ.add("a");
  expect(occ.uniques()).toBe(0);

  occ.remove("a");
  expect(occ.uniques()).toBe(0);

  occ.remove("a");
  expect(occ.uniques()).toBe(1);

  occ.add("b");
  expect(occ.uniques()).toBe(2);

  occ.add("c");
  expect(occ.uniques()).toBe(3);

  occ.add("d");
  expect(occ.uniques()).toBe(4);

  occ.add("e");
  expect(occ.uniques()).toBe(5);

  occ.add("e");
  expect(occ.uniques()).toBe(4);

  occ.remove("a");
  expect(occ.uniques()).toBe(3);
});
