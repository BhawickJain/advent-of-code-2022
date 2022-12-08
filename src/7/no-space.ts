import { VirtualDirectory } from "./VirtualDirectory";

export function parseCd(cmd: string) {
  const matches = Array.from(cmd.matchAll(/\$\scd\s(.*)/g))[0];
  // console.log(matches)
  if (matches === null) return null;
  return matches[1];
}

export function isCd(line: string) {
  return line.match(/\$\scd\s(.*)/g) !== null;
}

export function isLs(line: string) {
  return line.match(/\$\sls/g) !== null;
}

export function isCommand(line: string) {
  return line.match(/\$\s.*/g) !== null;
}

export function isFile(line: string) {
  return line.match(/(\d+)\s(.*)/g) !== null;
}

export function parseFile(line: string) {
  const matches = Array.from(line.matchAll(/(\d+)\s(.*)/g))[0];
  // console.log(matches)
  if (matches === null) return null;
  return { name: matches[2], size: parseInt(matches[1]) };
}

export function isDir(line: string) {
  return line.match(/dir\s(.*)/g) !== null;
}

export function parseDir(line: string) {
  const matches = Array.from(line.matchAll(/dir\s(.*)/g))[0];
  // console.log(matches)
  if (matches === null) return null;
  return matches[1];
}

export function parseLine(line: string, vfs: VirtualDirectory) {
  if (isCd(line)) {
    const dirName = parseCd(line);
    if (!dirName) throw "unexpected error: dir name not found";
    const ls = Array.from(vfs.ls()).map((i) => i.name);
    if (ls.filter((n) => n === dirName).length === 0 && dirName !== "..") {
      vfs.mkdir(dirName);
    }
    vfs.cd(dirName);
    return;
  }

  if (isLs(line)) {
    return;
  }

  if (isDir(line)) {
    const dirName = parseDir(line);
    if (!dirName) throw "unexpected error: dir name not found";
    vfs.mkdir(dirName);
    return;
  }

  if (isFile(line)) {
    const file = parseFile(line);
    if (!file) throw "unexpected error: file name not found";
    vfs.touch(file.name, file.size);
    return;
  }
}

export function parseCommand(line: string, vfs: VirtualDirectory) {
  if (isLs(line)) vfs.ls;
}

export type dirSizes = { name: string; size: number };

export function getDirectorySizes(vfs: VirtualDirectory): dirSizes[] {
  const listOfDirs: dirSizes[] = [];
  const cwd = { name: vfs.cwd.name, size: 0 };
  const ls = Array.from(vfs.ls());
  ls.forEach((b) => {
    if (b.type === "directory") {
      vfs.cd(b.name);
      const subDirsSizes = getDirectorySizes(vfs);
      listOfDirs.push(...subDirsSizes);
      const bDirSize = subDirsSizes.filter((d) => d.name === b.name)[0];
      cwd.size += bDirSize.size;
      vfs.cd("..");
    } else if (b.type === "file") {
      cwd.size += b.size;
    }
  });

  return [cwd, ...listOfDirs];
}

// 146702 wrong answer
