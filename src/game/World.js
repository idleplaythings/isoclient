import { Tile } from "./tile";

class World {
  constructor(tileLibrary) {
    this.tileLibrary = tileLibrary;

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
