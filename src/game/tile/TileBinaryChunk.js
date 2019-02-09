import { WorldTileBinarySet } from "../../model/tile/index.mjs";

class TileBinaryChunk extends WorldTileBinarySet {
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
