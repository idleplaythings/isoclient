import StructureFactory from "../../../model/structure/StructureFactory";
import DynamicEntitiesCache from "../TileLibrary/DynamicEntitiesCache";
import Vector from "../../../model/util/Vector.mjs";
import { getFactory } from "./BiomeFactory/index.js";
import * as TileTypes from "../../../model/tile/TileTypes";

const getWorldPosition = (binaryChunkPosition, chunkPosition, position) =>
  new Vector(binaryChunkPosition).add(chunkPosition).add(position);

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

    for (let x = 0; x < this.chunkSize; x++) {
      for (let y = 0; y < this.chunkSize; y++) {
        const tileSetPosition = { x, y };
        const worldPosition = getWorldPosition(binaryChunkPosition, position, {
          x,
          y: -y,
        });

        let prop = binaryChunk.getProp(tileSetPosition);

        if (prop === 0) {
          const type = binaryChunk.getType(tileSetPosition);

          if (type === TileTypes.type.REGULAR) {
            tiles = [
              ...tiles,
              ...this.addExtraProp(
                position,
                binaryChunk,
                binaryChunkPosition,
                flyTile,
                tileSetPosition,
                worldPosition
              ),
            ];
          }

          continue;
        }

        const propInstance = this.factory.deserialize([
          prop,
          worldPosition.x,
          worldPosition.y,
          0,
        ]);

        if (!propInstance) {
          continue;
        }

        tiles = [
          ...tiles,
          ...propInstance.createTiles(
            position,
            binaryChunk,
            binaryChunkPosition,
            this.dynamicEntityCache,
            flyTile,
            this.chunkSize
          ),
        ];
      }
    }

    return tiles;
  }

  addExtraProp(
    position,
    binaryChunk,
    binaryChunkPosition,
    flyTile,
    tileSetPosition,
    worldPosition
  ) {
    const visual = binaryChunk.getVisual(tileSetPosition);
    const factory = getFactory(visual);

    if (!factory) {
      return [];
    }

    return factory.getExtraProp(
      worldPosition,
      position,
      binaryChunk,
      binaryChunkPosition,
      this.dynamicEntityCache,
      flyTile,
      this.chunkSize
    );
  }
}

export default DynamicTileFactory;
