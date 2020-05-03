import { getChunkWorldPosition } from "../../../model/tile/Chunk.mjs";
import StructureFactory from "../../../model/structure/StructureFactory";

class DynamicEntitiesCache {
  constructor(entities = {}) {
    this.entities = entities;
    this.structureFactory = new StructureFactory();
  }

  setEntities(entities) {
    this.entities = entities;
  }

  addDynamicEntity(entities = []) {
    entities = [].concat(entities);

    entities.forEach((entity) => {
      const key = `${entity.position.x}-${entity.position.y}`;

      if (!this.entities[key]) {
        this.entities[key] = [];
      }

      this.entities[key].push(entity.serialize());
    });
  }

  getEntitiesForTileFactory(positionInChunk, binaryChunkPosition, chunkSize) {
    const entities = this.getEntitiesForChunk(
      positionInChunk,
      binaryChunkPosition,
      chunkSize,
      0
    );

    return Object.keys(entities).reduce(
      (all, key) => [...all, ...entities[key]],
      []
    );
  }

  getEntitiesForChunk(
    positionInChunk,
    binaryChunkPosition,
    chunkSize,
    padding = 1
  ) {
    const chunkWorldPosition = getChunkWorldPosition(
      binaryChunkPosition,
      positionInChunk
    );

    const payload = {};

    for (let y = -padding; y < chunkSize + padding; y++) {
      for (let x = -padding; x < chunkSize + padding; x++) {
        const key = `${chunkWorldPosition.x + x}-${chunkWorldPosition.y - y}`;

        if (this.entities[key]) {
          payload[key] = this.entities[key];
        }
      }
    }

    return payload;
  }

  getByTypeAndPosition(typeId, position) {
    const key = `${position.x}-${position.y}`;
    return this.entities[key]
      ? this.entities[key]
          .filter((entity) => entity[0] === typeId)
          .map((entity) => this.structureFactory.deserialize(entity))
      : [];
  }
}

export default DynamicEntitiesCache;
