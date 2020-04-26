import Tile from "../Tile";
import * as tileTextures from "../../texture/TextureTypes";
import { getRandom } from "./Utils";

const flyTile = new Tile();

class TreeFactory {
  createTree(props) {
    const { position, height } = props;
    return [
      /*
      flyTile
        .reset()
        .setChunkPosition(position.x, position.y, height + 1)
        .setTexture(0, 96)
        .serialize(),
      flyTile
        .reset()
        .setChunkPosition(position.x, position.y, height + 2)
        .setTexture(0, 96)
        .serialize(),
      flyTile
        .reset()
        .setChunkPosition(position.x, position.y, height + 3)
        .setTexture(0, 96)
        .serialize(),
      flyTile
        .reset()
        .setChunkPosition(position.x, position.y, height + 4)
        .setTexture(0, 96)
        .serialize(),

        */
      flyTile
        .reset()
        .setChunkPosition(position.x, position.y, height + 1)
        .setTexture(0, getRandom(tileTextures.largeFoliage))
        .setScale(2)
        .serialize(),

      /*

      flyTile
        .reset()
        .setChunkPosition(position.x + 1, position.y - 1, height + 6)
        .setOffset(0.001, -0.001, 0.001)
        .setTexture(0, getRandom(tileTextures.largeFoliage))
        .setScale(2)
        .serialize(),

      flyTile
        .reset()
        .setChunkPosition(position.x + 1, position.y - 1, height + 8)
        .setOffset(0.001, -0.001, 0.001)
        .setTexture(0, getRandom(tileTextures.largeFoliage))
        .setScale(2)
        .serialize(),

      flyTile
        .reset()
        .setChunkPosition(position.x + 1, position.y - 1, height + 10)
        .setOffset(0.001, -0.001, 0.001)
        .setTexture(0, getRandom(tileTextures.largeFoliage))
        .setScale(2)
        .serialize()
        */
    ];
  }
}

export default TreeFactory;
