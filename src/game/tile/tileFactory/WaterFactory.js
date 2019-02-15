import Tile from "../Tile";
import * as tileTextures from "../../texture/TextureTypes";
import { getRandom } from "./Utils";

const flyTile = new Tile();

class WaterFactory {
  populateGroundTile(tile, { height }) {
    tile.setSurfaceBrush(this.getSurfaceBrush());

    if (height === 0) {
      tile.setSurfaceTexture(getRandom(tileTextures.oceanFloor));
    } else {
      tile.setSurfaceTexture(getRandom(tileTextures.mud));
    }

    return tile;
  }

  populateSlopeTile(tile) {
    tile.setSurfaceTexture(getRandom(tileTextures.mud));

    return tile;
  }

  createClutterTilesForSlope(props) {
    return [];
  }

  createClutterTiles({ position, height }) {
    if (height === 0) {
      return [];
    }

    if (Math.random() > 0.2) {
      return [
        flyTile
          .reset()
          .setChunkPosition(position.x, position.y, height)
          .setTexture(
            0,
            Math.random() > 0.5
              ? getRandom(tileTextures.weedsBack)
              : getRandom(tileTextures.grassClutter)
          )
          //.setFlipped(true)
          .serialize()
      ];
    }

    return [];
  }

  getSurfaceBrush() {
    return getRandom(tileTextures.groundBrush);
  }
}

export default WaterFactory;
