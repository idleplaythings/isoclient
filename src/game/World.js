import { Tile } from "./tile";
import * as THREE from "three";

class World {
  constructor(tileService) {
    this.tileService = tileService;
    this.chunks = {};

    window.tileService = tileService;

    this.lastRender = null;
    this.rocks = [];
    this.grass = [];

    this.create();
  }

  create() {
    for (let x = -100; x < 100; x++) {
      for (let y = -100; y < 100; y++) {
        const tile = new Tile(
          new THREE.Vector3(x, y, 0),
          Math.floor(Math.random() * 12)
        );
        this.tileService.add(tile);
        this.grass.push(tile);
      }
    }
  }

  render() {
    const now = new Date().getTime();

    const grass = this.grass[Math.floor(Math.random() * this.grass.length)];
    grass.texture = Math.floor(Math.random() * 8);
    grass.update();

    if (this.lastRender === null) {
      this.lastRender = now;
    } else if (now - this.lastRender > 300) {
      this.lastRender = now;

      const rock = new Tile(
        new THREE.Vector3(
          Math.floor(Math.random() * 10 - 5),
          Math.floor(Math.random() * 10 - 5),
          0
        ),
        Math.floor(Math.random() * 4) + 8
      );

      this.tileService.add(rock);
      this.rocks.push(rock);

      if (this.rocks.length > 10) {
        const toDelete = this.rocks.shift();
        toDelete.remove();
      }
    }
  }

  /*

  render() {
    const now = new Date().getTime();

    if (this.lastRender === null) {
      this.lastRender = now;
    } else if (now - this.lastRender > 1000) {
      this.lastRender = now;
      this.rock.position.x += 1;
      this.rock.update();
    }
  }
  */
}

export default World;
