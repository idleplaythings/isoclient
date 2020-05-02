import Chunk from "../../../model/tile/Chunk";
import { Vector3 } from "three";
import GroundChunk from "./GroundChunk";
import TileChunk from "./TileChunk";

class WorldChunk extends Chunk {
  constructor(
    position,
    size,
    scene,
    imageManipulator,
    geometry,
    instanceFactory
  ) {
    super(position, size);
    this.hasGroundData = false;

    this.groundChunk = new GroundChunk(
      position,
      size,
      scene,
      imageManipulator,
      geometry
    );

    this.tileChunk = new TileChunk(position, size, instanceFactory);

    this.hibernating = false;
  }

  isLoaded() {
    return this.hasGroundData;
  }

  setPosition(position) {
    position = new Vector3(position.x, position.y, 0);
    this.position = position;
    this.groundChunk.setPosition(position);
    this.tileChunk.setPosition(position);
  }

  hibernate() {
    this.groundChunk.hibernate();
    this.tileChunk.hibernate();
    this.hasGroundData = false;
  }

  wakeUp() {
    this.hibernating = false;
    this.groundChunk.wakeUp();
    this.tileChunk.wakeUp();
  }

  addData({ groundData, tiles }) {
    if (this.hibernating) {
      throw new Error("This chunk is hibernating");
    }
    this.hasGroundData = true;

    this.groundChunk.addData(groundData);
    this.tileChunk.addTiles(tiles);
  }

  addTiles(tiles) {
    this.tileChunk.addTiles(tiles);
  }

  addTile(tile) {
    this.tileChunk.addTile(tile);
  }

  removeTiles(tiles) {
    this.tileChunk.removeTiles(tiles);
  }

  removeTile(tile) {
    this.tileChunk.removeTile(tile);
  }

  render(payload) {
    if (this.hibernating) {
      return;
    }

    this.groundChunk.render(payload);
    this.tileChunk.render(payload);
  }
}

export default WorldChunk;
