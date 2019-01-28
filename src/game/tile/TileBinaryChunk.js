import { TileBinarySet } from "../../model/tile/index.mjs";

class TileBinaryChunk extends TileBinarySet {
  constructor(tileList) {
    super(tileList);
    this.lastTouched = Date.now();
  }

  getLastTouched() {
    return this.lastTouched;
  }

  touch() {
    this.lastTouched = Date.now();
  }
}

export default TileBinaryChunk;
