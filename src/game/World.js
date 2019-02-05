import { Tile } from "./tile";

import TerrainTester from "./test/TerrainTester";

class World {
  constructor(tileLibrary) {
    this.tileLibrary = tileLibrary;

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

  create() {
    window.test = new Tile();
  }

  render() {}
}

export default World;
