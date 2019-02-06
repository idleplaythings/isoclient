import TileStack from "./TileStack";
import Chunk from "../../model/tile/Chunk";
import * as THREE from "three";

class TileChunk extends Chunk {
  constructor(position, size, instanceFactory) {
    super(position, size);
    this.forRender = [];
    this.changed = true;
    this.instanceFactory = instanceFactory;
    this.tiles = [];

    this.capacity = 0;
    this.containers = [];
    this.hibernating = false;
  }

  getStack(position) {
    if (
      position.x > this.size - 1 ||
      position.x < 0 ||
      position.y > this.size - 1 ||
      position.y < 0
    ) {
      console.log(
        "tile:",
        position,
        "is not in this directory:",
        this.position,
        this.size
      );
      throw new Error("Not in this directory");
    }
    const xRow = this.directory[position.y];
    const stack = xRow[position.x];

    if (!stack) {
      throw new Error("TileChunk stack not found");
    }

    return stack;
  }

  setPosition(position) {
    position = new THREE.Vector3(position.x, position.y, 0);
    this.position = position;
    this.containers.forEach(container => container.setPosition(position));
  }

  hibernate() {
    //this.directory = initDirectory(this.size);
    this.containers.forEach(container => container.resetIndex());
    this.changed = false;
    this.hibernating = true;
  }

  wakeUp() {
    this.hibernating = false;
    return this;
  }

  addTiles(tiles) {
    if (this.hibernating) {
      throw new Error("This chunk is hibernating");
    }

    this.tiles = tiles;
    this.changed = true;
  }

  addTile(tile) {
    if (this.hibernating) {
      throw new Error("This chunk is hibernating");
    }

    this.tiles.push(tile);
    this.changed = true;
  }

  removeTiles(tiles) {
    tiles.forEach(this.removeTile);
  }

  removeTile(tile) {
    const tileStack = this.getStack({ x: tile[0], y: tile[1], z: tile[2] });
    tileStack.remove(tile);
    this.changed = true;
  }

  sort() {
    this.directory.forEach(row => row.forEach(stack => stack.sort()));
  }

  render(nomore) {
    if (!this.changed || this.hibernating || nomore) {
      return;
    }

    /*
    this.sort();

    const tiles = [].concat(
      ...[].concat(
        this.directory.map(row => [].concat(...row.map(stack => stack.tiles)))
      )
    );

    */

    while (this.capacity < this.tiles.length) {
      const newContainer = this.instanceFactory.create(
        this.size * this.size * 3
      );
      newContainer.setPosition(this.position);
      this.containers.push(newContainer);
      this.capacity += newContainer.amount;
    }

    let tileIndex = 0;

    this.containers.forEach((container, containerIndex) => {
      container.resetIndex();

      for (
        let i = 0;
        i < container.amount && tileIndex < this.tiles.length;
        i++
      ) {
        const tile = this.tiles[tileIndex];

        container.add(tile, i);
        tileIndex++;
      }

      //container.setRenderOrder(this.containers.length - containerIndex);
      container.markUpdated();
    });

    this.changed = false;
    return this.forRender;
  }
}

export default TileChunk;
