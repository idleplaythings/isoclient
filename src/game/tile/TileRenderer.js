import { getChunkPosition, getChunkKey } from "../../model/tile/Chunk";
import InstanceFactory from "./InstanceFactory";
import WorldChunk from "./Chunk/WorldChunk";
import ChunkImageManipulator from "./ChunkImageManipulator";
import GroundTileGeometryFactory from "./tileFactory/GroundTileGeometryFactory";

class TileRenderer {
  constructor(scene, gameCamera, tileLibrary, chunkSize) {
    //This will need a some link to the hotspot: what this area of game is actually following
    //Good practice to code this so that the game allows multiple cameras to be active at the same time: follow adventurers and home same time
    this.tileLibrary = tileLibrary;
    this.instanceFactory = new InstanceFactory(scene);
    this.gameCamera = gameCamera;
    this.chunks = [];
    this.chunkSize = chunkSize;
    this.renderArea = null;
    this.changed = false;
    this.forRender = [];
    this.renderChunks = [];
    this.chunksByLocation = {};
    this.pendingChunksByLocation = {};
    this.freeChunks = [];
    this.scene = scene;

    this.groundTileGeometryFactory = new GroundTileGeometryFactory(
      this.chunkSize
    );
    this.chunkImageManipulator = new ChunkImageManipulator(this.scene);

    window.testTileRenderer = this;

    /*
    this.add(
      new Tile()
        .setPosition({ x: 505, y: 515, z: 2 })
        .setScale(2)
        .setSurfaceTexture(256)
    );

    this.add(
      new Tile()
        .setPosition({ x: 508, y: 515, z: 2 })
        .setScale(2)
        .setSurfaceTexture(257)
    );

    this.add(
      new Tile()
        .setPosition({ x: 510, y: 515, z: 2 })
        .setScale(2)
        .setSurfaceTexture(258)
    );

    this.add(
      new Tile()
        .setPosition({ x: 512, y: 515, z: 2 })
        .setScale(2)
        .setSurfaceTexture(259)
    );
    this.add(
      new Tile()
        .setPosition({ x: 514, y: 515, z: 2 })
        .setScale(2)
        .setSurfaceTexture(260)
    );
    this.add(
      new Tile()
        .setPosition({ x: 516, y: 515, z: 2 })
        .setScale(2)
        .setSurfaceTexture(261)
    );

    this.add(
      new Tile()
        .setPosition({ x: 518, y: 515, z: 2 })
        .setScale(2)
        .setSurfaceTexture(262)
    );

    this.add(
      new Tile()
        .setPosition({ x: 520, y: 515, z: 2 })
        .setScale(2)
        .setSurfaceTexture(263)
    );

    this.add(
      new Tile()
        .setPosition({ x: 522, y: 515, z: 2 })
        .setScale(2)
        .setSurfaceTexture(264)
    );

    this.add(
      new Tile()
        .setPosition({ x: 524, y: 515, z: 2 })
        .setScale(2)
        .setSurfaceTexture(265)
    );

    this.add(
      new Tile()
        .setPosition({ x: 526, y: 515, z: 2 })
        .setScale(2)
        .setSurfaceTexture(266)
    );

    this.add(
      new Tile().setPosition({ x: 505, y: 510, z: 2 }).setSurfaceTexture(1)
    );
    this.add(
      new Tile().setPosition({ x: 506, y: 510, z: 2 }).setSurfaceTexture(2)
    );
    this.add(
      new Tile().setPosition({ x: 507, y: 510, z: 2 }).setSurfaceTexture(3)
    );
    this.add(
      new Tile().setPosition({ x: 508, y: 510, z: 2 }).setSurfaceTexture(4)
    );

    this.add(
      new Tile().setPosition({ x: 509, y: 510, z: 2 }).setSurfaceTexture(250)
    );
    */
  }

  render({ now, delta, ...rest }) {
    if (!this.instanceFactory.ready) {
      return;
    }

    this.renderChunks.forEach((chunk) => chunk.render({ now, delta }));
    const renderArea = this.gameCamera.getRenderArea(this.chunkSize);

    if (this.changed) {
      this.setRenderChunks(renderArea);
    }

    if (!renderArea.equals(this.renderArea)) {
      this.getChunkPositionsForNewRenderArea(renderArea);
      this.renderArea = renderArea;
    }

    this.chunkImageManipulator.setFree();

    this.instanceFactory.render({ now, delta, ...rest });

    /*
    if (Math.random() > 0.9) {
      const chunk = this.chunks[Math.floor(Math.random() * this.chunks.length)];

      if (chunk) {
        const position = {
          x:
            chunk.position.x + Math.floor(Math.random() * (this.chunkSize - 1)),
          y:
            chunk.position.y - Math.floor(Math.random() * (this.chunkSize - 1)),
          z: 1,
        };

        this.add(new Tile().setPosition(position).setSurfaceTexture(232));
      }
    }
    */
  }

  getChunkPositionsForNewRenderArea(renderArea) {
    const positions = renderArea.requiresChunks();

    const need = positions.filter((position) => {
      if (Boolean(this.pendingChunksByLocation[getChunkKey(position)])) {
        return false;
      }

      const chunk = this.chunksByLocation[getChunkKey(position)];

      if (chunk && chunk.isLoaded()) {
        return false;
      }

      return true;
    });

    this.chunks = this.chunks.filter((chunk) => {
      const found = positions.find(
        (position) =>
          chunk.position.x === position.x && chunk.position.y === position.y
      );

      if (!found) {
        delete this.chunksByLocation[getChunkKey(chunk.position)];
        this.freeChunks.push(chunk);
        chunk.hibernate();
      }

      return found;
    });

    need.forEach(async (needPosition) => {
      const needKey = getChunkKey(needPosition);

      this.pendingChunksByLocation[needKey] = true;

      const data = await this.tileLibrary.getTileChunkForRenderArea(
        needPosition,
        this.chunkSize
      );

      delete this.pendingChunksByLocation[needKey];

      const chunk = this.getChunk(needPosition);
      chunk.addData(data);
    });
  }

  getChunk(position) {
    const key = getChunkKey(position);

    if (this.chunksByLocation[key]) {
      return this.chunksByLocation[key];
    }

    let chunk = this.freeChunks.pop();

    if (!chunk) {
      chunk = new WorldChunk(
        position,
        this.chunkSize,
        this.scene,
        this.chunkImageManipulator,
        this.groundTileGeometryFactory.create(),
        this.instanceFactory
      );

      chunk.wakeUp();
      this.chunksByLocation[chunk.position.x + ":" + chunk.position.y] = chunk;
      this.chunks.push(chunk);
      //console.log("created chunk", chunk.position.x, chunk.position.y);
    } else {
      chunk.setPosition(position);
      this.chunksByLocation[chunk.position.x + ":" + chunk.position.y] = chunk;
      chunk.wakeUp();
      this.chunks.push(chunk);
    }

    this.changed = true;
    return chunk;
  }

  getChunkForTile(tile) {
    const position = getChunkPosition(tile.position, this.chunkSize);
    return this.getChunk(position);
  }

  add(tile) {
    let chunk = this.getChunkForTile(tile);
    const positionInChunk = tile.position.clone().sub(chunk.position);

    tile.setChunkPosition(
      positionInChunk.x,
      positionInChunk.y,
      positionInChunk.z
    );

    chunk.addTile(tile.serialize());
  }

  remove(tile) {
    throw new Error("Removing tiles is not implemented yet");
  }

  hasChanged(renderArea) {
    return !renderArea.equals(this.renderArea) || this.changed === true;
  }

  setRenderChunks(renderArea) {
    this.renderChunks = this.chunks.filter((chunk) =>
      renderArea.containsChunk(chunk)
    );

    this.changed = false;
  }
}

export default TileRenderer;
