export type file = {
  name: string;
  type: "file";
  size: number;
  parent: dir;
};

export type dir = {
  name: string;
  type: "directory";
  parent: dir | null;
  ls: Set<file | dir>;
};

export class VirtualDirectory {
  cwd: dir;
  _rootDir: dir;

  constructor() {
    this._rootDir = {
      name: ".",
      type: "directory",
      parent: null,
      ls: new Set<file | dir>(),
    };
    this.cwd = this._rootDir;
  }

  root() {
    this.cwd = this._rootDir;
  }

  ls() {
    return this.cwd.ls;
  }

  cd(dirName: string) {
    if (dirName === "..") {
      if (this.cwd.parent === null) throw "cannot for further back";
      this.cwd = this.cwd.parent;
      return;
    }

    const ls = Array.from(this.cwd.ls);
    const foundDirs = ls.filter((f) => f.name === dirName);
    if (foundDirs.length === 0)
      console.error("directory name not found, options:", this.cwd.ls);
    if (foundDirs[0].type === "file") {
      console.error(foundDirs[0], "is a file, directory expected");
    } else {
      this.cwd = foundDirs[0];
      return;
    }
  }

  mkdir(dirname: string) {
    const newDir: dir = {
      name: dirname,
      type: "directory",
      parent: this.cwd,
      ls: new Set<dir | file>(),
    };
    this.cwd.ls.add(newDir);
  }

  touch(fileName: string, size: number) {
    const newFile: file = {
      name: fileName,
      type: "file",
      size: size,
      parent: this.cwd,
    };
    this.cwd.ls.add(newFile);
  }
}
