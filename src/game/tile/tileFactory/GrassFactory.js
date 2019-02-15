import Tile from "../Tile";
import * as tileTextures from "../../texture/TextureTypes";
import { getRandom } from "./Utils";

const flyTile = new Tile();

class GrassFactory {
  populateGroundTile(tile) {
    tile
      .setSurfaceBrush(this.getSurfaceBrush())
      .setSurfaceTexture(this.getSurfacetexture());

    return tile;
  }

  populateSlopeTile(tile) {
    tile.setSurfaceTexture(getRandom(tileTextures.mud));

    return tile;
  }

  createClutterTilesForSlope({ position, height }) {
    return [];

    return [
      flyTile
        .reset()
        .setChunkPosition(position.x, position.y, height)
        .setTexture(0, getRandom(tileTextures.rocks))
        .setFlipped(true)
        .serialize()
    ];
  }

  createClutterTiles(props) {
    const { position, height } = props;
    const random = Math.random();
    const tiles = [];
    if (random > 0.7) {
      tiles.push(
        flyTile
          .reset()
          .setChunkPosition(position.x, position.y, height + 1)
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
          .setChunkPosition(position.x, position.y, height + 1)
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
          .setChunkPosition(position.x, position.y, height + 1)
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

  getSurfaceBrush() {
    return getRandom(tileTextures.groundBrush);
  }

  getSurfacetexture() {
    if (Math.random() > 0.9) {
      return getRandom(tileTextures.darkGrass);
    }

    return getRandom(tileTextures.grass);
  }
}

export default GrassFactory;
