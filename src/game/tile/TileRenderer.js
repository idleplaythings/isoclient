import InstanceFactory from "./InstanceFactory";

class TileRenderer {
  constructor(scene, gameCamera, tileLibrary) {
    this.instanceFactory = new InstanceFactory(scene);
    this.capacity = 0;
    this.containers = [];
    this.tileLibrary = tileLibrary;
    this.gameCamera = gameCamera;
  }

  async assignTiles(tiles) {
    await this.instanceFactory.ready;

    //const start = new Date().getTime();

    while (this.capacity < tiles.length) {
      const newContainer = this.instanceFactory.create();
      this.containers.push(newContainer);
      this.capacity += newContainer.amount;
    }

    let tileIndex = 0;
    this.containers.forEach(container => {
      container.unassignEverything();

      for (let i = 0; i < container.amount && tileIndex < tiles.length; i++) {
        const tile = tiles[tileIndex];

        container.add(tile, i);
        tileIndex++;
      }
    });

    //console.log("current capacity", this.capacity);

    //console.log("ASSIGNED tiles, took", new Date().getTime() - start, "ms");
  }

  render() {
    const renderArea = this.gameCamera.getRenderArea();
    if (this.tileLibrary.hasChanged(renderArea)) {
      this.assignTiles(this.tileLibrary.getForRendering(renderArea));
    }
  }
}

export default TileRenderer;
