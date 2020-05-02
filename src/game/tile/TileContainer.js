class TileContainer {
  constructor(
    offsetAttribute,
    opacityAttribute,
    textureNumber1Attribute,
    textureNumber2Attribute,
    typeAttribute,
    textureVariantAttribute,
    amount,
    mesh,
    scene,
    numberCreated
  ) {
    this.amount = amount;
    this.used = 0;
    this.offsetAttribute = offsetAttribute;
    this.opacityAttribute = opacityAttribute;
    this.textureNumber1Attribute = textureNumber1Attribute;
    this.textureNumber2Attribute = textureNumber2Attribute;
    this.typeAttribute = typeAttribute;
    this.textureVariantAttribute = textureVariantAttribute;
    this.mesh = mesh;
    this.scene = scene;
    this.numberCreated = numberCreated;
    /*
    for (let i = 0; i < amount; i++) {
      this.free.push(i);
    }
    */
  }

  setPosition(position) {
    this.mesh.position.set(position.x, position.y, 0);
  }

  setRenderOrder(order) {
    //console.log(this.mesh.renderOrder);
    //console.log("setting renderOrder ", order);
    this.mesh.renderOrder = order;
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

  resetIndex() {
    this.used = 0;
  }

  unassignEverything() {
    this.opacityAttribute.set(new Float32Array(this.amount));
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

  markUpdated() {
    this.opacityAttribute.needsUpdate = true;
    this.typeAttribute.needsUpdate = true;
    this.offsetAttribute.needsUpdate = true;
    this.textureNumber1Attribute.needsUpdate = true;
    this.textureNumber2Attribute.needsUpdate = true;
    this.textureVariantAttribute.needsUpdate = true;
  }

  update(data, index) {
    /*
    if (data[2] > 1) {
      return;
    }
    */

    this.opacityAttribute.setX(index, 1.0);

    this.offsetAttribute.setXYZ(
      index,
      data[0] + data[14][0],
      data[1] + data[14][1],
      data[2] + data[14][2]
    );

    this.textureNumber1Attribute.setXYZW(
      index,
      data[3],
      data[4],
      data[5],
      data[6]
    );

    this.textureNumber2Attribute.setXYZW(
      index,
      data[7],
      data[8],
      data[9],
      data[10]
    );

    this.typeAttribute.setXYZ(index, data[11], data[12], data[13]);
    this.textureVariantAttribute.setX(index, data[15]);
  }
}

export default TileContainer;
