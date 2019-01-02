class Tile {
  constructor(position, texture) {
    this.position = position;
    this.texture = texture;
    this.index = null;
    this.container = null;
  }

  allocate(index, container) {
    this.index = index;
    this.container = container;
  }

  remove() {
    this.container.remove(this);
    this.index = null;
    this.container = null;
  }

  update() {
    if (this.container) this.container.update(this);
  }
}

export default Tile;
