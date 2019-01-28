import ndarray from "ndarray";
import { getChunkPosition, getChunkKey } from "../../model/tile/Chunk";
import TileBinaryChunk from "./TileBinaryChunk";
import { TileFactory } from ".";
import TileChunk from "./TileChunk";

class TileLibrary {
  constructor() {
    this.binaryChunkSize = 1024;
    this.tileBinaryChunks = {}; //promises of binary chunks
    this.tileFactory = new TileFactory();
  }

  getTileChunksForRenderArea(chunkPositions, chunkSize, tileRenderer) {
    chunkPositions.forEach(chunkPosition =>
      this.buildChunk(chunkPosition, chunkSize, tileRenderer)
    );
  }

  async buildChunk(position, chunkSize, tileRenderer) {
    const binaryChunkPosition = getChunkPosition(
      position,
      this.binaryChunkSize
    );

    const key = getChunkKey(binaryChunkPosition);

    if (!this.tileBinaryChunks[key]) {
      this.tileBinaryChunks[key] = this.loadBinaryChunk(binaryChunkPosition);
    }

    const binaryChunk = await this.tileBinaryChunks[key];
    this.touchBinaryChunk(binaryChunk, position);
    const chunk = this.createChunk(position, chunkSize, binaryChunk);
    tileRenderer.addChunk(chunk);
  }

  touchBinaryChunk(chunk, position) {
    chunk.touch();

    //if position is close to edge of the chunk, preload next binary chunk and touch edge chunks to keep them alive
  }

  createChunk(position, chunkSize, binaryChunk) {
    binaryChunk.zoomToChunk(position, chunkSize);
    const tiles = this.tileFactory.create(position, chunkSize, binaryChunk);
    binaryChunk.resetZoom();
    return new TileChunk(position, chunkSize, tiles);
  }

  loadBinaryChunk(binaryChunkPosition) {
    return new Promise((resolve, reject) => {
      const oReq = new XMLHttpRequest();
      oReq.open("GET", "data/result.bin", true);
      oReq.responseType = "arraybuffer";

      oReq.onload = oEvent => {
        console.log("hi=");
        const arrayBuffer = oReq.response; // Note: not oReq.responseText
        if (arrayBuffer) {
          const data = ndarray(new Uint8Array(arrayBuffer), [1024, 1024, 4]);
          console.log(data);
          const tileSet = new TileBinaryChunk(data);
          resolve(tileSet);
        }
      };

      oReq.onerror = error => {
        console.log("Error loading binary chunk", error);
        reject(error);
      };

      oReq.send(null);
    });
  }

  render() {
    //forget those that have not been used for a while
  }
}

export default TileLibrary;
