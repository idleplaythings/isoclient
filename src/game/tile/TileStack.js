import Tile from "./Tile";

const aTile = new Tile();
const bTile = new Tile();

class TileStack {
  constructor() {
    this.tiles = [];
    this.needSorting = false;
  }

  add(tile) {
    this.tiles.push(tile);
    this.needSorting = true;
  }

  remove(tile) {
    this.tiles = this.tiles.filter(other => tile !== other);
  }

  sort() {
    if (!this.needSorting) {
      return;
    }

    this.tiles = this.tiles.sort((a, b) => {
      aTile.deserialize(a);
      bTile.deserialize(b);

      if (aTile.chunkPosition.z > bTile.chunkPosition.z) {
        return 1;
      }

      if (bTile.chunkPosition.z > aTile.chunkPosition.z) {
        return -1;
      }

      return 0;
    });

    this.needSorting = false;
  }
}

export default TileStack;
