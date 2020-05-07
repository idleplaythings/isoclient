import { WorldTileBinarySet } from "../../model/tile/index.mjs";
import * as TileTypes from "../../model/tile/TileTypes";

class TileBinaryChunk extends WorldTileBinarySet {
  constructor(tileList, position) {
    super(tileList, position);
    this.lastTouched = Date.now();
  }

  getLastTouched() {
    return this.lastTouched;
  }

  touch() {
    this.lastTouched = Date.now();
  }

  isSlope(position) {
    const type = this.getType(position);
    return TileTypes.slopeTypes.includes(type);
  }
}

export default TileBinaryChunk;
