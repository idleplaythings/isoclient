import Tile from "../Tile";
import * as TileTypes from "../../../model/tile/TileTypes";
import * as tileTextures from "../../texture/TextureTypes";

const flyTile = new Tile();

const getRandom = type => Math.floor(Math.random() * type.amount) + type.start;

class GrassFactory{

    createGround(position, height, type, prop, visual) {
        const tiles = [
            flyTile
                .reset()
                .setChunkPosition(position.x, position.y, height)
                .setSurfaceBrush(this.getSurfaceBrush(visual))
                .setSurfaceTexture(this.getSurfacetexture(visual))
                .setBrushedType()
                .serialize()
            ];
    
        const clutter = flyTile.reset()
            .setChunkPosition(position.x, position.y, height + 1)
            .setTexture(0, getRandom(tileTextures.grassClutter))
            .setTexture(1, getRandom(tileTextures.twigClutter))
            //.setTexture(2, this.getSurfaceClutterRocks())
            .setFlipped(true)
            .serialize();

        tiles.push(clutter);
        return tiles;
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