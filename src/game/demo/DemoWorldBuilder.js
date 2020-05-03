import LogWall from "../../model/structure/wall/LogWall";

class DemoWorldBuilder {
  constructor(tileLibrary) {
    this.tileLibrary = tileLibrary;
  }

  create() {
    this.logWall([
      { x: 515, y: 510 },
      { x: 516, y: 510 },
      { x: 517, y: 510 },
      { x: 518, y: 510 },
      { x: 519, y: 510 },

      { x: 515, y: 506 },
      { x: 516, y: 506 },
      { x: 517, y: 506 },
      { x: 518, y: 506 },
      { x: 519, y: 506 },

      { x: 515, y: 508 },
      { x: 516, y: 508 },
      { x: 517, y: 508 },
      { x: 518, y: 508 },
      { x: 519, y: 508 },

      { x: 515, y: 510 },
      { x: 515, y: 509 },
      { x: 515, y: 508 },
      { x: 515, y: 507 },
      { x: 515, y: 506 },

      { x: 517, y: 510 },
      { x: 517, y: 509 },
      { x: 517, y: 508 },
      { x: 517, y: 507 },
      { x: 517, y: 506 },

      { x: 519, y: 510 },
      { x: 519, y: 509 },
      { x: 519, y: 508 },
      { x: 519, y: 507 },
      { x: 519, y: 506 },

      { x: 529, y: 510 },
      { x: 529, y: 509 },
      { x: 529, y: 508 },
      { x: 528, y: 509 },
      { x: 530, y: 509 },

      { x: 525, y: 509 },
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
