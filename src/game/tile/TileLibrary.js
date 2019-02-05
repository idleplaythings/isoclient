import ndarray from "ndarray";
import { getChunkPosition, getChunkKey } from "../../model/tile/Chunk";
import TileBinaryChunk from "./TileBinaryChunk";
import { TileFactory } from ".";
import TileChunk from "./TileChunk";
import TileFactoryWorker from "./TileFactory.worker";
import WorkerPool from "../../util/WorkerPool";

class TileLibrary {
  constructor() {
    this.binaryChunkSize = 1024;
    this.tileBinaryChunks = {}; //promises of binary chunks
    this.tileFactory = new TileFactory();
    this.tileFactoryPool = new WorkerPool([
      new TileFactoryWorker(),
      new TileFactoryWorker(),
      new TileFactoryWorker(),
      new TileFactoryWorker()
    ]);
  }

  async getTileChunksForRenderArea(position, chunkSize) {
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
    return this.createChunk(position, chunkSize, binaryChunk);
  }

  touchBinaryChunk(chunk, position) {
    chunk.touch();

    //if position is close to edge of the chunk, preload next binary chunk and touch edge chunks to keep them alive
  }

  async createChunk(position, chunkSize, binaryChunk) {
    const { tiles } = await this.tileFactoryPool.work({
      position,
      chunkSize,
      data: binaryChunk.getData()
    });

    const tileChunk = new TileChunk(position, chunkSize, tiles);
    return tileChunk;
  }

  loadBinaryChunk(binaryChunkPosition) {
    return new Promise((resolve, reject) => {
      const oReq = new XMLHttpRequest();
      oReq.open("GET", "data/result.bin", true);
      oReq.responseType = "arraybuffer";

      oReq.onload = oEvent => {
        const arrayBuffer = oReq.response; // Note: not oReq.responseText
        if (arrayBuffer) {
          const data = ndarray(new Uint8Array(arrayBuffer), [1024, 1024, 4]);
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
