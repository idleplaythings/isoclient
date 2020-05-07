class GridNode {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.z = 0;
    this.weight = 1;

    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.visited = false;
    this.closed = false;
    this.parent = null;
  }

  clean() {
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.visited = false;
    this.closed = false;
    this.parent = null;
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

  toString() {
    return "[" + this.x + " " + this.y + "]";
  }

  getCost(fromNeighbor) {
    // Take diagonal weight into consideration.
    if (
      fromNeighbor &&
      fromNeighbor.x !== this.x &&
      fromNeighbor.y !== this.y
    ) {
      return this.weight * 1.41421;
    }
    return this.weight;
  }

  isWall() {
    return this.weight === 0;
  }
}

export default GridNode;
