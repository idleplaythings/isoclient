import Tile from "../Tile";
import * as TileTypes from "../../../model/tile/TileTypes";
import * as tileTextures from "../../texture/TextureTypes";
import GrassFactory from "./GrassFactory";
import WaterFactory from "./WaterFactory";
import { getRandom, getSeededRandomGenerator } from "./Utils";
import { getColorIndicesForCoord } from "../../../util/imageUtils";
import { createHeightMap } from "./HeightMapFactory";
import Vector from "../../../model/util/Vector";

const flyTile = new Tile();

const getWorldPosition = (binaryChunkPosition, chunkPosition, position) =>
  new Vector(binaryChunkPosition).add(chunkPosition).add(position);

class TileFactory {
  constructor() {
    this.grassFactory = new GrassFactory();
    this.waterFactory = new WaterFactory();
  }

  create(position, chunkSize, binaryChunk, binaryChunkPosition) {
    const extra = 2;
    const heightData = createHeightMap(position, chunkSize, binaryChunk);

    const propData = new Uint8ClampedArray(
      (chunkSize + extra) * (chunkSize + extra) * 4
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
        } else if (random > 0.7) {
          visual2 = 56;
          brush2 = [16, 17, 18][Math.floor(getRandom() * 3)];
        }
        */

        const type = binaryChunk.getType(tileSetPosition);
        if (type !== TileTypes.type.REGULAR) {
          brush = [3, 4, 5, 6][Math.floor(getRandom() * 4)];
          visual = 56;
          visual2 = 255;
          brush2 = 255;
        }

        if (worldPosition.x === 512 && worldPosition.y === 512) {
          visual2 = 9;
          brush2 = 1;
        }

        propData[r] = brush2;
        propData[g] = visual2;
        propData[b] = brush;
        propData[a] = visual;
      }
    }

    return [propData, heightData];
  }

  createTile(props) {
    const tiles = [];
    const { type } = props;

    switch (type) {
      case TileTypes.type.WATER:
      case TileTypes.type.REGULAR:
        tiles.push(...this.createGroundNew(props));
        //tiles.push(...this.createGround(props));
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
        //tiles.push(...this.createSlope(props));
        tiles.push(...this.createGroundNew(props));
        break;
      default:
        console.log(props);
        throw new Error("Unrecognized tiletype '" + type + "'");
    }

    return tiles;
  }

  getFactory({ visual }) {
    switch (visual) {
      case TileTypes.visual.WATER:
        return this.waterFactory;
      case TileTypes.visual.GRASS:
      default:
        return this.grassFactory;
    }
  }

  createGroundNew(props) {
    const { position, height } = props;

    let tiles = [[position.x, position.y, height]];

    return tiles;
  }

  createGround(props) {
    const { position, height } = props;

    let tiles = [];

    if (height <= 1) {
      tiles.push(
        flyTile
          .reset()
          .setChunkPosition(position.x, position.y, 1)
          .setWaterType()
          .serialize()
      );
    }

    tiles.push(
      this.getFactory(props)
        .populateGroundTile(
          flyTile
            .reset()
            .setChunkPosition(position.x, position.y, height)
            .setBrushedType(),
          props
        )
        .serialize()
    );

    tiles = tiles.concat(this.getFactory(props).createClutterTiles(props));

    return tiles;
  }

  createSlope(props) {
    const {
      position,
      height,
      type,
      visual,
      tileSetPosition,
      binaryChunk,
    } = props;

    const highlightTexture = this.getHightlightTexture(
      type,
      tileSetPosition,
      binaryChunk
    );

    let tiles = [];

    flyTile
      .reset()
      .setChunkPosition(position.x, position.y, height - 1)
      .setBrushedType();

    if (height <= 2) {
      this.waterFactory.populateGroundTile(flyTile, {
        ...props,
        height: height - 1,
      });
    } else {
      this.getFactory(visual).populateGroundTile(flyTile, props);
    }

    tiles.push(flyTile.serialize());

    if (height <= 2) {
      tiles.push(
        flyTile
          .reset()
          .setChunkPosition(position.x, position.y, 1)
          .setWaterType()
          .serialize()
      );
    }

    const surfaceBrush = this.getSurfaceBrushForSlope(type);
    tiles.push(
      this.getFactory(visual)
        .populateSlopeTile(
          flyTile
            .reset()
            .setChunkPosition(position.x, position.y, height)
            .setSurfaceBrush(surfaceBrush)
            .setGroundBrush(surfaceBrush)
            .setSlopeType()
            .setHighlightBrush(highlightTexture)
            .setMasks(
              ...this.getMaskForSlope(type, tileSetPosition, binaryChunk)
            )
            .setFlipped(true),
          props
        )
        .serialize()
    );

    tiles = tiles.concat(
      this.getFactory(props).createClutterTilesForSlope(props)
    );

    return tiles;
  }

  offset(position, x = 0, y = 0) {
    return {
      x: position.x + x,
      y: position.y + y,
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
}

export default TileFactory;
