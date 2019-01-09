class TileStack {
  constructor() {
    this.tiles = [];
    this.needSorting = false;
  }

  add(tile) {
    this.tiles.push(tile);
    this.needSorting = true;
  }

  remove(tile) {
    this.tiles = this.tiles.filter(other => tile !== other);
  }

  sort() {
    if (!this.needSorting) {
      return;
    }

    this.tiles = this.tiles.sort((a, b) => {
      if (a.position.z > b.position.z) {
        return 1;
      }

      if (b.position.z > a.position.z) {
        return -1;
      }

      return 0;
    });

    this.needSorting = false;
  }
}

export default TileStack;
