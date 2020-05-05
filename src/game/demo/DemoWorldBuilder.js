import LogWall from "../../model/structure/wall/LogWall";
import Boulder, { BOULDERS } from "../../model/structure/nature/stone/Boulder";
import Rock, { ROCKS } from "../../model/structure/nature/stone/Rock";
import Pebble, { PEBBLES } from "../../model/structure/nature/stone/Pebble";

class DemoWorldBuilder {
  constructor(tileLibrary) {
    this.tileLibrary = tileLibrary;
  }

  create() {
    this.logWall({ x: 500, y: 500 });
    this.boulderLarge({ x: 480, y: 540 });
    this.rocks({ x: 480, y: 537 });
    this.pebbles({ x: 480, y: 535 });
  }

  pebbles(offset) {
    const list = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 6, y: 0 },
      { x: 7, y: 0 },
      { x: 8, y: 0 },
      { x: 9, y: 0 },
      { x: 10, y: 0 },
      { x: 11, y: 0 },
      { x: 12, y: 0 },
      { x: 13, y: 0 },
      { x: 14, y: 0 },
      { x: 15, y: 0 },
      { x: 16, y: 0 },
    ];

    this.tileLibrary.addDynamicEntity(
      list.map(
        (pos, i) =>
          new Pebble({
            position: { x: pos.x + offset.x + i, y: pos.y + offset.y, z: 0 },
            visualType: PEBBLES[i],
          })
      )
    );
  }

  rocks(offset) {
    const list = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 6, y: 0 },
      { x: 7, y: 0 },
      { x: 8, y: 0 },
      { x: 9, y: 0 },
      { x: 10, y: 0 },
      { x: 11, y: 0 },
      { x: 12, y: 0 },
      { x: 13, y: 0 },
      { x: 14, y: 0 },
    ];

    this.tileLibrary.addDynamicEntity(
      list.map(
        (pos, i) =>
          new Rock({
            position: { x: pos.x + offset.x + i, y: pos.y + offset.y, z: 0 },
            visualType: ROCKS[i],
          })
      )
    );
  }

  boulderLarge(offset) {
    const list = [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 4, y: 0 },
      { x: 6, y: 0 },
      { x: 8, y: 0 },
      { x: 10, y: 0 },
      { x: 12, y: 0 },
      { x: 14, y: 0 },
      { x: 16, y: 0 },
      { x: 18, y: 0 },
      { x: 20, y: 0 },
    ];

    this.tileLibrary.addDynamicEntity(
      list.map(
        (pos, i) =>
          new Boulder({
            position: { x: pos.x + offset.x + i, y: pos.y + offset.y, z: 0 },
            visualType: BOULDERS[i],
          })
      )
    );
  }

  logWall(offset, height = 0) {
    const list = [
      { x: 15, y: 10 },
      { x: 16, y: 10 },
      { x: 17, y: 10 },
      { x: 18, y: 10 },
      { x: 19, y: 10 },

      { x: 15, y: 6 },
      { x: 16, y: 6 },
      { x: 17, y: 6 },
      { x: 18, y: 6 },
      { x: 19, y: 6 },

      { x: 15, y: 8 },
      { x: 16, y: 8 },
      { x: 17, y: 8 },
      { x: 18, y: 8 },
      { x: 19, y: 8 },

      { x: 15, y: 10 },
      { x: 15, y: 9 },
      { x: 15, y: 8 },
      { x: 15, y: 7 },
      { x: 15, y: 6 },

      { x: 17, y: 10 },
      { x: 17, y: 9 },
      { x: 17, y: 8 },
      { x: 17, y: 7 },
      { x: 17, y: 6 },

      { x: 19, y: 10 },
      { x: 19, y: 9 },
      { x: 19, y: 8 },
      { x: 19, y: 7 },
      { x: 19, y: 6 },

      { x: 29, y: 10 },
      { x: 29, y: 9 },
      { x: 29, y: 8 },
      { x: 28, y: 9 },
      { x: 30, y: 9 },

      { x: 25, y: 9 },
    ];

    this.tileLibrary.addDynamicEntity(
      list.map(
        (pos) =>
          new LogWall({
            position: { x: pos.x + offset.x, y: pos.y + offset.y, z: height },
          })
      )
    );
  }
}

export default DemoWorldBuilder;
