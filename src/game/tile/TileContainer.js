import Tile from "./Tile";

const tile = new Tile();

class TileContainer {
  constructor(
    offsetAttribute,
    opacityAttribute,
    textureNumberAttribute,
    brushNumberAttribute,
    typeAttribute,
    amount,
    mesh,
    scene,
    numberCreated
  ) {
    this.amount = amount;
    this.used = 0;
    this.offsetAttribute = offsetAttribute;
    this.opacityAttribute = opacityAttribute;
    this.textureNumberAttribute = textureNumberAttribute;
    this.brushNumberAttribute = brushNumberAttribute;
    this.typeAttribute = typeAttribute;
    this.mesh = mesh;
    this.scene = scene;
    this.numberCreated = numberCreated;

    /*
    for (let i = 0; i < amount; i++) {
      this.free.push(i);
    }
    */
  }

  hasFree() {
    return this.used < this.amount;
  }

  discard() {
    this.scene.remove(this.mesh);
  }

  remove(tile) {
    this.opacityAttribute.setX(tile.index, 0);
    this.used--;
  }

  unassignEverything() {
    for (let i = 0; i < this.amount; i++) {
      this.opacityAttribute.setX(i, 0);
    }
    this.opacityAttribute.needsUpdate = true;

    this.used = 0;
  }

  add(tile, index) {
    if (this.used >= this.amount) {
      throw new Error("Container is full");
    }

    if (!tile) {
      throw new Error("Trying to add null tile, index: " + index);
    }

    this.used++;
    this.update(tile, index);
  }

  update(data, index) {
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

    this.typeAttribute.setX(index, tile.type);
    this.typeAttribute.needsUpdate = true;
  }
}

export default TileContainer;
