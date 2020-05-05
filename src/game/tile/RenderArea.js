class RenderArea {
  constructor(position, size, chunkSize) {
    this.position = position;
    this.size = size;
    this.chunkSize = chunkSize;
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
      position.y <= this.position.y &&
      position.x <= this.position.x + this.size * this.chunkSize &&
      position.y >= this.position.y - this.size * this.chunkSize
    );
  }

  containsChunk(chunk) {
    return this.contains(chunk.position);
  }

  requiresChunks(extra = 0) {
    const corner = {
      x: this.position.x - extra * this.chunkSize,
      y: this.position.y + extra * this.chunkSize,
    };

    const width = this.size + extra * 2;
    let positions = [];

    for (let y = 0; y <= width; y++) {
      for (let x = 0; x <= width; x++) {
        positions.push({
          x: corner.x + x * this.chunkSize,
          y: corner.y - y * this.chunkSize,
        });
      }
    }

    //console.log(this.position, corner);
    //console.log(positions);

    return positions;
  }
}

export default RenderArea;
