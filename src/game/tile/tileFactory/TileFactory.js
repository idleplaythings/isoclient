import Tile from "../Tile";
import * as TileTypes from "../../../model/tile/TileTypes";
import * as tileTextures from "../../texture/TextureTypes";
import GrassFactory from "./GrassFactory";
import WaterFactory from "./WaterFactory";
import { getRandom, getSeededRandomGenerator } from "./Utils";
import { getColorIndicesForCoord } from "../../../util/imageUtils";
import HeightMapFactory, { createHeightMap } from "./HeightMapFactory";
import Vector from "../../../model/util/Vector";
import GroundTileGeometryFactory from "./GroundTileGeometryFactory";
import DynamicTileFactory from "./DynamicTileFactory";

const flyTile = new Tile();

const getWorldPosition = (binaryChunkPosition, chunkPosition, position) =>
  new Vector(binaryChunkPosition).add(chunkPosition).add(position);

class TileFactory {
  constructor(chunkSize) {
    /*
    this.grassFactory = new GrassFactory();
    this.waterFactory = new WaterFactory();
    */

    this.heightMapFactory = new HeightMapFactory();

    this.dynamicTileFactory = new DynamicTileFactory(chunkSize);

    this.groundTileGeometryFactory = new GroundTileGeometryFactory(chunkSize);
  }

  create(
    position,
    chunkSize,
    binaryChunk,
    binaryChunkPosition,
    dynamicEntities
  ) {
    const extra = 2;
    this.heightMapFactory.set(position, chunkSize, binaryChunk);

    const vertices = this.groundTileGeometryFactory.calculateHeightData(
      this.heightMapFactory
    );

    const propData = new Uint8ClampedArray(
      (chunkSize + extra) * (chunkSize + extra) * 4
    );

    const tiles = this.dynamicTileFactory.createTiles(
      position,
      binaryChunk,
      binaryChunkPosition,
      dynamicEntities,
      flyTile
    );

    for (let x = -1; x <= chunkSize; x++) {
      for (let y = -1; y <= chunkSize; y++) {
        const worldPosition = getWorldPosition(
          binaryChunkPosition,
          position,
          new Vector(x, -y) // NOTE: -y because chunk position is upperLeft, not lowerLeft.
        );

        const tileSetPosition = { x: x + 1, y: y + 1 };

        const [r, g, b, a] = getColorIndicesForCoord(
          tileSetPosition.x,
          tileSetPosition.y,
          chunkSize + extra
        );

        const getRandom = getSeededRandomGenerator(
          `${position.x + x}x${position.y - y}`
        );

        let visual = [5, 4][Math.floor(getRandom() * 2)];
        let brush = [3, 4, 5, 6][Math.floor(getRandom() * 4)];

        let visual2 = 255;
        let brush2 = 255;

        //if (absoluteHeight > 7) {
        const random = getRandom();
        /*
        if (random > 0.9) {
          visual2 = 8;
          brush2 = [8, 9, 10][Math.floor(getRandom() * 3)];
        } else if (random > 0.8) {
          visual2 = 9;
          brush2 = [8, 9, 10][Math.floor(getRandom() * 3)];
        } else 
        */
        if (random > 0.7) {
          visual2 = 56;
          brush2 = [16, 17, 18][Math.floor(getRandom() * 3)];
        }

        const type = binaryChunk.getType(tileSetPosition);
        if (type !== TileTypes.type.REGULAR) {
          brush = [3, 4, 5, 6][Math.floor(getRandom() * 4)];
          visual = 56;
          visual2 = 255;
          brush2 = 255;
        }

        /*
        if (worldPosition.x === 512 && worldPosition.y === 512) {
          visual2 = 9;
          brush2 = 1;
        }
        */

        propData[r] = brush2;
        propData[g] = visual2;
        propData[b] = brush;
        propData[a] = visual;
      }
    }

    return { groundData: { propData, vertices }, tiles };
  }
}

export default TileFactory;
