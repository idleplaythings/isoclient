import * as THREE from "three";
import TileChunk from "./TileChunk";

class TileLibrary {
  constructor() {
    this.chunks = [];
    this.chunkSize = 24;
    this.renderArea = null;
    this.changed = false;
    this.forRender = [];
    this.renderChunks = [];
    this.chunksByLocation = {};
  }

  getChunkForTile(tile) {
    const key = this.getChunkKeyForTile(tile);
    return this.chunksByLocation[key];
  }

  getChunkKeyForTile(tile) {
    const position = this.getChunkPosition(tile);
    return position.x + ":" + position.y;
  }

  createChunkForTile(tile) {
    if (this.getChunkForTile(tile)) {
      throw new Error("This tile already has a TileChunk");
    }

    const chunk = new TileChunk(this.getChunkPosition(tile), this.chunkSize);
    this.chunksByLocation[chunk.position.x + ":" + chunk.position.y] = chunk;
    this.chunks.push(chunk);

    return chunk;
  }

  getChunkPosition(tile) {
    let x = null;
    let y = null;

    if (tile.position.x < 0) {
      const mod = tile.position.x % this.chunkSize;
      if (mod !== 0) {
        x = tile.position.x - mod - this.chunkSize;
      } else {
        x = tile.position.x;
      }
    } else {
      x = tile.position.x - (tile.position.x % this.chunkSize);
    }

    if (tile.position.y < 0) {
      y = tile.position.y - (tile.position.y % this.chunkSize);
    } else {
      const mod = tile.position.y % this.chunkSize;
      if (mod !== 0) {
        y = tile.position.y + (this.chunkSize - mod);
      } else {
        y = tile.position.y;
      }
    }
    return new THREE.Vector3(x, y, 0);
  }

  add(tile) {
    let chunk = this.getChunkForTile(tile);

    if (!chunk) {
      chunk = this.createChunkForTile(tile);
    }

    chunk.addTile(tile);
    if (this.renderArea && this.renderArea.containsChunk(chunk)) {
      this.changed = true;
    }
  }

  remove(tile) {
    const chunk = this.getChunkForTile(tile);

    if (!chunk) {
      return;
    }

    chunk.removeTile(tile);
  }

  hasChanged(renderArea) {
    return !renderArea.equals(this.renderArea) || this.changed === true;
  }

  sortChunks(a, b) {
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

    return 0;
  }

  getForRendering(renderArea) {
    //const start = new Date().getTime();
    if (!renderArea.equals(this.renderArea)) {
      this.renderChunks = this.chunks.filter(chunk =>
        renderArea.containsChunk(chunk)
      );

      this.renderChunks = this.renderChunks.sort(this.sortChunks);
    }

    //const chunksortEnd = new Date().getTime();

    this.renderChunks.forEach(chunk => chunk.sort());

    const forRender = this.renderChunks.map(chunk => chunk.getForRender());
    this.forRender = [].concat(...forRender);

    //const ready = new Date().getTime();

    /*
    console.log(
      "sorting chunks took",
      chunksortEnd - start,
      "sorting tiles took",
      ready - chunksortEnd
    );
    */

    this.changed = false;

    this.renderArea = renderArea;
    return this.forRender;
  }
}

window.TileLibrary = TileLibrary;
export default TileLibrary;
