import { Tile } from "./tile";
import * as THREE from "three";

class World {
  constructor(tileService) {
    this.tileService = tileService;
    this.chunks = {};

    window.tileService = tileService;

    this.lastRender = 0;
    this.rocks = [];
    this.grass = [];
    this.soil = [];

    this.create();
  }

  create() {
    /*
    this.tileService.add(new Tile(new THREE.Vector3(0, 0, 0), 16));
    this.tileService.add(new Tile(new THREE.Vector3(1, 0, 0), 16));
    this.tileService.add(new Tile(new THREE.Vector3(-1, 0, 0), 16));
    this.tileService.add(new Tile(new THREE.Vector3(0, -1, 0), 16));
    this.tileService.add(new Tile(new THREE.Vector3(0, 1, 0), 16));
    this.tileService.add(new Tile(new THREE.Vector3(0, 0, 1), 1));
    */

    /*
    this.tileService.add(new Tile(new THREE.Vector3(2, 0, 0), 16), 2);

    this.tileService.add(new Tile(new THREE.Vector3(0, 0, 1), 16), 3);

    this.tileService.add(new Tile(new THREE.Vector3(1, 0, 1), 16), 4);

    this.tileService.add(new Tile(new THREE.Vector3(2, 0, 1), 16), 5);

    this.tileService.add(new Tile(new THREE.Vector3(0, 0, 2), 1), 6);

    this.tileService.add(new Tile(new THREE.Vector3(1, 0, 2), 1), 7);

    this.tileService.add(new Tile(new THREE.Vector3(2, 0, 2), 1), 8);

    this.tileService.add(new Tile(new THREE.Vector3(3, 0, 0), 16), 0);
    */

    /*
    const tile = new Tile(new THREE.Vector3(0, 0, 1), 0);
    this.tileService.add(tile);
    */

    for (let x = -4; x <= 4; x++) {
      for (let y = -4; y <= 4; y++) {
        const tile = new Tile(new THREE.Vector3(x, y, 0), 0);
        this.tileService.add(tile);
        this.soil.push(tile);
      }
    }

    for (let x = -3; x <= 3; x++) {
      for (let y = -3; y <= 3; y++) {
        const tile = new Tile(new THREE.Vector3(x, y, 1), 0);
        this.tileService.add(tile);
        this.soil.push(tile);
      }
    }
    /*

    for (let y = -3; y <= 3; y++) {
      const tile = new Tile(new THREE.Vector3(-4, y, 1), 10);
      this.tileService.add(tile);
      this.soil.push(tile);
    }

    */
    for (let y = -3; y <= 3; y++) {
      const tile = new Tile(new THREE.Vector3(4, y, 1), 9);
      this.tileService.add(tile);
      this.soil.push(tile);
    }
    /*
    for (let x = -3; x <= 3; x++) {
      const tile = new Tile(new THREE.Vector3(x, 4, 1), 11);
      this.tileService.add(tile);
      this.soil.push(tile);
    }

    for (let x = -3; x <= 3; x++) {
      const tile = new Tile(new THREE.Vector3(x, -4, 1), 8);
      this.tileService.add(tile);
      this.soil.push(tile);
    }

    this.tileService.add(new Tile(new THREE.Vector3(-4, -4, 1), 14));
    this.tileService.add(new Tile(new THREE.Vector3(4, -4, 1), 15));
    this.tileService.add(new Tile(new THREE.Vector3(4, 4, 1), 13));
    this.tileService.add(new Tile(new THREE.Vector3(-4, 4, 1), 12));

    /*
    for (let y = -5; y <= 5; y++) {
      const tile = new Tile(new THREE.Vector3(-2, y, 1), 12);
      this.tileService.add(tile);
      this.soil.push(tile);
    }

    for (let x = -5; x <= -3; x++) {
      const tile = new Tile(new THREE.Vector3(x, -6, 1), 13);
      this.tileService.add(tile);
      this.soil.push(tile);
    }

    for (let x = -5; x <= -3; x++) {
      const tile = new Tile(new THREE.Vector3(x, 6, 1), 14);
      this.tileService.add(tile);
      this.soil.push(tile);
    }

    */

    /*
    for (let x = -100; x < 100; x++) {
      for (let y = -100; y < 100; y++) {
        if (Math.random() > 0.8) {
          const grass = new Tile(new THREE.Vector3(x, y, 1), 9);
          this.tileService.add(grass);
          this.grass.push(grass);
        }
      }
    }
    */
  }

  render() {
    /*
    if (this.grass[0]) {
      this.grass[0].position.z -= 0.01;
      this.grass[0].update();
    }
    */

    return;
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
