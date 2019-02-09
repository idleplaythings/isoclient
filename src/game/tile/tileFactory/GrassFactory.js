import Tile from "../Tile";
import * as TileTypes from "../../../model/tile/TileTypes";
import * as tileTextures from "../../texture/TextureTypes";

const flyTile = new Tile();

const getRandom = type => Math.floor(Math.random() * type.amount) + type.start;

class GrassFactory {
  createGround(position, height, type, prop, visual) {
    const tiles = [
      flyTile
        .reset()
        .setChunkPosition(position.x, position.y, height - 1)
        .setSurfaceBrush(this.getSurfaceBrush(visual))
        .setSurfaceTexture(this.getSurfacetexture(visual))
        .setBrushedType()
        .serialize(),

      flyTile
        .reset()
        .setChunkPosition(position.x, position.y, height)
        .setSurfaceBrush(this.getSurfaceBrush(visual))
        .setSurfaceTexture(this.getSurfacetexture(visual))
        .setBrushedType()
        .serialize()
    ];

    const clutter = flyTile
      .reset()
      .setChunkPosition(position.x, position.y, height + 1)
      .setTexture(0, getRandom(tileTextures.grassClutter))
      .setTexture(1, getRandom(tileTextures.twigClutter))
      //.setTexture(2, this.getSurfaceClutterRocks())
      .setFlipped(true)
      .serialize();

    tiles.push(clutter);
    return tiles;
  }

  createSlope(position, height, type, prop, visual) {
    const surfaceBrush = this.getSurfaceBrush(visual);
    const surfaceTexture = this.getSurfacetexture(visual);
    const groundBrush = getRandom(tileTextures.grounBrushTile);
    const groundTexture = getRandom(tileTextures.groundTexture);

    const tiles = [
      flyTile
        .reset()
        .setChunkPosition(position.x, position.y, height - 2)
        .setSurfaceBrush(surfaceBrush)
        .setSurfaceTexture(surfaceTexture)
        .setBrushedType()
        .serialize(),

      flyTile
        .setChunkPosition(position.x, position.y, height - 1)
        .setFlipped(true)
        .serialize(),

      flyTile
        .reset()
        .setChunkPosition(position.x, position.y, height)
        .setSurfaceBrush(surfaceBrush)
        .setSurfaceTexture(surfaceTexture)
        .setBrushedType()
        .setShadowBrush(this.getShadowTexture(type))
        .setHighlightBrush(this.getHightlightTexture(type))
        .setFlipped(true)
        .serialize()
    ];

    /*
    const clutter = flyTile
      .reset()
      .setChunkPosition(position.x, position.y, height)
      .setTexture(0, getRandom(tileTextures.grassClutter))
      .setTexture(1, getRandom(tileTextures.twigClutter))
      //.setTexture(2, this.getSurfaceClutterRocks())
      .setFlipped(true)
      .serialize();

    tiles.push(clutter);
    */

    return tiles;
  }

  getShadowTexture(type) {
    switch (type) {
      case TileTypes.type.SLOPE_SOUTH:
        return 0;
      case TileTypes.type.SLOPE_WEST:
        return 0;
      case TileTypes.type.SLOPE_EAST:
        return getRandom(tileTextures.shadowBottomLeftToUpperRight);
      case TileTypes.type.SLOPE_NORTH:
        return getRandom(tileTextures.shadowUpperLeftToBottomRightSmall);
      case TileTypes.type.SLOPE_NORTHWEST:
        return getRandom(tileTextures.shadowNW);
      case TileTypes.type.SLOPE_NORTHEAST:
        return getRandom(tileTextures.shadowNE);
      case TileTypes.type.SLOPE_SOUTHWEST:
        return 0;
      case TileTypes.type.SLOPE_SOUTHEAST:
        return getRandom(tileTextures.shadowSEShadow);
      case TileTypes.type.SLOPE_NORTHWEST_INVERTED:
        return getRandom(tileTextures.shadowNWInvertedShadow);
      case TileTypes.type.SLOPE_NORTHEAST_INVERTED:
        return getRandom(tileTextures.shadowNEInverted);
      case TileTypes.type.SLOPE_SOUTHWEST_INVERTED:
        return 0;
      case TileTypes.type.SLOPE_SOUTHEAST_INVERTED:
        return getRandom(tileTextures.shadowSEInvertedShadow);
      default:
        throw new Error("Unrecognized slope type '" + type + "'");
    }
  }

  getHightlightTexture(type) {
    switch (type) {
      case TileTypes.type.SLOPE_SOUTH:
        return getRandom(tileTextures.shadowUpperLeftToBottomRight);
      case TileTypes.type.SLOPE_WEST:
        return getRandom(tileTextures.shadowBottomLeftToUpperRightSmall);
      case TileTypes.type.SLOPE_EAST:
        return 0;
      case TileTypes.type.SLOPE_NORTH:
        return 0;
      case TileTypes.type.SLOPE_NORTHWEST:
        return getRandom(tileTextures.shadowNWLight);
      case TileTypes.type.SLOPE_NORTHEAST:
        return 0;
      case TileTypes.type.SLOPE_SOUTHWEST:
        return getRandom(tileTextures.shadowSW);
      case TileTypes.type.SLOPE_SOUTHEAST:
        return getRandom(tileTextures.shadowSELight);
      case TileTypes.type.SLOPE_NORTHWEST_INVERTED:
        return getRandom(tileTextures.shadowNWInvertedLight);
      case TileTypes.type.SLOPE_NORTHEAST_INVERTED:
        return 0;
      case TileTypes.type.SLOPE_SOUTHWEST_INVERTED:
        return getRandom(tileTextures.shadowSWInverted);
      case TileTypes.type.SLOPE_SOUTHEAST_INVERTED:
        return getRandom(tileTextures.shadowSEInvertedLight);
      default:
        throw new Error("Unrecognized slope type '" + type + "'");
    }
  }

  getSurfaceBrush(visual) {
    return getRandom(tileTextures.groundBrush);
  }

  getSurfacetexture(visual) {
    if (Math.random() > 0.9) {
      return getRandom(tileTextures.darkGrass);
    }

    return getRandom(tileTextures.grass);
  }
}

export default GrassFactory;
