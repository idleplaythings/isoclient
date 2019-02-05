class TileContainer {
  constructor(
    offsetAttribute,
    opacityAttribute,
    textureNumber1Attribute,
    textureNumber2Attribute,
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
    this.textureNumber1Attribute = textureNumber1Attribute;
    this.textureNumber2Attribute = textureNumber2Attribute;
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
    this.used = 0;
/*

    for (let i = 0; i < this.amount; i++) {
      this.opacityAttribute.setX(i, 0);
    }
    this.opacityAttribute.needsUpdate = true;
*/
  }

  setArrays(lists) {
    this.opacityAttribute.setArray(lists[0]);
    this.offsetAttribute.setArray(lists[1]);
    this.textureNumber1Attribute.setArray(lists[2]);
    this.textureNumber2Attribute.setArray(lists[3]);
    this.typeAttribute.setArray(lists[4]);

    this.opacityAttribute.needsUpdate = true;
    this.offsetAttribute.needsUpdate = true;
    this.textureNumber1Attribute.needsUpdate = true;
    this.textureNumber2Attribute.needsUpdate = true;
    this.typeAttribute.needsUpdate = true;
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
  }

  update(data, index) {
    //tile.deserialize(data);

    this.opacityAttribute.setX(index, 1.0);

    this.offsetAttribute.setXYZ(index, data[0], data[1], data[2] + 0.5);

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
  }
}

export default TileContainer;
