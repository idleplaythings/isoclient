import StructureFactory from "../../../model/structure/StructureFactory";
import DynamicEntitiesCache from "../TileLibrary/DynamicEntitiesCache";

class DynamicTileFactory {
  constructor(chunkSize) {
    this.chunkSize = chunkSize;
    this.factory = new StructureFactory();
    this.dynamicEntityCache = new DynamicEntitiesCache();
  }

  createTiles(
    position,
    binaryChunk,
    binaryChunkPosition,
    dynamicEntities,
    flyTile
  ) {
    let tiles = [];

    this.dynamicEntityCache.setEntities(dynamicEntities);

    this.dynamicEntityCache
      .getEntitiesForTileFactory(
        position,
        binaryChunkPosition,
        this.chunkSize,
        0
      )
      .forEach((entity) => {
        const instance = this.factory.deserialize(entity);
        tiles = [
          ...tiles,
          ...instance.createTiles(
            position,
            binaryChunk,
            binaryChunkPosition,
            this.dynamicEntityCache,
            flyTile,
            this.chunkSize
          ),
        ];
      });

    return tiles;
  }
}

export default DynamicTileFactory;
