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

  create() {}

  render() {}
}

export default World;
