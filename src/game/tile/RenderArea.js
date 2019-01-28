import { getChunkPosition } from "../../model/tile/Chunk";

class RenderArea {
  constructor(position, size) {
    this.position = position;
    this.size = size;
  }

  equals(renderArea) {
    if (!renderArea) {
      return false;
    }

    return (
      renderArea.position.x === this.position.x &&
      renderArea.position.y === this.position.y &&
      renderArea.size === this.size
    );
  }

  contains(position) {
    return (
      position.x >= this.position.x &&
      position.y >= this.position.y &&
      position.x < this.position.x + this.size &&
      position.y < this.position.y + this.size
    );
  }

  containsChunk(chunk) {
    return (
      this.contains(chunk.getNWCorner()) ||
      this.contains(chunk.getNECorner()) ||
      this.contains(chunk.getSECorner()) ||
      this.contains(chunk.getSWCorner())
    );
  }

  requiresChunks(chunkSize, extra = 2) {
    const chunkPosition = getChunkPosition(this.position, chunkSize);
    const corner = {
      x: chunkPosition.x - extra * chunkSize,
      y: chunkPosition.x - extra * chunkSize
    };

    const width = Math.ceil(this.size / chunkSize) + extra * 2;
    let positions = [];

    for (let y = corner.y; y < corner.y + width * chunkSize; y += chunkSize) {
      for (let x = corner.x; x < corner.x + width * chunkSize; x += chunkSize) {
        positions.push({ x, y });
      }
    }

    return positions;
  }
}

export default RenderArea;
