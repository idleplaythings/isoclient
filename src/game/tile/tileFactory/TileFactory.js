import Tile from "../Tile";
import * as TileTypes from "../../../model/tile/TileTypes";
import * as tileTextures from "../../texture/TextureTypes";
import GrassFactory from "./GrassFactory";

class TileFactory {
  constructor() {
    this.grassFactory = new GrassFactory();
  }
  create(position, chunkSize, binaryChunk) {
    let tiles = [];
    for (let x = 0; x < chunkSize; x++) {
      for (let y = 0; y < chunkSize; y++) {
        const tilePosition = { x, y };
        //console.log(position, tilePosition, tileSetPosition);

        const tileSetPosition = { x, y };

        tiles = tiles.concat(
          this.createTile(
            tilePosition,
            binaryChunk.getHeight(tileSetPosition),
            binaryChunk.getType(tileSetPosition),
            binaryChunk.getProp(tileSetPosition),
            binaryChunk.getVisual(tileSetPosition),
            position
          )
        );
      }
    }

    return tiles;
  }

  createTile(position, height, type, prop, visual, chunkPosition) {
    switch (type) {
      case TileTypes.type.WATER:
        return []; //water
      case TileTypes.type.REGULAR:
        return this.createGround(position, height, prop, visual);
      case TileTypes.type.SLOPE_SOUTH:
      case TileTypes.type.SLOPE_WEST:
      case TileTypes.type.SLOPE_EAST:
      case TileTypes.type.SLOPE_NORTH:
      case TileTypes.type.SLOPE_NORTHWEST:
      case TileTypes.type.SLOPE_NORTHEAST:
      case TileTypes.type.SLOPE_SOUTHWEST:
      case TileTypes.type.SLOPE_SOUTHEAST:
      case TileTypes.type.SLOPE_NORTHWEST_INVERTED:
      case TileTypes.type.SLOPE_NORTHEAST_INVERTED:
      case TileTypes.type.SLOPE_SOUTHWEST_INVERTED:
      case TileTypes.type.SLOPE_SOUTHEAST_INVERTED:
        return this.createSlope(position, height, type, prop, visual);
      default:
        console.log(
          "chunkPosition:",
          chunkPosition,
          "position:",
          position,
          height,
          type,
          prop,
          visual
        );
        throw new Error("Unrecognized tiletype '" + type + "'");
    }
  }

  createGround(position, height, prop, visual) {
    switch (visual) {
      case TileTypes.visual.GRASS:
      default:
        return this.grassFactory.createGround(position, height, prop, visual);
    }
  }

  createSlope(position, height, type, prop, visual) {
    switch (visual) {
      case TileTypes.visual.GRASS:
      default:
        return this.grassFactory.createSlope(
          position,
          height,
          type,
          prop,
          visual
        );
    }
  }
}

export default TileFactory;
