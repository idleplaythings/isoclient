import GridNode from "./GridNode";
import { movementEffect } from "../../../model/tile/TileTypes.mjs";

const NEIGHBOR_OFFSETS = [
  { x: -1, y: -1 },
  { x: 1, y: 1 },
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: -1, y: -1 },
  { x: 1, y: -1 },
  { x: -1, y: 1 },
  { x: 1, y: 1 },
];

class Graph {
  constructor(binaryChunks, dynamicEntityCache) {
    this.binaryChunks = binaryChunks;
    this.dynamicEntityCache = dynamicEntityCache;

    this.diagonal = true;

    this.tiles = {};

    this.dirtyNodes = {};
  }

  getNode(position) {
    const key = `${position.x}-${position.y}`;
    if (this.tiles[key]) {
      return this.tiles[key];
    } else {
      const tile = new GridNode(position.x, position.y);
      this.populateTile(tile);
      this.tiles[key] = tile;
      return tile;
    }
  }

  populateTile(tile) {
    const chunk = this.getBinaryChunkForNode(tile);
    const prop = chunk.getPropByWorldPosition(tile);
    const height = chunk.getHeightByWorldPosition(tile);

    if (movementEffect.difficult.includes(prop)) {
      tile.weight = 2;
    } else if (movementEffect.impassable.includes(prop)) {
      tile.weight = 0;
    }

    tile.z = height;
  }

  cleanDirty() {
    this.dirtyNodes = {};
  }

  markDirty(node) {
    //NOOP?
  }

  getBinaryChunkForNode(position) {
    /*
    console.log(this.binaryChunks);

    console.log(
      "prop",
      this.binaryChunks[0].getPropByWorldPosition({ x: 509, y: 515 })
    );
    */

    const chunk = this.binaryChunks.find((chunk) => chunk.contains(position));

    if (!chunk) {
      throw new Error("This should not happen");
    }

    return chunk;
  }

  neighbors(node) {
    return NEIGHBOR_OFFSETS.map((offset) => {
      const key = `${node.x + offset.x}-${node.y + offset.y}`;
      if (this.tiles[key]) {
        return this.tiles[key];
      } else {
        const tile = new GridNode(node.x + offset.x, node.y + offset.y);
        this.populateTile(tile);
        this.tiles[key] = tile;
        return tile;
      }
    });
  }

  toString() {
    var graphString = [];
    var nodes = this.grid;
    for (var x = 0; x < nodes.length; x++) {
      var rowDebug = [];
      var row = nodes[x];
      for (var y = 0; y < row.length; y++) {
        rowDebug.push(row[y].weight);
      }
      graphString.push(rowDebug.join(" "));
    }
    return graphString.join("\n");
  }
}

export default Graph;
