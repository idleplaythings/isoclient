import * as THREE from "three";

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
  }

  serialize() {
    return [
      this.position.x,
      this.position.y,
      this.position.z,
      this.surfaceBrush,
      this.groundBrush,
      this.surfaceTexture,
      this.groundTexture,
      this.shadowBrush,
      this.highlightBrush,
      this.type
    ];
  }

  deserialize(data) {
    this.position = { x: data[0], y: data[1], z: data[2] };

    this.surfaceBrush = data[3];
    this.groundBrush = data[4];
    this.surfaceTexture = data[5];
    this.groundTexture = data[6];
    this.shadowBrush = data[7];
    this.highlightBrush = data[8];
    this.type = data[9];

    const { flipped, scale } = this.parseType(this.type);
    this.scale = scale;
    this.flipped = flipped;

    return this;
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
}

export default Tile;
