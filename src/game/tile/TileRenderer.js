//import TileChunk from "./TileChunk";
import { getChunkPosition, getChunkKey } from "../../model/tile/Chunk";
import InstanceFactory from "./InstanceFactory";
//import Tile from "./Tile";
import WorldChunk from "./Chunk/WorldChunk";
import ChunkImageManipulator from "./ChunkImageManipulator";
import GroundTileGeometryFactory from "./tileFactory/GroundTileGeometryFactory";
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
    this.scene = scene;

    this.groundTileGeometryFactory = new GroundTileGeometryFactory(
      this.chunkSize
    );
    this.chunkImageManipulator = new ChunkImageManipulator(this.scene);

    window.testTileRenderer = this;

    /*
    this.add(
      new Tile()
        .setPosition(516, 510, 2)
        .setSurfaceTexture(256)
        .setFlipped(true)
        .setScale(2)
    );

    this.add(
      new Tile()
        .setPosition(517, 510, 2)
        .setSurfaceTexture(256)
        .setFlipped(true)
        .setScale(2)
    );

    */

    //x- endcap
    this.add(
      new Tile()
        .setPosition(514, 510, 2)
        .setSurfaceTexture(530)
        .setTextureVariant(0)
    );

    //y+ endcap
    this.add(
      new Tile()
        .setPosition(515, 511, 2)
        .setSurfaceTexture(531)
        .setTextureVariant(0)
    );

    //y+ endcap
    this.add(
      new Tile()
        .setPosition(519, 511, 2)
        .setSurfaceTexture(531)
        .setTextureVariant(0)
    );

    this.add(
      new Tile()
        .setPosition(515, 510, 2)
        .setSurfaceTexture(512)
        .setTextureVariant(0)
    );

    this.add(
      new Tile()
        .setPosition(516, 510, 2)
        .setSurfaceTexture(513)
        .setTextureVariant(0)
    );

    this.add(
      new Tile()
        .setPosition(517, 510, 2)
        .setSurfaceTexture(514)
        .setTextureVariant(0)
    );

    this.add(
      new Tile()
        .setPosition(518, 510, 2)
        .setSurfaceTexture(515)
        .setTextureVariant(0)
    );

    this.add(
      new Tile()
        .setPosition(519, 510, 2)
        .setSurfaceTexture(512)
        .setTextureVariant(0)
    );

    this.add(
      new Tile()
        .setPosition(515, 509, 2)
        .setSurfaceTexture(528)
        .setTextureVariant(0)
    );

    this.add(
      new Tile()
        .setPosition(520, 510, 2)
        .setSurfaceTexture(529)
        .setTextureVariant(0)
    );

    this.add(
      new Tile()
        .setPosition(519, 509, 2)
        .setSurfaceTexture(525)
        .setTextureVariant(0)
    );

    this.add(
      new Tile()
        .setPosition(519, 508, 2)
        .setSurfaceTexture(524)
        .setTextureVariant(0)
    );

    this.add(
      new Tile()
        .setPosition(519, 507, 2)
        .setSurfaceTexture(526)
        .setTextureVariant(0)
    );

    this.add(
      new Tile()
        .setPosition(519, 506, 2)
        .setSurfaceTexture(512)
        .setTextureVariant(0)
    );

    // LEVEL 2

    //x- endcap
    this.add(
      new Tile()
        .setPosition(514, 510, 3)
        .setSurfaceTexture(530)
        .setTextureVariant(0)
    );

    //y+ endcap
    this.add(
      new Tile()
        .setPosition(515, 511, 3)
        .setSurfaceTexture(531)
        .setTextureVariant(0)
    );

    //y+ endcap
    this.add(
      new Tile()
        .setPosition(519, 511, 3)
        .setSurfaceTexture(531)
        .setTextureVariant(0)
    );

    this.add(
      new Tile()
        .setPosition(515, 510, 3)
        .setSurfaceTexture(512)
        .setTextureVariant(0)
    );

    this.add(
      new Tile()
        .setPosition(516, 510, 3)
        .setSurfaceTexture(515)
        .setTextureVariant(0)
    );

    this.add(
      new Tile()
        .setPosition(517, 510, 3)
        .setSurfaceTexture(514)
        .setTextureVariant(0)
    );

    this.add(
      new Tile()
        .setPosition(518, 510, 3)
        .setSurfaceTexture(513)
        .setTextureVariant(0)
    );

    this.add(
      new Tile()
        .setPosition(519, 510, 3)
        .setSurfaceTexture(512)
        .setTextureVariant(0)
    );

    this.add(
      new Tile()
        .setPosition(515, 509, 3)
        .setSurfaceTexture(528)
        .setTextureVariant(0)
    );

    this.add(
      new Tile()
        .setPosition(520, 510, 3)
        .setSurfaceTexture(529)
        .setTextureVariant(0)
    );

    this.add(
      new Tile()
        .setPosition(519, 509, 3)
        .setSurfaceTexture(525)
        .setTextureVariant(0)
    );

    this.add(
      new Tile()
        .setPosition(519, 508, 3)
        .setSurfaceTexture(528)
        .setTextureVariant(0)
    );

    this.add(
      new Tile()
        .setPosition(519, 508, 3)
        .setSurfaceTexture(531)
        .setTextureVariant(0)
    );

    this.add(
      new Tile()
        .setPosition(519, 507, 3)
        .setSurfaceTexture(526)
        .setTextureVariant(0)
    );

    this.add(
      new Tile()
        .setPosition(519, 506, 3)
        .setSurfaceTexture(512)
        .setTextureVariant(0)
    );

    //LEVEL 2 END

    //this.add(new Tile().setPosition(517, 505, 2).setSurfaceTexture(542));
    //this.add(new Tile().setPosition(517, 505, 2).setSurfaceTexture(544));
    //this.add(new Tile().setPosition(517, 505, 2).setSurfaceTexture(541));

    /*
    this.add(new Tile().setPosition(0, 0, 0).setTexture(0, 96));
    this.add(new Tile().setPosition(0, 0, 1).setTexture(0, 96));
    this.add(new Tile().setPosition(0, 0, 2).setTexture(0, 96));

    this.add(
      new Tile()
        .setPosition(-1, 0, 3)
        .setSurfaceTexture(256)
        .setScale(2)
    );

    this.add(
      new Tile()
        .setPosition(1, 0, 3)
        .setOffset(0.001, -0.001, 0.001)
        .setSurfaceTexture(256)
        .setScale(2)
    );

    this.add(
      new Tile()
        .setPosition(-1, 1, 3)
        .setOffset(0.002, -0.002, 0.002)
        .setSurfaceTexture(256)
        .setScale(2)
    );

    this.add(
      new Tile()
        .setPosition(1, 1, 3)
        .setOffset(0.002, -0.002, 0.002)
        .setSurfaceTexture(256)
        .setScale(2)
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

      const data = await this.world.getTileChunkForRenderArea(
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
