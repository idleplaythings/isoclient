import InstanceFactory from "./InstanceFactory";

class TileService {
  constructor(scene, gameCamera) {
    this.instanceFactory = new InstanceFactory(scene);
    this.tiles = [];
    this.allTiles = [];
    this.capacity = 0;
    this.needsSorting = false;
    this.containers = [];
    this.gameCamera = gameCamera;
    this.renderArea = {
      x1: 0,
      y1: 0,
      x2: 0,
      y3: 0
    };
  }

  add(tile) {
    this.allTiles.push(tile);
    if (
      tile.position.x >= this.renderArea.x1 &&
      tile.position.y >= this.renderArea.y1 &&
      tile.position.x <= this.renderArea.x2 &&
      tile.position.y <= this.renderArea.y2
    ) {
      this.needsSorting = true;
    }
  }

  remove(tile) {
    this.tiles = this.tiles.filter(otherTile => tile !== otherTile);
    this.allTiles = this.allTiles.filter(otherTile => tile !== otherTile);
    tile.update();
  }

  removeAll() {
    this.tiles = [];
    this.allTiles = [];
    this.needsSorting = true;
  }

  sortTiles() {
    this.needsSorting = false;

    const start = new Date().getTime();

    this.tiles = this.allTiles
      .filter(
        tile =>
          tile.position.x >= this.renderArea.x1 &&
          tile.position.y >= this.renderArea.y1 &&
          tile.position.x <= this.renderArea.x2 &&
          tile.position.y <= this.renderArea.y2
      )
      .sort((a, b) => {
        if (a.position.x < b.position.x) {
          return -1;
        }

        if (b.position.x < a.position.x) {
          return 1;
        }

        if (a.position.y > b.position.y) {
          return -1;
        }

        if (b.position.y > a.position.y) {
          return 1;
        }

        if (a.position.z > b.position.z) {
          return 1;
        }

        if (b.position.z > a.position.z) {
          return -1;
        }

        return 0;
      });

    console.log("sorted tiles, took", new Date().getTime() - start, "ms");
  }

  async assignTiles() {
    await this.instanceFactory.ready;

    const start = new Date().getTime();

    while (this.capacity < this.tiles.length) {
      const newContainer = this.instanceFactory.create();
      this.containers.push(newContainer);
      this.capacity += newContainer.amount;
    }

    let tileIndex = 0;
    this.containers.forEach(container => {
      container.unassignEverything();

      for (let i = 0; i < container.amount; i++) {
        if (tileIndex >= this.tiles.length - 1) {
          break;
        }

        container.add(this.tiles[tileIndex], i);
        tileIndex++;
      }
    });

    //console.log("assigned tiles, took", new Date().getTime() - start, "ms");
  }

  hasRenderAreaChanged() {
    const newArea = this.gameCamera.getRenderArea();

    return (
      this.renderArea.x1 !== newArea.x1 ||
      this.renderArea.y1 !== newArea.y1 ||
      this.renderArea.x2 !== newArea.x2 ||
      this.renderArea.y2 !== newArea.y2
    );
  }

  filterTilesForRender() {}

  render() {
    if (this.hasRenderAreaChanged()) {
      this.renderArea = this.gameCamera.getRenderArea();
      this.needsSorting = true;
    }

    if (this.needsSorting) {
      this.sortTiles();
      this.assignTiles();
    }
  }
}

export default TileService;
