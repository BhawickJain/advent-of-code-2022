export type Crate = number;
export type Move = {
  numberOfCrates: number;
  from: Crate;
  to: Crate;
};

export function parseSupplyStacksInput(puzzleInput: string): [string, string] {
  const parsed = puzzleInput.split(/\n\n/g);
  if (parsed.length !== 2)
    throw "unexpected input: array of two elements (stack, moves) expected";
  return [parsed[0], parsed[1]];
}

export function parseSerialisedStack(serialisedStack: string): string[][] {
  const listOfSerialisedStacks = serialisedStack.split("\n");
  if (listOfSerialisedStacks.length < 1) return [[""]];
  const numberOfArrays = listOfSerialisedStacks.pop()?.match(/\d+/g)?.length;
  const arrayOfSupplies = [...Array(numberOfArrays)].map(
    () => new Array<string>(),
  );
  const stackItemRegex = /(\[[A-Z]\]|\W{3})\s?/g;
  for (const l of listOfSerialisedStacks) {
    const groups = Array.from(l.matchAll(stackItemRegex)).map((m) => m[1]);
    const values = groups.map((g) => g[1]);
    values.forEach((v, i) => v !== " " && arrayOfSupplies[i].unshift(v));
    // console.log(arrayOfSupplies)
  }
  return arrayOfSupplies;
}

export function parseSerialsedMove(serialisedMove: string): Move {
  const moveRegexPattern = /move\W(\d+)\Wfrom\W(\d+)\Wto\W(\d+)/g;
  const match = Array.from(serialisedMove.matchAll(moveRegexPattern))[0].slice(
    1,
    4,
  );
  // console.log('match:', match)
  if (match === null)
    throw "unexpected serialised move: match of move was null";
  const parsedInts: number[] = match.map((i) => parseInt(i));
  return {
    numberOfCrates: parsedInts[0],
    from: parsedInts[1],
    to: parsedInts[2],
  };
}
