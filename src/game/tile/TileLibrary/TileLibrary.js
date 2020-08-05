import ndarray from "ndarray";
import { getChunkPosition, getChunkKey } from "../../../model/tile/Chunk";
import TileBinaryChunk from "../TileBinaryChunk";
import TileFactoryWorker from "../tileFactory/TileFactory.worker";
import PathfindingWorker from "./Pathfinding.worker";
import WorkerPool from "../../../util/WorkerPool";
import * as THREE from "three";
import DynamicEntitiesCache from "./DynamicEntitiesCache";

window.TileBinaryChunk = TileBinaryChunk;

class TileLibrary {
  constructor() {
    this.binaryChunkSize = 1024;
    this.tileBinaryChunks = {}; //promises of binary chunks
    this.tileFactoryPool = new WorkerPool([new TileFactoryWorker()]);
    this.pathFindingPool = new WorkerPool([new PathfindingWorker()]);

    this.dynamicEntities = new DynamicEntitiesCache(); //All known dynamic entities keyed by x-y
  }

  addProp(payload) {
    console.log("add prop", payload);
  }

  async findEntity(position) {
    const binaryChunkPosition = getChunkPosition(
      position,
      this.binaryChunkSize
    );

    const key = getChunkKey(binaryChunkPosition);

    if (!this.tileBinaryChunks[key]) {
      return { prop: null, entities: [] };
    }

    const binaryChunk = await this.tileBinaryChunks[key];
    const positionInChunk = binaryChunk.getPositionIn(position);
    const entities = this.dynamicEntities.getByPosition(position);

    const prop = binaryChunk.getProp(positionInChunk);
    return { prop, entities };
  }

  addDynamicEntity(entities = []) {
    this.dynamicEntities.addDynamicEntity(entities);
  }

  async findPath(start, end) {
    const chunks = await this.getTileBinaryChunks();

    const { path } = await this.pathFindingPool.work({
      start,
      end,
      chunks: chunks.map((c) => c.serialize()),
      dynamicEntities: this.dynamicEntities.getEntities(),
    });

    return path;
  }

  async getTileChunkForRenderArea(position, chunkSize) {
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

    /*
    console.log(
      "position",
      position,
      "binaryChunkPosition",
      binaryChunkPosition,
      "positionInChunk",
      positionInChunk
    );
    */

    const { data } = await this.tileFactoryPool.work({
      position: positionInChunk,
      chunkSize,
      data: binaryChunk.getData(),
      binaryChunkPosition: binaryChunkPosition,
      dynamicEntities: this.dynamicEntities.getEntitiesForChunk(
        positionInChunk,
        binaryChunkPosition,
        chunkSize
      ),
    });

    return data;
  }

  touchBinaryChunk(chunk, position) {
    chunk.touch();

    //if position is close to edge of the chunk, preload next binary chunk and touch edge chunks to keep them alive
  }

  getTileBinaryChunks() {
    //TODO: filter irrelevant chunks out of this
    return Promise.all(
      Object.keys(this.tileBinaryChunks).map(
        async (key) => this.tileBinaryChunks[key]
      )
    );
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
          const data = ndarray(new Uint8Array(arrayBuffer), [
            this.binaryChunkSize + 2,
            this.binaryChunkSize + 2,
            4,
          ]);
          const tileSet = new TileBinaryChunk(data, {
            x: binaryChunkPosition.x - 1,
            y: binaryChunkPosition.y + 1,
          });
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
