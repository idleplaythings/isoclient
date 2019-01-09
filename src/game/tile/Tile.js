class Tile {
  constructor(
    position,
    surfaceBrush,
    surfaceTexture,
    groundBrush = -1,
    groundTexture = -1,
    shadowBrush = -1,
    highlightBrush = -1,
    type = 0
  ) {
    this.position = position;
    this.surfaceBrush = surfaceBrush;
    this.groundBrush = groundBrush;
    this.surfaceTexture = surfaceTexture;
    this.groundTexture = groundTexture;
    this.shadowBrush = shadowBrush;
    this.highlightBrush = highlightBrush;
    this.type = type;

    const { flipped, scale } = this.parseType(this.type);
    this.scale = scale;
    this.flipped = flipped;

    this.index = null;
    this.container = null;
  }

  setDoubleScale(scale) {
    this.scale = scale;
    this.composeType(this.flipped, scale);
  }

  setFlipped(flipped) {
    this.flipped = flipped;
    this.composeType(flipped, this.scale);
  }

  composeType(flipped, scale) {
    let value = 0;

    if (flipped) {
      value += 10;
    }

    if (scale) {
      value += 1;
    }

    this.type = parseInt(value, 2);
  }

  parseType() {
    const flipped = Boolean(this.type & 2);
    const scale = Boolean(this.type & 1);

    return { flipped, scale };
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

window.Tile = Tile;

export default Tile;
