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
}

export default RenderArea;
