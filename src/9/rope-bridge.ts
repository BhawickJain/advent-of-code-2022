export type Direction = "R" | "D" | "L" | "U";
export type Motion = { dir: Direction; mag: number };
export type Pos = { x: number; y: number };

export function parseInput(puzzleInput: string): Motion[] {
  const lines = puzzleInput.split(/\n/g);
  const motions = lines.map((l) => parseIntoMotion(l));
  return motions;
}

function parseIntoMotion(line: string): Motion {
  const regexPattern = /([RULD])\s(\d+)/g;
  const matches = Array.from(line.matchAll(regexPattern))[0];
  const motion: Motion = {
    dir: matches[1] as Direction,
    mag: parseInt(matches[2]),
  };
  return motion;
}

export class RopeInSpace {
  head: Pos;
  tail: Pos;
  tailPosHistory: Pos[] = [];
  headPosHistory: Pos[] = [];

  constructor(head: Pos, tail: Pos) {
    this.head = head;
    this.tail = tail;
    this.headPosHistory.push(head);
    this.tailPosHistory.push(tail);
    this.updateTailPosition();
  }

  private areTouching(head: Pos, tail: Pos): boolean {
    const x = Math.abs(head.x - tail.x);
    const y = Math.abs(head.y - tail.y);
    return x <= 1 && y <= 1;
  }

  private updateTailPosition(previousHeadState?: {
    previousHeadPos: Pos;
    motion: Motion;
  }) {
    const head = this.head;
    const tail = this.tail;
    console.log("head pos:", head);
    console.log("tail pos:", tail);
    // if motion null, validate head / tail are touching
    console.log("manhatten distance:", this.areTouching(head, tail));
    if (this.areTouching(head, tail)) return;
    if (previousHeadState === undefined)
      throw `Head (${head.x}, ${head.y})and Tail (${tail.x}, ${tail.y}) are broken`;
    const { previousHeadPos, motion } = previousHeadState;
    this.tail.x = previousHeadPos.x;
    this.tail.y = previousHeadPos.y;
    console.log("tail at previous head pos", this.tail);
    const remainingMotion: Motion = { dir: motion.dir, mag: motion.mag - 1 };
    console.log("remainingMotion", remainingMotion);
    if (Math.abs(remainingMotion.mag) > 0)
      this.tail = { ...this.move(this.tail, remainingMotion) };
    this.tailPosHistory.push(Object.assign({ ...this.tail }));
  }

  moveHead(motion: Motion) {
    const increment: Motion = { dir: motion.dir, mag: 1 };

    for (let mag = 1; mag <= motion.mag; mag++) {
      const previousHeadPos: Pos = Object.assign({ ...this.head });
      this.head = this.move({ ...this.head }, { ...increment });
      console.log("previousHeadPosition", previousHeadPos);
      this.headPosHistory.push(Object.assign({ ...this.head }));
      this.updateTailPosition({
        previousHeadPos: previousHeadPos,
        motion: increment,
      });
    }
  }

  move(pos: Pos, motion: Motion) {
    const newPos: Pos = { x: pos.x, y: pos.y };
    const direction: Direction = motion.dir;
    switch (direction) {
      case "U":
        newPos.y -= motion.mag;
        return { ...newPos };
      case "R":
        newPos.x += motion.mag;
        return { ...newPos };
      case "D":
        newPos.y += motion.mag;
        return { ...newPos };
      case "L":
        newPos.x -= motion.mag;
        return { ...newPos };
    }
  }

  print() {
    const headHistory = this.headPosHistory;
    const tailHistory = this.tailPosHistory;
    const combined = [...headHistory, ...tailHistory];
    const xPos = combined.map((h) => h.x);
    const yPos = combined.map((h) => h.y);
    const xRange = Math.max(...xPos) - Math.min(...xPos);
    const yRange = Math.max(...yPos) - Math.min(...yPos);
    const xMid = (Math.min(...xPos) + Math.max(...xPos)) / 2;
    const yMid = (Math.min(...yPos) + Math.max(...yPos)) / 2;
    const width = xRange + 3;
    const height = yRange + 3;
    const midW = Math.floor(width / 2) - Math.floor(xMid);
    const midH = Math.floor(height / 2) - Math.floor(yMid);
    console.log("midW", midW, "width:", width, "xRange", xRange);
    console.log("midH", midH, "height:", height, "yRange", yRange);

    const displayLines: string[][] = [...Array(height)].map((h) => []);
    displayLines.forEach((_, y) =>
      displayLines[y].push(...".".repeat(width).split("")),
    );
    console.log("headHistory:", headHistory);
    console.log("tailHistory:", tailHistory);
    console.log(displayLines);
    tailHistory.forEach((p) => (displayLines[midH + p.y][midW + p.x] = "#"));
    const start = headHistory[0];
    console.log("start:", start);
    const headPos = headHistory.slice(-1)[0];
    const tailPos = tailHistory.slice(-1)[0];
    displayLines[midH + start.y][midW + start.x] = "S";
    displayLines[midH + tailPos.y][midW + tailPos.x] = "T";
    console.log("midH + headPos.y ", midH + headPos.y);
    displayLines[midH + headPos.y][midW + headPos.x] = "H";
    displayLines.forEach((l) => console.log(l.join("")));
  }
}

export class LongRopeInSpace {
  rope: Pos[];
  history: Pos[][];

  constructor(head: Pos, length: number) {
    this.rope = [...Array(length)].map((_) => ({ ...head }));
    this.history = [...Array(length)].map((_) => [{ ...head }]);
    this.updateTailPosition(0);
  }

  private areTouching(head: Pos, tail: Pos): boolean {
    const x = Math.abs(head.x - tail.x);
    const y = Math.abs(head.y - tail.y);
    return x <= 1 && y <= 1;
  }

  private determineFollow(head: Pos, tail: Pos): Pos {
    const xDiff = tail.x - head.x;
    const yDiff = tail.y - head.y;
    let xCorr: number;
    let yCorr: number;

    if (yDiff === 0 && xDiff !== 0) yCorr = 0;
    xCorr = Math.sign(xDiff);
    if (xDiff === 0 && yDiff !== 0) xCorr = 0;
    yCorr = Math.sign(yDiff);
    if (yDiff !== 0 && yDiff !== 0) xCorr = Math.sign(xDiff);
    yCorr = Math.sign(yDiff);

    console.log("xCorr", xCorr, "yCorr", yCorr);
    return { x: tail.x - xCorr, y: tail.y - yCorr };
  }

  private updateTailPosition(seg: number) {
    const headCurrPos = this.rope[seg];
    const tailCurrPos = this.rope[seg + 1];
    console.log("seg", seg, "head pos:", headCurrPos);
    console.log("seg", seg + 1, "tail pos:", tailCurrPos);
    console.log("are touching:", this.areTouching(headCurrPos, tailCurrPos));
    if (this.areTouching(headCurrPos, tailCurrPos)) return;
    this.rope[seg + 1] = Object.assign({
      ...this.determineFollow({ ...headCurrPos }, tailCurrPos),
    });
    console.log("seg", seg + 1, this.rope[seg + 1]);
    this.history[seg + 1].push(Object.assign({ ...this.rope[seg + 1] }));
    if (seg < this.rope.length - 2) this.updateTailPosition(seg + 1);
  }

  moveHead(motion: Motion) {
    const increment: Motion = { dir: motion.dir, mag: 1 };

    console.log("begin move", motion);

    for (let mag = 1; mag <= motion.mag; mag++) {
      console.log("move", mag);
      const head = this.rope[0];
      const previousHeadPos: Pos = Object.assign({ ...head });
      this.rope[0] = this.move({ ...this.rope[0] }, { ...increment });
      console.log("previousHeadPosition", previousHeadPos);
      this.history[0].push(Object.assign({ ...this.rope[0] }));
      this.updateTailPosition(0);
    }
  }

  move(pos: Pos, motion: Motion) {
    const newPos: Pos = { x: pos.x, y: pos.y };
    const direction: Direction = motion.dir;
    switch (direction) {
      case "U":
        newPos.y -= motion.mag;
        return { ...newPos };
      case "R":
        newPos.x += motion.mag;
        return { ...newPos };
      case "D":
        newPos.y += motion.mag;
        return { ...newPos };
      case "L":
        newPos.x -= motion.mag;
        return { ...newPos };
    }
  }

  print() {
    const combined = this.history.reduce((com, seg) => [...com, ...seg]);
    const xPos = combined.map((h) => h.x);
    const yPos = combined.map((h) => h.y);
    const xRange = Math.max(...xPos) - Math.min(...xPos);
    const yRange = Math.max(...yPos) - Math.min(...yPos);
    const xMid = (Math.min(...xPos) + Math.max(...xPos)) / 2;
    const yMid = (Math.min(...yPos) + Math.max(...yPos)) / 2;
    const width = xRange + 3;
    const height = yRange + 3;
    const midW = Math.floor(width / 2) - Math.floor(xMid);
    const midH = Math.floor(height / 2) - Math.floor(yMid);

    const displayLines: string[][] = [...Array(height)].map((h) => []);
    displayLines.forEach((_, y) =>
      displayLines[y].push(...".".repeat(width).split("")),
    );
    console.log("headHistory:", this.history);
    const tailHistory = this.history.slice(-1)[0];
    tailHistory.forEach((p) => (displayLines[midH + p.y][midW + p.x] = "#"));
    const start = this.history[0][0];
    console.log("start:", start);
    const headPos = this.rope[0];
    displayLines[midH + start.y][midW + start.x] = "S";

    for (let seg = this.rope.length - 1; seg > 0; seg--) {
      const segPos = this.rope[seg];
      displayLines[midH + segPos.y][midW + segPos.x] = `${seg}`;
    }
    console.log("head pos", headPos.x);
    displayLines[midH + headPos.y][midW + headPos.x] = "H";
    displayLines.forEach((l) => console.log(l.join("")));
  }
}
