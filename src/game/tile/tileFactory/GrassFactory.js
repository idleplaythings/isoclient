import Tile from "../Tile";
import * as TileTypes from "../../../model/tile/TileTypes";
import * as tileTextures from "../../texture/TextureTypes";

const flyTile = new Tile();

const getRandom = type => Math.floor(Math.random() * type.amount) + type.start;

class GrassFactory {
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
    let tiles = [
      /*
      flyTile
        .reset()
        .setChunkPosition(position.x, position.y, height - 1)
        .setSurfaceBrush(this.getSurfaceBrush(visual))
        .setSurfaceTexture(this.getSurfacetexture(visual))
        .setBrushedType()
        .serialize(),
        */

      flyTile
        .reset()
        .setChunkPosition(position.x, position.y, height)
        .setSurfaceBrush(this.getSurfaceBrush(visual))
        .setSurfaceTexture(this.getSurfacetexture(visual))
        .setBrushedType()
        .serialize()
    ];

    tiles = tiles.concat(
      this.createClutterTiles(
        position,
        height + 1,
        type,
        prop,
        visual,
        chunkPosition,
        tileSetPosition,
        binaryChunk
      )
    );

    return tiles;
  }

  createClutterTiles(
    position,
    height,
    type,
    prop,
    visual,
    chunkPosition,
    tileSetPosition,
    binaryChunk
  ) {
    const random = Math.random();
    const tiles = [];
    if (random > 0.7) {
      /*
      tiles.push(
        flyTile
          .reset()
          .setChunkPosition(position.x, position.y, height)
          .setTexture(0, getRandom(tileTextures.weedsFront))
          //.setTexture(2, this.getSurfaceClutterRocks())
          .serialize()
      );
      */

      tiles.push(
        flyTile
          .reset()
          .setChunkPosition(position.x, position.y, height)
          .setTexture(
            0,
            Math.random() > 0.5 ? getRandom(tileTextures.weedsFront) : 0
          )
          .setTexture(
            1,
            Math.random() > 0.5 ? getRandom(tileTextures.weedsBack) : 0
          )
          .setFlipped(true)
          .serialize()
      );
    } else if (random > 0.05) {
      const textures = [getRandom(tileTextures.grassClutter)];

      if (Math.random() > 0.5) {
        const additional = getRandom(tileTextures.grassClutter);
        if (additional !== textures[0]) {
          textures.push[additional];
        }
      }

      if (Math.random() > 0.7) {
        textures.push(getRandom(tileTextures.twigClutter));
      }

      if (Math.random() > 0.9) {
        textures.push(getRandom(tileTextures.mushroomClutter));
      }

      tiles.push(
        flyTile
          .reset()
          .setChunkPosition(position.x, position.y, height)
          .setTexture(0, textures[0] || 0)
          .setTexture(1, textures[1] || 0)
          .setTexture(2, textures[2] || 0)
          .setTexture(3, textures[3] || 0)
          .setFlipped(true)
          .serialize()
      );
    } else {
      tiles.push(
        flyTile
          .reset()
          .setChunkPosition(position.x, position.y, height)
          .setTexture(
            0,
            Math.random() > 0.5
              ? getRandom(tileTextures.bushes)
              : getRandom(tileTextures.rocks)
          )
          .setFlipped(true)
          .serialize()
      );
    }

    return tiles;
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
    const surfaceBrush = this.getSurfaceBrush(visual);
    const surfaceTexture = this.getSurfacetexture(visual);
    const groundBrush = getRandom(tileTextures.grounBrushTile);
    const groundTexture = getRandom(tileTextures.groundTexture);
    const highlightTexture = this.getHightlightTexture(
      type,
      tileSetPosition,
      binaryChunk
    );

    const tiles = [];

    if (height !== 1) {
      tiles.push(
        flyTile
          .reset()
          .setChunkPosition(position.x, position.y, height - 1)
          .setSurfaceBrush(surfaceBrush)
          .setSurfaceTexture(surfaceTexture)
          .setBrushedType()
          .serialize()
      );
    }

    tiles.push(
      flyTile
        .reset()
        .setChunkPosition(position.x, position.y, height)
        .setSurfaceBrush(this.getSurfaceBrushForSlope(type))
        .setSurfaceTexture(getRandom(tileTextures.mud))
        //.setSurfaceTexture(20)
        .setSlopeType()
        .setHighlightBrush(highlightTexture)
        .setMasks(...this.getMaskForSlope(type, tileSetPosition, binaryChunk))
        .setFlipped(true)
        .serialize()
    );

    return tiles;
  }

  createWater(position, height, type, prop, visual, chunkPosition) {
    const tiles = [];
    return tiles;

    tiles.push(
      flyTile
        .reset()
        .setChunkPosition(position.x, position.y, 0)
        .setSurfaceBrush(getRandom(tileTextures.groundBrush))
        .setSurfaceTexture(getRandom(tileTextures.water))
        .setBrushedType()
        //.setFlipped()
        .serialize()
    );

    return tiles;
  }

  offset(position, x = 0, y = 0) {
    return {
      x: position.x + x,
      y: position.y + y
    };
  }

  getMaskForSlope(type, tileSetPosition, binaryChunk) {
    let mask1 = 0;
    let mask2 = 0;

    switch (type) {
      case TileTypes.type.SLOPE_SOUTH:
        if (!binaryChunk.isSlope(this.offset(tileSetPosition, 0, 1))) {
          mask1 = getRandom(tileTextures.mask_slopeS_bottom);
        }
        if (!binaryChunk.isSlope(this.offset(tileSetPosition, 0, -1))) {
          mask2 = getRandom(tileTextures.mask_slopeS_top);
        }
        return [mask1, mask2];
      case TileTypes.type.SLOPE_SOUTHEAST:
        if (!binaryChunk.isSlope(this.offset(tileSetPosition, 1, 1))) {
          mask1 = getRandom(tileTextures.mask_slopeSE_bottom);
        }

        if (!binaryChunk.isSlope(this.offset(tileSetPosition, -1, -1))) {
          mask2 = getRandom(tileTextures.mask_slopeSE_top);
        }

        return [mask1, mask2];
      case TileTypes.type.SLOPE_EAST:
        if (!binaryChunk.isSlope(this.offset(tileSetPosition, 1, 0))) {
          mask1 = getRandom(tileTextures.mask_slopeE_bottom);
        }
        if (!binaryChunk.isSlope(this.offset(tileSetPosition, -1, 0))) {
          mask2 = getRandom(tileTextures.mask_slopeE_top);
        }
        return [mask1, mask2];
      case TileTypes.type.SLOPE_SOUTHEAST_INVERTED:
        if (!binaryChunk.isSlope(this.offset(tileSetPosition, -1, -1))) {
          mask1 = getRandom(tileTextures.mask_slopeNW_inverted_top);
        }
        if (!binaryChunk.isSlope(this.offset(tileSetPosition, 1, 1))) {
          mask2 = getRandom(tileTextures.mask_slopeSEInverted_bottom);
        }
        return [mask1, mask2];
      case TileTypes.type.SLOPE_NORTHWEST:
        if (!binaryChunk.isSlope(this.offset(tileSetPosition, -1, -1))) {
          mask2 = getRandom(tileTextures.mask_slopeNW_top);
        }
        return [mask1, mask2];
      case TileTypes.type.SLOPE_NORTH:
        if (!binaryChunk.isSlope(this.offset(tileSetPosition, 0, -1))) {
          mask2 = getRandom(tileTextures.mask_slopeN_bottom);
        }
        return [mask1, mask2];
      case TileTypes.type.SLOPE_WEST:
        if (!binaryChunk.isSlope(this.offset(tileSetPosition, -1, 0))) {
          mask2 = getRandom(tileTextures.mask_slopeW_bottom);
        }
        return [mask1, mask2];
      case TileTypes.type.SLOPE_NORTHEAST:
        if (!binaryChunk.isSlope(this.offset(tileSetPosition, 1, -1))) {
          mask2 = getRandom(tileTextures.mask_slopeNE_bottom);
        }
        return [mask1, mask2];
      case TileTypes.type.SLOPE_NORTHEAST_INVERTED:
        if (!binaryChunk.isSlope(this.offset(tileSetPosition, -1, 1))) {
          mask1 = getRandom(tileTextures.mask_slopeE_top);
        }
        if (!binaryChunk.isSlope(this.offset(tileSetPosition, 1, -1))) {
          mask2 = getRandom(tileTextures.mask_slopeNEInverted_bottom);
        }
        return [mask1, mask2];
      case TileTypes.type.SLOPE_SOUTHWEST_INVERTED:
        if (!binaryChunk.isSlope(this.offset(tileSetPosition, 1, -1))) {
          mask1 = getRandom(tileTextures.mask_slopeS_top);
        }

        if (!binaryChunk.isSlope(this.offset(tileSetPosition, -1, 1))) {
          mask2 = getRandom(tileTextures.mask_slopeSWInverted_bottom);
        }
        return [mask1, mask2];
      case TileTypes.type.SLOPE_SOUTHWEST:
        if (!binaryChunk.isSlope(this.offset(tileSetPosition, -1, 1))) {
          mask2 = getRandom(tileTextures.mask_slopeSW_bottom);
        }
        return [mask1, mask2];
      case TileTypes.type.SLOPE_NORTHWEST_INVERTED:
        if (!binaryChunk.isSlope(this.offset(tileSetPosition, -1, -1))) {
          mask1 = getRandom(tileTextures.mask_slopeNWInverted_bottom);
        }
        return [mask1, mask2];
      default:
        return [0, 0];
    }
  }

  getSurfaceBrushForSlope(type) {
    switch (type) {
      case TileTypes.type.SLOPE_SOUTH:
        return getRandom(tileTextures.groundBrush_slopeS);
      case TileTypes.type.SLOPE_SOUTHEAST_INVERTED:
        return getRandom(tileTextures.grass);
      case TileTypes.type.SLOPE_EAST:
        return getRandom(tileTextures.groundBrush_slopeE);
      case TileTypes.type.SLOPE_SOUTHEAST:
        return getRandom(tileTextures.groundBrush_slopeSE);
      case TileTypes.type.SLOPE_NORTHWEST:
        return getRandom(tileTextures.groundBrush_slopeNW);
      case TileTypes.type.SLOPE_NORTH:
        return getRandom(tileTextures.groundBrush_slopeN);
      case TileTypes.type.SLOPE_NORTHEAST_INVERTED:
        return getRandom(tileTextures.groundBrush_slopeE);
      case TileTypes.type.SLOPE_NORTHEAST:
        return getRandom(tileTextures.groundBrush_slopeN);
      case TileTypes.type.SLOPE_WEST:
        return getRandom(tileTextures.groundBrush_slopeW);
      case TileTypes.type.SLOPE_SOUTHWEST:
        return getRandom(tileTextures.groundBrush_slopeW);
      case TileTypes.type.SLOPE_SOUTHWEST_INVERTED:
        return getRandom(tileTextures.groundBrush_slopeS);
      case TileTypes.type.SLOPE_NORTHWEST_INVERTED:
        return getRandom(tileTextures.groundBrush_slopeNW);
      default:
        return 0;
    }
  }

  getHightlightTexture(type, tileSetPosition, binaryChunk) {
    switch (type) {
      case TileTypes.type.SLOPE_SOUTH:
        return getRandom(tileTextures.highlight_box_stonger);
      case TileTypes.type.SLOPE_WEST:
        if (!binaryChunk.isSlope(this.offset(tileSetPosition, 1, 0))) {
          return getRandom(tileTextures.shadow_W);
        }
        return getRandom(tileTextures.highlight_box);
      case TileTypes.type.SLOPE_EAST:
        return getRandom(tileTextures.shadow_box);
      case TileTypes.type.SLOPE_NORTH:
        if (!binaryChunk.isSlope(this.offset(tileSetPosition, 0, 1))) {
          return getRandom(tileTextures.shadow_N);
        }

        return getRandom(tileTextures.shadow_box_stonger);
      case TileTypes.type.SLOPE_NORTHWEST:
        return getRandom(tileTextures.low_highlight_strong_shadow);
      case TileTypes.type.SLOPE_NORTHEAST:
        return getRandom(tileTextures.shadow_high_low_diagonal);
      case TileTypes.type.SLOPE_SOUTHWEST:
        return getRandom(tileTextures.weak_highlight_strong_highlight_diagonal);
      case TileTypes.type.SLOPE_SOUTHEAST:
        return getRandom(tileTextures.strong_highlight_low_shadow_box);
      case TileTypes.type.SLOPE_NORTHWEST_INVERTED:
        if (!binaryChunk.isSlope(this.offset(tileSetPosition, 1, 1))) {
          return getRandom(tileTextures.shadow_NWInvereted);
        }
        return getRandom(tileTextures.strong_shadow_low_highlight);
      case TileTypes.type.SLOPE_NORTHEAST_INVERTED:
        if (!binaryChunk.isSlope(this.offset(tileSetPosition, -1, 1))) {
          return getRandom(tileTextures.shadow_NEInverted);
        }
        return getRandom(tileTextures.shadow_low_high_diagonal);
      case TileTypes.type.SLOPE_SOUTHWEST_INVERTED:
        return getRandom(tileTextures.strong_highlight_weak_highlight_diagonal);
      case TileTypes.type.SLOPE_SOUTHEAST_INVERTED:
        return getRandom(tileTextures.weak_shadow_strong_highlight);
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
