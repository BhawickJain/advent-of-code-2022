export class uniqueOccDict {
  store: Record<string, number>;
  // length holds a readonly ref to private mutable property _length
  private _uniqueLength: number;

  constructor() {
    this.store = {};
    this._uniqueLength = 0;
  }

  uniques(): number {
    return this._uniqueLength;
  }

  add(letter: string): void {
    if (!this.store[letter]) {
      this.store[letter] = 1;
      this._uniqueLength += 1;
      return;
    }
    if (this.store[letter] === 1) {
      this.store[letter] += 1;
      this._uniqueLength -= 1;
      return;
    }

    this.store[letter] += 1;
    return;
  }

  remove(letter: string): void {
    if (this.store[letter] > 2) {
      this.store[letter] -= 1;
    } else if (this.store[letter] === 2) {
      this.store[letter] -= 1;
      this._uniqueLength += 1;
    } else {
      delete this.store[letter];
      this._uniqueLength -= 1;
    }
  }
}
