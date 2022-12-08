import { readFileSync } from "fs";
import { dirSizes, getDirectorySizes, parseLine } from "./no-space";
import { VirtualDirectory } from "./VirtualDirectory";
/**
 * 1) read text line by line
 * 2) build a directory tree
 * 3) walk the directory tree to calculate all directory sizes
 * 4) filter for directories no more than 100_000 bytes
 * 5) sum sizes and return
 * @param input day-7 input
 * @returns
 */
export function firstHalf(input?: string): [number, dirSizes[]] {
  if (!input) input = readFileSync("./src/7/input.txt", "utf-8");
  const lines = input.split(/\n/g);
  const vfs = new VirtualDirectory();
  lines.forEach((l) => parseLine(l, vfs));
  vfs.root();
  vfs.cd("/");
  // vfs.cd('..') // to back to '/' directory from directory 'd'

  const sizes = getDirectorySizes(vfs);
  const filteredByLimit = sizes.filter((s) => s.size <= 100000);
  const total = filteredByLimit.reduce((sum, s) => sum + s.size, 0);

  console.log("first half result:", total);
  return [total, sizes];
}

export function secondHalf(input?: string): number {
  const [_, sizes] = firstHalf();
  const sortedDirSizes = sizes.sort((a, b) => a.size - b.size);
  const totalDiskSpace = 70_000_000;
  const updateDiskSpace = 30_000_000;
  const usedDiskspace = sizes.filter((s) => s.name === "/")[0].size;
  const availableDiskpace = totalDiskSpace - usedDiskspace;
  const toFreeUp = updateDiskSpace - availableDiskpace;
  const smallestDirToDelete = sortedDirSizes.filter(
    (d) => d.size >= toFreeUp,
  )[0];

  // console.log('toFreeUp', toFreeUp)
  // console.log('smallestDirToDelete', smallestDirToDelete)
  console.log("second half result:", smallestDirToDelete.size);
  return smallestDirToDelete.size;
}
