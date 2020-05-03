import LogWall from "../../model/structure/wall/LogWall";

class DemoWorldBuilder {
  constructor(tileLibrary) {
    this.tileLibrary = tileLibrary;
  }

  create() {
    this.logWall([
      { x: 515, y: 513 },
      { x: 515, y: 512 },
      { x: 515, y: 511 },
      { x: 515, y: 510 },
      { x: 515, y: 509 },
      { x: 515, y: 508 },

      { x: 515, y: 497 },
      { x: 515, y: 496 },

      { x: 511, y: 510 },
      { x: 512, y: 510 },

      { x: 510, y: 508 },
      { x: 511, y: 508 },

      { x: 511, y: 505 },

      { x: 511 + 16, y: 510 },
      { x: 512 + 16, y: 510 },
    ]);
  }

  logWall(list, height = 0) {
    this.tileLibrary.addDynamicEntity(
      list.map(
        (pos) => new LogWall({ position: { x: pos.x, y: pos.y, z: height } })
      )
    );
  }
}

export default DemoWorldBuilder;
