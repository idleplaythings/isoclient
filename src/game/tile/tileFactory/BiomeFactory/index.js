import * as TileTypes from "../../../../model/tile/TileTypes";
import BedrockFactory from "./BedrockFactory";
import BedrockSoilFactory from "./BedrockSoilFactory";

const bedrockFactory = new BedrockFactory();
const bedrockSoilFactory = new BedrockSoilFactory();

export const buildGround = (
  propData,
  position,
  chunkSize,
  binaryChunk,
  binaryChunkPosition,
  dynamicEntities,
  extra
) => {
  for (let x = -1; x <= chunkSize; x++) {
    for (let y = -1; y <= chunkSize; y++) {
      const tileSetPosition = { x: x + 1, y: y + 1 };

      const visual = binaryChunk.getVisual(tileSetPosition);
      const factory = getFactory(visual);

      if (!factory) {
        continue;
      }

      propData = factory.create(
        propData,
        position,
        chunkSize,
        binaryChunk,
        binaryChunkPosition,
        dynamicEntities,
        extra,
        tileSetPosition
      );
    }
  }

  return propData;
};

export const getFactory = (visual) => {
  switch (visual) {
    case TileTypes.visual.BEDROCK:
      return bedrockFactory;
    case TileTypes.visual.BEDROCK_SOIL:
      return bedrockSoilFactory;
    default:
      return null;
  }
};
