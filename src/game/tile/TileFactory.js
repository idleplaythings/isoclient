import Tile from "./Tile";
import * as TileTypes from "../../model/tile/TileTypes";
import * as THREE from "three";

class TileFactory {
  create(position, chunkSize, binaryChunk) {
    let tiles = [];
    for (let x = 0; x < chunkSize; x++) {
      for (let y = 0; y < chunkSize; y++) {
        const tilePosition = {
          x: position.x + x,
          y: position.y - y
        };
        //console.log(position, tilePosition, tileSetPosition);

        const tileSetPosition = { x, y };

        tiles = tiles.concat(
          this.createTile(
            tilePosition,
            binaryChunk.getHeight(tileSetPosition),
            binaryChunk.getType(tileSetPosition),
            binaryChunk.getProp(tileSetPosition),
            binaryChunk.getVisual(tileSetPosition)
          )
        );
      }
    }

    return tiles;
  }

  createTile(position, height, type, prop, visual) {
    switch (type) {
      case TileTypes.type.WATER:
        return null; //water
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
        return this.createGround(position, height, prop, visual);
      //return this.createSlope(position, height, type, prop, visual);
      default:
        console.log(position, height, type, prop, visual);
        throw new Error("Unrecognized tiletype '" + type + "'");
    }
  }

  createGround(position, height, prop, visual) {
    return [
      new Tile(
        new THREE.Vector3(position.x, position.y, height),
        this.getSurfaceBrush(visual),
        this.getSurfacetexture(visual)
      ).serialize(),
      new Tile(
        new THREE.Vector3(position.x, position.y, height + 1),
        -1,
        this.getSurfaceClutter(),
        -1,
        -1
      ).serialize()
    ];
  }

  createSlope(position, height, type, prop, visual) {}

  getSurfaceClutter(visual) {
    return Math.floor(Math.random() * 7) + 245;
  }

  getSurfaceBrush(visual) {
    switch (visual) {
      case TileTypes.visual.GRASS:
      default:
        return Math.floor(Math.random() * 4);
    }
  }

  getSurfacetexture(visual) {
    switch (visual) {
      case TileTypes.visual.GRASS:
      default:
        if (Math.random() > 0.9) {
          return Math.floor(Math.random() * 4) + 64;
        }

        return Math.floor(Math.random() * 4) + 66;
    }
  }
}

export default TileFactory;