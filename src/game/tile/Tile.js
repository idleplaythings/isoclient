import * as THREE from "three";

class Tile {
  constructor() {
    this.reset();
  }

  reset() {
    this.position = null;
    this.chunkPosition = null;
    this.textures1 = [0, 0, 0, 0];
    this.textures2 = [0, 0, 0, 0];
    this.type = 0;
    this.scale = 1;
    this.flipped = 0;

    return this;
  }

  serialize() {
    const data = new Uint8Array([
      this.chunkPosition.x,
      Math.abs(this.chunkPosition.y),
      this.chunkPosition.z,
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
    ]);

    return data;
  }

  deserialize(data) {
    this.chunkPosition = { x: data[0], y: data[1], z: data[2] };
    this.textures1 = [data[3], data[4], data[5], data[6]];
    this.textures2 = [data[7], data[8], data[9], data[10]];
    this.type = data[11];
    this.scale = data[12];
    this.flipped = data[13];

    return this;
  }

  setChunkPosition(x, y, z) {
    if (x.x !== undefined && x.x !== null) {
      this.chunkPosition = new THREE.Vector3(x.x, x.y, x.z);
    } else {
      this.chunkPosition = new THREE.Vector3(x, y, z);
    }
    return this;
  }

  setPosition(x, y, z) {
    if (x.x !== undefined && x.x !== null) {
      this.position = new THREE.Vector3(x.x, x.y, x.z);
    } else {
      this.position = new THREE.Vector3(x, y, z);
    }

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

  setMasks(mask1, mask2) {
    this.textures1[2] = mask1;
    this.textures1[3] = mask2;
    return this;
  }

  setSlopeType() {
    this.setType(2);
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

  setFlipped(flipped = true) {
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
