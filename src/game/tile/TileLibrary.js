import ndarray from "ndarray";
import { getChunkPosition, getChunkKey } from "../../model/tile/Chunk";
import TileBinaryChunk from "./TileBinaryChunk";
import TileFactoryWorker from "./tileFactory/TileFactory.worker";
import WorkerPool from "../../util/WorkerPool";
import * as THREE from "three";

window.TileBinaryChunk = TileBinaryChunk;

class TileLibrary {
  constructor() {
    this.binaryChunkSize = 1024;
    this.tileBinaryChunks = {}; //promises of binary chunks
    this.tileFactoryPool = new WorkerPool([new TileFactoryWorker()]);
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

    const positionInChunk = new THREE.Vector3(position.x, position.y, 0).sub(
      new THREE.Vector3(binaryChunkPosition.x, binaryChunkPosition.y, 0)
    );

    const { data } = await this.tileFactoryPool.work({
      position: positionInChunk,
      chunkSize,
      data: binaryChunk.getData(),
      binaryChunkPosition: binaryChunkPosition,
    });

    return data;
  }

  touchBinaryChunk(chunk, position) {
    chunk.touch();

    //if position is close to edge of the chunk, preload next binary chunk and touch edge chunks to keep them alive
  }

  loadBinaryChunk(binaryChunkPosition) {
    console.log("LOAD BINARY CHUNK", binaryChunkPosition);
    return new Promise((resolve, reject) => {
      const oReq = new XMLHttpRequest();
      oReq.open("GET", "data/result.bin", true);
      oReq.responseType = "arraybuffer";

      oReq.onload = (oEvent) => {
        const arrayBuffer = oReq.response; // Note: not oReq.responseText
        if (arrayBuffer) {
          window.testArray = new Uint8Array(arrayBuffer);
          window.ndarray = ndarray;
          const data = ndarray(new Uint8Array(arrayBuffer), [1026, 1026, 4]);
          const tileSet = new TileBinaryChunk(data);
          resolve(tileSet);
        }
      };

      oReq.onerror = (error) => {
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
