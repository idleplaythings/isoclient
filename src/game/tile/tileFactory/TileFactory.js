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
import { buildGround } from "./BiomeFactory";

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

    let propData = new Uint8ClampedArray(
      (chunkSize + extra) * (chunkSize + extra) * 4
    );

    propData = buildGround(
      propData,
      position,
      chunkSize,
      binaryChunk,
      binaryChunkPosition,
      dynamicEntities,
      extra
    );

    const tiles = this.dynamicTileFactory.createTiles(
      position,
      binaryChunk,
      binaryChunkPosition,
      dynamicEntities,
      flyTile
    );

    return { groundData: { propData, vertices }, tiles };
  }
}

export default TileFactory;
