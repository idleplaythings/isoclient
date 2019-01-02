class TileContainer {
  constructor(
    offsetAttribute,
    opacityAttribute,
    textureNumberAttribute,
    amount,
    mesh,
    scene
  ) {
    this.free = [];
    this.used = [];
    this.offsetAttribute = offsetAttribute;
    this.opacityAttribute = opacityAttribute;
    this.textureNumberAttribute = textureNumberAttribute;
    this.mesh = mesh;
    this.scene = scene;

    for (let i = 0; i < amount; i++) {
      this.free.push(i);
    }
  }

  hasFree() {
    return this.free.length > 0;
  }

  discard() {
    this.scene.remove(this.mesh);
  }

  remove(tile) {
    this.opacityAttribute.setX(tile.index, 0);
    this.free.push(tile.index);
  }

  add(tile) {
    const index = this.free.pop();

    if (index === undefined) {
      throw new Error("RAN OUT OF INDEXED CUBES");
    }

    this.used.push(index);
    tile.allocate(index, this);
    this.update(tile);
  }

  update(tile) {
    const index = tile.index;

    this.opacityAttribute.setX(index, 1.0);
    this.opacityAttribute.needsUpdate = true;

    this.offsetAttribute.setXYZ(
      index,
      tile.position.x,
      tile.position.y,
      tile.position.z + 0.5
    );
    this.offsetAttribute.needsUpdate = true;

    this.textureNumberAttribute.setX(index, tile.texture);
    this.textureNumberAttribute.needsUpdate = true;
  }
}

export default TileContainer;
