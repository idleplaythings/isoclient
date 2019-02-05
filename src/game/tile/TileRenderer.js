import TileChunk from "./TileChunk";
import { getChunkPosition, getChunkKey } from "../../model/tile/Chunk";
import InstanceFactory from "./InstanceFactory";
import TileAssignmentWorker from "./TileAssignment.worker";
import WorkerPool from "../../util/WorkerPool";

class TileRenderer {
  constructor(scene, gameCamera, world) {
    //This will need a some link to the hotspot: what this area of game is actually following
    //Good practice to code this so that the game allows multiple cameras to be active at the same time: follow adventurers and home same time
    this.world = world;
    this.instanceCount = 5000;
    this.instanceFactory = new InstanceFactory(scene, this.instanceCount);
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

    this.tileWorkerPool = new WorkerPool([new TileAssignmentWorker()]);

    //this.tileWorkerPool.debug = true;

    window.testTileRenderer = this;
  }

  async assignTiles(tiles) {
    console.log("assign");

    if (!tiles || tiles.length === 0) {
      return;
    }

    while (this.capacity < tiles.length) {
      const newContainer = this.instanceFactory.create();
      this.containers.push(newContainer);
      this.capacity += newContainer.amount;
    }

    const { lists } = await this.tileWorkerPool.work({
      tiles,
      size: this.instanceCount,
      containerCount: this.containers.length
    });

    performance.mark("assignStart");
    //const start = performance.now();

    this.containers.forEach((container, i) => {
      container.unassignEverything();

      if (lists[i]) {
        container.setArrays(lists[i]);
      }

      container.markUpdated();
    });

    //console.log("assign time", performance.now() - start);
    performance.mark("assignEnd");
    performance.measure("assign", "assignStart", "assignEnd");
  }

  render(delta) {
    if (!this.instanceFactory.ready) {
      return;
    }

    performance.mark("renderStart");
    const renderArea = this.gameCamera.getRenderArea(this.chunkSize);

    if (this.hasChanged(renderArea)) {
      this.getChunkPositionsForNewRenderArea(renderArea);
      this.assignTiles(this.getForRendering(renderArea));
      this.renderArea = renderArea;
    }

    //forget chunks that have not been touched for a while
    performance.mark("renderEnd");
    performance.measure("render", "renderStart", "renderEnd");
    const render = performance.getEntriesByName("render")[0].duration;
    if (render > 5) {
      const assign = performance.getEntriesByName("assign")[0];
      console.log(
        "assign:",
        assign ? assign.duration : "null",
        "render:",
        render
      );
    }
    /*
    if (Math.random() > 0.9) {
        const chunk = this.chunks[Math.floor(Math.random() * this.chunks.length)];

        if (chunk) {
            const position = {
                x: chunk.position.x + Math.floor(Math.random()*31),
                y: chunk.position.y - Math.floor(Math.random()*31),
                z: 1
            }

            this.add([position.x, position.y, position.z,
                Math.floor(Math.random() * 5) + 231,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                0,
                1,
                0]
            );
        }
    }
*/
    // Clean up the stored markers.
    performance.clearMarks();
    performance.clearMeasures();
  }

  getChunkPositionsForNewRenderArea(renderArea) {
    const positions = renderArea.requiresChunks();

    const need = positions.filter(
      position =>
        !Boolean(this.chunksByLocation[getChunkKey(position)]) &&
        !Boolean(this.pendingChunksByLocation[getChunkKey(position)])
    );

    this.chunks = this.chunks.filter(chunk => {
      const found = positions.find(
        position =>
          chunk.position.x === position.x && chunk.position.y === position.y
      );

      if (!found) {
        delete this.chunksByLocation[getChunkKey(chunk.position)];
      }

      return found;
    });

    need.forEach(async needPosition => {
      const needKey = getChunkKey(needPosition);

      this.pendingChunksByLocation[needKey] = true;

      const chunk = await this.world.getTileChunkForRenderArea(
        needPosition,
        this.chunkSize
      );

      delete this.pendingChunksByLocation[needKey];

      this.addChunk(chunk);
    });
  }

  getChunkForTile(position) {
    const key = this.getChunkKeyForTile(position);
    return this.chunksByLocation[key];
  }

  getChunkKeyForTile(position) {
    const cPosition = getChunkPosition(position, this.chunkSize);
    return cPosition.x + ":" + cPosition.y;
  }

  createChunkForTile(tile) {
    if (this.getChunkForTile(tile)) {
      throw new Error("This tile already has a TileChunk");
    }

    const chunk = new TileChunk(
      getChunkPosition({ x: tile[0], y: tile[1], z: tile[2] }, this.chunkSize),
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
    let chunk = this.getChunkForTile({ x: tile[0], y: tile[1], z: tile[2] });

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
