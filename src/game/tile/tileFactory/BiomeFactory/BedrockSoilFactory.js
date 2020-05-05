import { getColorIndicesForCoord } from "../../../../util/imageUtils";
import { getSeededRandomGenerator } from "../Utils";
import * as TileTypes from "../../../../model/tile/TileTypes";
import Leaves from "../../../../model/structure/nature/plant/Leaves";

class BedrockSoilFactory {
  create(
    propData,
    position,
    chunkSize,
    binaryChunk,
    binaryChunkPosition,
    dynamicEntities,
    extra,
    tileSetPosition
  ) {
    const [r, g, b, a] = getColorIndicesForCoord(
      tileSetPosition.x,
      tileSetPosition.y,
      chunkSize + extra
    );

    const getRandom = getSeededRandomGenerator(
      `${position.x + tileSetPosition.x}x${position.y - tileSetPosition.y}`
    );

    let visual = [10, 11][Math.floor(getRandom() * 2)];
    let brush = [3, 4, 5, 6][Math.floor(getRandom() * 4)];

    let visual2 = 255;
    let brush2 = 255;

    const random = getRandom();

    if (random > 0.8) {
      visual2 = 56;
      brush2 = [9, 10, 11][Math.floor(getRandom() * 3)];
    }

    const type = binaryChunk.getType(tileSetPosition);
    if (type !== TileTypes.type.REGULAR) {
      brush = [3, 4, 5, 6][Math.floor(getRandom() * 4)];
      visual = 56;
      visual2 = 255;
      brush2 = 255;
    }

    propData[r] = brush2;
    propData[g] = visual2;
    propData[b] = brush;
    propData[a] = visual;

    return propData;
  }

  getExtraProp(
    worldPosition,
    position,
    binaryChunk,
    binaryChunkPosition,
    dynamicEntityCache,
    flyTile,
    chunkSize
  ) {
    if (Math.random() < 0.9) {
      return [];
    }

    return new Leaves({ position: worldPosition }).createTiles(
      position,
      binaryChunk,
      binaryChunkPosition,
      dynamicEntityCache,
      flyTile,
      chunkSize
    );
  }
}

export default BedrockSoilFactory;
