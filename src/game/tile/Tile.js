import * as THREE from "three";

class Tile {
  constructor() {
    this.reset();
  }

  reset() {
    this.position = null;
    this.textures1 = [-1, -1, -1, -1];
    this.textures2 = [-1, -1, -1, -1];
    this.type = 0;
    this.scale = 1;
    this.flipped = 0;

    return this;
  }

  serialize() {
    return [
      this.position.x,
      this.position.y,
      this.position.z,
      this.textures1[0],
      this.textures1[1],
      this.textures1[2],
      this.textures1[3],
      this.textures2[0],
      this.textures2[1],
      this.textures2[2],
      this.textures2[3],
      this.type,
      this.scale,
      this.flipped
    ];
  }

  deserialize(data) {
    this.position = { x: data[0], y: data[1], z: data[2] };
    this.textures1 = [data[3], data[4], data[5], data[6]];
    this.textures2 = [data[7], data[8], data[9], data[10]];
    this.type = data[11];
    this.scale = data[12];
    this.flipped = data[13];

    return this;
  }

  /* update(data, index) {
    tile.deserialize(data);

    this.opacityAttribute.setX(index, 1.0);
    this.opacityAttribute.needsUpdate = true;

    this.offsetAttribute.setXYZ(
      index,
      tile.position.x,
      tile.position.y,
      tile.position.z + 0.5
    );
    this.offsetAttribute.needsUpdate = true;

    this.textureNumberAttribute.setXYZW(
      index,
      tile.surfaceTexture,
      tile.groundTexture,
      0,
      0
    );
    this.textureNumberAttribute.needsUpdate = true;

    this.brushNumberAttribute.setXYZW(
      index,
      tile.surfaceBrush,
      tile.groundBrush,
      tile.shadowBrush,
      tile.highlightBrush
    );
    this.brushNumberAttribute.needsUpdate = true;

    this.typeAttribute.setXYZ(index, tile.type, tile.scale, tile.flipped);
    this.typeAttribute.needsUpdate = true;
  }
  */

  setPosition(x, y, z) {
    this.position = new THREE.Vector3(x, y, z);
    return this;
  }

  setTexture(index, number) {
    if (index < 4) {
      this.textures1[index] = number;
    } else {
      this.textures2[index - 4] = number;
    }

    return this;
  }

  setSurfaceBrush(number) {
    this.textures2[0] = number;
    return this;
  }

  setGroundBrush(number) {
    this.textures2[1] = number;
    return this;
  }

  setSurfaceTexture(number) {
    this.textures1[0] = number;
    return this;
  }

  setGroundTexture(number) {
    this.textures1[1] = number;
    return this;
  }

  setShadowBrush(number) {
    this.textures2[2] = number;
    return this;
  }

  setHighlightBrush(number) {
    this.textures2[3] = number;
    return this;
  }

  setBrushedType() {
    this.setType(1);
    return this;
  }

  setNormalType() {
    this.setType(0);
    return this;
  }

  setType(number) {
    if (number < 0 || number > 15) {
      throw new Error("Tile type must be 0 to 15");
    }

    this.type = number;
    return this;
  }

  setScale(scale) {
    if (scale < 1 || scale > 3) {
      throw new Error("Tile scale must be 1 to 3");
    }

    this.scale = scale;
    return this;
  }

  setFlipped(flipped) {
    if (flipped === true) {
      this.flipped = 1;
    } else if (flipped === false) {
      this.flipped = 0;
    } else {
      throw new Error("tile flipped must be a boolean");
    }

    return this;
  }
}

export default Tile;
