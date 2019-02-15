import TileChunk from "./TileChunk";
import { getChunkPosition, getChunkKey } from "../../model/tile/Chunk";
import InstanceFactory from "./InstanceFactory";
import Tile from "./Tile";

class TileRenderer {
  constructor(scene, gameCamera, world) {
    //This will need a some link to the hotspot: what this area of game is actually following
    //Good practice to code this so that the game allows multiple cameras to be active at the same time: follow adventurers and home same time
    this.world = world;
    this.instanceFactory = new InstanceFactory(scene);
    this.gameCamera = gameCamera;
    this.chunks = [];
    this.chunkSize = 16;
    this.renderArea = null;
    this.changed = false;
    this.forRender = [];
    this.renderChunks = [];
    this.chunksByLocation = {};
    this.pendingChunksByLocation = {};
    this.freeChunks = [];

    window.testTileRenderer = this;

    /*
    this.add(
      new Tile()
        .setPosition(0, 0, 1)
        .setSurfaceTexture(68)
        .setBrushedType()
        .setSurfaceBrush(1)
        .setShadowBrush(16)
    );

    /*
    this.add(
      new Tile()
        .setPosition(0, 0, 1.01)
        .setSurfaceTexture(72)
        .setBrushedType()
        .setSurfaceBrush(1)
        .setHighlightBrush(16)
    );
    */

    //this.add(new Tile().setPosition(0, 0, 1.01).setWaterType());

    //this.add(new Tile().setPosition(-1, 0, 0.5).setSurfaceTexture(232));
  }

  render(now, delta) {
    if (!this.instanceFactory.ready) {
      return;
    }

    this.renderChunks.forEach(chunk => chunk.render(now, delta));
    const renderArea = this.gameCamera.getRenderArea(this.chunkSize);

    if (this.changed) {
      this.setRenderChunks(renderArea);
    }

    if (!renderArea.equals(this.renderArea)) {
      this.getChunkPositionsForNewRenderArea(renderArea);
      this.renderArea = renderArea;
    }

    /*
    if (Math.random() > 0.9) {
      const chunk = this.chunks[Math.floor(Math.random() * this.chunks.length)];

      if (chunk) {
        const position = {
          x:
            chunk.position.x + Math.floor(Math.random() * (this.chunkSize - 1)),
          y:
            chunk.position.y - Math.floor(Math.random() * (this.chunkSize - 1)),
          z: 1
        };

        this.add(new Tile().setPosition(position).setSurfaceTexture(232));
      }
    }
    */
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
        this.freeChunks.push(chunk);
        chunk.hibernate();
      }

      return found;
    });

    need.forEach(async needPosition => {
      const needKey = getChunkKey(needPosition);

      this.pendingChunksByLocation[needKey] = true;

      const tiles = await this.world.getTileChunkForRenderArea(
        needPosition,
        this.chunkSize
      );

      delete this.pendingChunksByLocation[needKey];

      const chunk = this.getChunk(needPosition);
      chunk.addTiles(tiles);
    });
  }

  getChunk(position) {
    const key = getChunkKey(position);

    if (this.chunksByLocation[key]) {
      return this.chunksByLocation[key];
    }

    let chunk = this.freeChunks.pop();

    if (!chunk) {
      chunk = new TileChunk(position, this.chunkSize, this.instanceFactory);
      this.chunksByLocation[chunk.position.x + ":" + chunk.position.y] = chunk;
      this.chunks.push(chunk);
      //console.log("created chunk", chunk.position.x, chunk.position.y);
    } else {
      chunk.setPosition(position);
      this.chunksByLocation[chunk.position.x + ":" + chunk.position.y] = chunk;
      chunk.wakeUp();
      this.chunks.push(chunk);
    }

    /*
    console.log(
      "Chunk gotten, chunks",
      this.chunks.length,
      "free",
      this.freeChunks.length
    );
    */

    this.changed = true;
    return chunk;
  }

  getChunkForTile(tile) {
    const position = getChunkPosition(tile.position, this.chunkSize);
    //console.log("chunk position for tile", tile.position, position);
    return this.getChunk(position);
  }

  add(tile) {
    let chunk = this.getChunkForTile(tile);
    const positionInChunk = tile.position.clone().sub(chunk.position);
    console.log("position in chunk", positionInChunk);
    tile.setChunkPosition(
      positionInChunk.x,
      positionInChunk.y,
      positionInChunk.z
    );

    /*
    console.log(
      "tile to chunk",
      tile.position,
      positionInChunk,
      chunk.position
    );
    */

    chunk.addTile(tile.serialize());
  }

  remove(tile) {
    throw new Error("Removing tiles is not implemented yet");
  }

  hasChanged(renderArea) {
    return !renderArea.equals(this.renderArea) || this.changed === true;
  }

  setRenderChunks(renderArea) {
    /*
    this.chunks.forEach(chunk => {
      if (chunk.hibernating) {
        throw new Error("Hibernating chunk in  chunks");
      }
    });

    this.chunks.forEach(chunk => {
      const found = this.chunks.find(
        other =>
          other.position.x === chunk.position.x &&
          other.position.y === chunk.position.y &&
          chunk !== other
      );

      if (found) {
        console.log("duplicate chunk", chunk.position, found.position);
        throw new Error("Duplicate chunk found!");
      }
    });
    */

    this.renderChunks = this.chunks.filter(chunk =>
      renderArea.containsChunk(chunk)
    );

    this.changed = false;
  }
}

export default TileRenderer;
