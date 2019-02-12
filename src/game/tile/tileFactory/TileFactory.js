import Tile from "../Tile";
import * as TileTypes from "../../../model/tile/TileTypes";
import * as tileTextures from "../../texture/TextureTypes";
import GrassFactory from "./GrassFactory";

const flyTile = new Tile();

const getRandom = type => Math.floor(Math.random() * type.amount) + type.start;

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

        const tileSetPosition = { x: x + 1, y: y + 1 };

        tiles = tiles.concat(
          this.createTile(
            tilePosition,
            binaryChunk.getHeight(tileSetPosition),
            binaryChunk.getType(tileSetPosition),
            binaryChunk.getProp(tileSetPosition),
            binaryChunk.getVisual(tileSetPosition),
            position,
            tileSetPosition,
            binaryChunk
          )
        );
      }
    }

    return tiles;
  }

  createTile(
    position,
    height,
    type,
    prop,
    visual,
    chunkPosition,
    tileSetPosition,
    binaryChunk
  ) {
    const tiles = [];

    switch (type) {
      case TileTypes.type.WATER:
   
        tiles.push(
            ...this.grassFactory.createWater(
            position,
            0,
            type,
            prop,
            visual,
            chunkPosition,
            tileSetPosition,
            binaryChunk
            )
        );
        
        break;
      case TileTypes.type.REGULAR:
        tiles.push(...this.createGround(position, height, prop, visual));
        break;
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
        tiles.push(
          ...this.createSlope(
            position,
            height,
            type,
            prop,
            visual,
            chunkPosition,
            tileSetPosition,
            binaryChunk
          )
        );
        break;
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

    return tiles;
  }

  createGround(
    position,
    height,
    type,
    prop,
    visual,
    chunkPosition,
    tileSetPosition,
    binaryChunk
  ) {
    switch (visual) {
      case TileTypes.visual.GRASS:
      default:
        return this.grassFactory.createGround(
          position,
          height,
          type,
          prop,
          visual,
          chunkPosition,
          tileSetPosition,
          binaryChunk
        );
    }
  }

  createSlope(
    position,
    height,
    type,
    prop,
    visual,
    chunkPosition,
    tileSetPosition,
    binaryChunk
  ) {
    switch (visual) {
      case TileTypes.visual.GRASS:
      default:
        return this.grassFactory.createSlope(
          position,
          height,
          type,
          prop,
          visual,
          chunkPosition,
          tileSetPosition,
          binaryChunk
        );
    }
  }
}

export default TileFactory;
