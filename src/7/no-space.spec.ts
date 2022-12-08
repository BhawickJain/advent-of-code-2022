import { firstHalf, secondHalf } from "./compute-soution";
import { isCd, isFile, parseCd, parseFile } from "./no-space";
import { VirtualDirectory } from "./VirtualDirectory";

test("find the total size of directories that each no more than 100_000 bytes, then run with actual data", () => {
  let data = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

  expect(firstHalf(data)[0]).toBe(95437);

  data = `$ cd /
$ ls
dir csjncqmr
dir fnfjhvsp
dir mhfrct
dir pgmgbfcl
dir qcf
dir wrsjr
$ cd csjncqmr
$ ls
8827 vdrdm.pfj
$ cd ..
$ cd fnfjhvsp
$ ls
dir csjncqmr
dir czpmg
162385 dcgph
7135 hff.cdt
$ cd csjncqmr
$ ls
121543 gzjdsn.wlc
dir ljq
$ cd ljq
$ ls
dir cwlrlvf
dir jpqjhhpg
$ cd cwlrlvf
$ ls
151219 dcgph`;

  expect(firstHalf(data)[0]).toBe(8827);

  firstHalf();
});

test("find the smallest directory required to freeup disk space to 30_000_000", () => {
  secondHalf();
});

test("virtual directory class can handle directories with duplicate makes in different parents", () => {
  const vfs = new VirtualDirectory();
  vfs.ls();
  vfs.mkdir("/");
  vfs.cd("/");
  vfs.mkdir("a");
  vfs.mkdir("b");
  vfs.cd("a");
  vfs.touch("hello.txt", 999);
  vfs.cd("..");
  vfs.cd("b");
  vfs.touch("hello.txt", 999);
  vfs.cd("..");
});

test("virtual directory class can CRUD a virtual directory of files and folders", () => {
  const vfs = new VirtualDirectory();
  vfs.ls();
  vfs.mkdir("/");
  vfs.cd("/");
  vfs.touch("hello.txt", 999);
  vfs.ls();
  expect(vfs.cwd).toEqual(
    expect.objectContaining({
      type: "directory",
      name: "/",
    }),
  );
  vfs.cd("..");
  expect(vfs.cwd).toEqual(
    expect.objectContaining({
      type: "directory",
      name: ".",
    }),
  );
});

test("serialised cd commands can be corrected detected and parsed", () => {
  expect(isCd("$ cd d")).toBe(true);
  expect(parseCd("$ cd d")).toBe("d");

  expect(isCd("$ cd ..")).toBe(true);
  expect(parseCd("$ cd ..")).toBe("..");
});

test("serialised file item can be corrected detected and parsed", () => {
  expect(isFile("14848514 b.txt")).toBe(true);
  expect(parseFile("14848514 b.txt")).toStrictEqual({
    name: "b.txt",
    size: 14848514,
  });
  expect(isFile("5626152 d.ext")).toBe(true);
  expect(parseFile("5626152 d.ext")).toStrictEqual({
    name: "d.ext",
    size: 5626152,
  });
});
