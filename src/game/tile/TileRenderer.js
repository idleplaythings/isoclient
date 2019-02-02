import TileChunk from "./TileChunk";
import { getChunkPosition, getChunkKey } from "../../model/tile/Chunk";
import InstanceFactory from "./InstanceFactory";

class TileRenderer {
  constructor(scene, gameCamera, world) {
    //This will need a some link to the hotspot: what this area of game is actually following
    //Good practice to code this so that the game allows multiple cameras to be active at the same time: follow adventurers and home same time
    this.world = world;
    this.instanceFactory = new InstanceFactory(scene);
    this.capacity = 0;
    this.containers = [];
    this.gameCamera = gameCamera;
    this.chunks = [];
    this.chunkSize = 32;
    this.renderArea = null;
    this.changed = false;
    this.chunksChanged = false;
    this.forRender = [];
    this.renderChunks = [];
    this.chunksByLocation = {};
    this.pendingChunksByLocation = {};

    window.testTileRenderer = this;
  }

  async assignTiles(tiles) {
    await this.instanceFactory.ready;

    //const start = new Date().getTime();

    while (this.capacity < tiles.length) {
      const newContainer = this.instanceFactory.create();
      this.containers.push(newContainer);
      this.capacity += newContainer.amount;
    }

    let tileIndex = 0;
    this.containers.forEach(container => {
      container.unassignEverything();

      for (let i = 0; i < container.amount && tileIndex < tiles.length; i++) {
        const tile = tiles[tileIndex];

        container.add(tile, i);
        tileIndex++;
      }
    });

    //console.log("current capacity", this.capacity);

    //console.log("ASSIGNED tiles, took", new Date().getTime() - start, "ms");
  }

  render() {
    const renderArea = this.gameCamera.getRenderArea(this.chunkSize);
    if (this.hasChanged(renderArea)) {
      this.getChunkPositionsForNewRenderArea(renderArea);
      this.assignTiles(this.getForRendering(renderArea));
      this.renderArea = renderArea;
    }

    //forget chunks that have not been touched for a while
  }

  getChunkPositionsForNewRenderArea(renderArea) {
    const positions = renderArea.requiresChunks();

    const need = positions.filter(
      position =>
        !Boolean(this.chunksByLocation[getChunkKey(position)]) &&
        !Boolean(this.pendingChunksByLocation[getChunkKey(position)])
    );

    need.forEach(async needPosition => {
      const needKey = getChunkKey(needPosition);

      if (needPosition.x === 32 && needPosition.y === -32) {
        //console.log("requesting 32, -32");
      }

      this.pendingChunksByLocation[needKey] = true;

      const chunk = await this.world.getTileChunkForRenderArea(
        needPosition,
        this.chunkSize
      );

      delete this.pendingChunksByLocation[needKey];

      this.addChunk(chunk);
    });
  }

  getChunkForTile(tile) {
    const key = this.getChunkKeyForTile(tile);
    return this.chunksByLocation[key];
  }

  getChunkKeyForTile(tile) {
    const position = getChunkPosition(tile, this.chunkSize);
    return position.x + ":" + position.y;
  }

  createChunkForTile(tile) {
    if (this.getChunkForTile(tile)) {
      throw new Error("This tile already has a TileChunk");
    }

    const chunk = new TileChunk(
      getChunkPosition(tile, this.chunkSize),
      this.chunkSize
    );
    this.chunksByLocation[chunk.position.x + ":" + chunk.position.y] = chunk;
    this.chunks.push(chunk);

    return chunk;
  }

  addChunk(chunks) {
    if (!chunks || chunks.length === 0) {
      return;
    }

    chunks = [].concat(chunks);

    chunks.forEach(chunk => {
      this.chunksByLocation[chunk.position.x + ":" + chunk.position.y] = chunk;
      this.chunks.push(chunk);
    });

    this.changed = true;
    this.chunksChanged = true;
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
    //const start = performance.now();
    if (!renderArea.equals(this.renderArea) || this.chunksChanged) {
      this.renderChunks = this.chunks.filter(chunk =>
        renderArea.containsChunk(chunk)
      );

      this.renderChunks = this.renderChunks.sort(this.sortChunks);
    }

    //const chunksortEnd = performance.now();

    this.renderChunks.forEach(chunk => chunk.sort());

    const forRender = this.renderChunks.map(chunk => chunk.getForRender());
    this.forRender = [].concat(...forRender);

    /*
    const ready = performance.now();

    console.log(
      "sorting chunks took",
      chunksortEnd - start,
      "sorting tiles took",
      ready - chunksortEnd
    );

    */

    this.changed = false;
    this.chunksChanged = false;
    return this.forRender;
  }
}

export default TileRenderer;
