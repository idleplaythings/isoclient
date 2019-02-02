import TileStack from "./TileStack";
import Chunk from "../../model/tile/Chunk";
import Tile from "./Tile";

const flyTile = new Tile();

const initDirectory = size => {
  const directory = [];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!directory[y]) {
        directory[y] = [];
      }

      directory[y].push(new TileStack());
    }
  }

  return directory;
};

class TileChunk extends Chunk {
  constructor(position, size, tiles = []) {
    super(position, size);
    this.tiles = [];
    this.directory = initDirectory(size);
    this.addTiles(tiles);
    this.forRender = [];
    this.changed = true;
  }

  getStack(position) {
    if (!this.contains(position)) {
      console.log(this.position, this.size);
      throw new Error(
        "Position, " +
          position.x +
          "," +
          position.y +
          " is not in this directory. Chunk position " +
          this.position.x +
          "," +
          this.position.y +
          " chunk size: " +
          this.size
      );
    }

    const chunkPosition = this.getPositionInChunk(position);

    const xRow = this.directory[chunkPosition.y];
    const stack = xRow[chunkPosition.x];

    return stack;
  }

  addTiles(tiles) {
    tiles.forEach(this.addTile.bind(this));
  }

  addTile(tile) {
    flyTile.deserialize(tile);
    const tileStack = this.getStack(flyTile.position);
    tileStack.add(tile);
    this.changed = true;
    this.tiles.push(tile);
  }

  removeTiles(tiles) {
    tiles.forEach(this.removeTile);
  }

  removeTile(tile) {
    flyTile.deserialize(tile);
    const tileStack = this.getStack(flyTile.position);
    tileStack.remove(tile);
    this.changed = true;
  }

  sort() {
    this.directory.forEach(row => row.forEach(stack => stack.sort()));
  }

  /*
  getForRenderBypassStacks() {
    if (!this.changed) {
      return this.forRender;
    }

    this.forRender = this.tiles.sort((a, b) => {
      if (a.position.x < b.position.x) {
        return -1;
      }

      if (b.position.x < a.position.x) {
        return 1;
      }

      if (a.position.y > b.position.y) {
        return -1;
      }

      if (b.position.y > a.position.y) {
        return 1;
      }

      if (a.position.z > b.position.z) {
        return 1;
      }

      if (b.position.z > a.position.z) {
        return -1;
      }

      return 0;
    });

    return this.forRender;
  }
  */

  getForRender() {
    if (!this.changed) {
      return this.forRender;
    }

    //return this.getForRenderBypassStacks();
    //const start = new Date().getTime();
    this.sort();

    //const sortEnd = new Date().getTime();

    this.forRender = [].concat(
      ...[].concat(
        this.directory.map(row => [].concat(...row.map(stack => stack.tiles)))
      )
    );

    /*
    const end = new Date().getTime();
    console.log(
      "sorting stacks took",
      sortEnd - start,
      "constructing array took",
      end - sortEnd
    );
    */

    this.changed = false;
    return this.forRender;
  }
}

window.TileChunk = TileChunk;
export default TileChunk;
