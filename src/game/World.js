import { Tile } from "./tile";
import * as THREE from "three";

import TerrainTester from "./test/TerrainTester";

class World {
  constructor(tileLibrary) {
    this.tileLibrary = tileLibrary;
    this.chunks = {};

    window.tileLibrary = tileLibrary;

    this.lastRender = 0;
    this.rocks = [];
    this.grass = [];
    this.soil = [];

    this.tester = new TerrainTester(this.tileLibrary);
    this.create();
  }

  create() {
    this.tester.createGround();
    this.tester.createBoxHill();
    this.tester.createSlopeHill();
    //tester.createTestCube();
  }

  render() {
    this.tester.createTestCube(
      new THREE.Vector3(
        Math.floor(Math.random() * 200) - 100,
        Math.floor(Math.random() * 200) - 100,
        1
      )
    );
  }
}

export default World;
