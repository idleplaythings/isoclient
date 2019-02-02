import { Tile } from "./tile";
import * as THREE from "three";
import { TileBinarySet } from "../model/tile";
import ndarray from "ndarray";

import TerrainTester from "./test/TerrainTester";

class World {
  constructor(tileLibrary, tileRenderer) {
    this.tileLibrary = tileLibrary;
    this.tileRenderer = tileRenderer;

    this.tester = new TerrainTester(this.tileLibrary);
    this.create();
  }

  getTileChunkForRenderArea(chunkPosition, chunkSize) {
    //get props, items, characters too
    return this.tileLibrary.getTileChunksForRenderArea(
      chunkPosition,
      chunkSize
    );
  }

  create() {}

  render() {}
}

export default World;
