import * as THREE from "three";
import { Tile, TileFactory } from "../tile";

class TerrainTester {
  constructor(tileLibrary) {
    this.tileLibrary = tileLibrary;
    this.tileFactory = new TileFactory();
  }

  getSurfacetexture() {
    if (Math.random() > 0.9) {
      return Math.floor(Math.random() * 4) + 64;
    }
    return Math.floor(Math.random() * 4) + 66;
  }

  createTestCube(position = new THREE.Vector3(0, 0, 0)) {
    let tile = new Tile(
      new THREE.Vector3(position.x, position.y, position.z),
      Math.floor(Math.random() * 2) + 10,
      this.getSurfacetexture(),
      52,
      80
    );

    tile.setFlipped(true);
    //tile.setDoubleScale(true);
    this.tileLibrary.add(tile);

    /*
    tile = new Tile(
      new THREE.Vector3(position.x + 1, position.y, position.z),
      Math.floor(Math.random() * 2) + 10,
      this.getSurfacetexture(),
      52,
      80
    );
    //tile.setDoubleScale(true);
    this.tileLibrary.add(tile);
    */
  }

  createGround() {
    for (let x = -500; x <= 500; x++) {
      for (let y = -500; y <= 500; y++) {
        this.tileLibrary.add(
          new Tile(
            new THREE.Vector3(x, y, 0),
            Math.floor(Math.random() * 4) + 0,
            this.getSurfacetexture(),
            -1,
            -1
          )
        );

        this.tileLibrary.add(
          new Tile(
            new THREE.Vector3(x, y, 1),
            -1,
            Math.floor(Math.random() * 7) + 245,
            -1,
            -1
          )
        );

        if (Math.random() > 0.8) {
          this.tileLibrary.add(
            new Tile(
              new THREE.Vector3(x, y, 1),
              -1,
              Math.floor(Math.random() * 13) + 240,
              -1,
              -1
            )
          );
        }

        if (Math.random() > 0.99) {
          this.tileLibrary.add(
            new Tile(
              new THREE.Vector3(x, y, 1),
              -1,
              Math.floor(Math.random() * 3) + 253,
              -1,
              -1
            )
          );
        }
      }
    }
  }

  createSlopeHill(z = 1, position = new THREE.Vector2(15, 0, 0)) {
    //Slope demo east
    this.tileLibrary.add(
      new Tile(
        new THREE.Vector3(position.x + 7, position.y + 2, z),
        Math.floor(Math.random() * 2) + 8,
        this.getSurfacetexture(),
        56,
        80,
        16
      )
    );

    this.tileLibrary.add(
      new Tile(
        new THREE.Vector3(position.x + 6, position.y + 2, z),
        Math.floor(Math.random() * 2) + 10,
        this.getSurfacetexture(),
        48,
        80
      )
    );

    //Slope demo south

    this.tileLibrary.add(
      new Tile(
        new THREE.Vector3(position.x + 6, position.y - 3, z),
        Math.floor(Math.random() * 2) + 6,
        this.getSurfacetexture(),
        57,
        80,
        17
      )
    );

    this.tileLibrary.add(
      new Tile(
        new THREE.Vector3(position.x + 6, position.y - 2, z),
        Math.floor(Math.random() * 2) + 10,
        this.getSurfacetexture(),
        54,
        80
      )
    );

    //Slope demo south again
    this.tileLibrary.add(
      new Tile(
        new THREE.Vector3(position.x - 3, position.y, z),
        Math.floor(Math.random() * 2) + 6,
        this.getSurfacetexture(),
        -1,
        -1,
        17
      )
    );

    this.tileLibrary.add(
      new Tile(
        new THREE.Vector3(position.x - 3, position.y + 1, z),
        Math.floor(Math.random() * 2) + 10,
        this.getSurfacetexture(),
        -1,
        -1
      )
    );

    //center
    for (let x = position.x - 1; x <= position.x + 2; x++) {
      for (let y = position.y - 1; y <= position.y + 1; y++) {
        this.tileLibrary.add(
          this.tileFactory.getRandomGround(new THREE.Vector3(x, y, z))
        );
      }
    }

    //NW corner
    this.tileLibrary.add(
      new Tile(
        new THREE.Vector3(position.x - 2, position.y + 2, z),
        Math.floor(Math.random() * 2) + 10,
        this.getSurfacetexture(),
        -1,
        -1
      )
    );

    this.tileLibrary.add(
      new Tile(
        new THREE.Vector3(position.x - 2, position.y + 1, z),
        Math.floor(Math.random() * 4) + 0,
        this.getSurfacetexture(),
        -1,
        -1
      )
    );

    // west border
    for (let y = position.y - 1; y <= position.y + 0; y++) {
      this.tileLibrary.add(
        new Tile(
          new THREE.Vector3(position.x - 2, y, z),
          Math.floor(Math.random() * 2) + 12,
          this.getSurfacetexture(),
          -1,
          -1
        )
      );
    }

    //north border
    for (let x = position.x - 1; x <= position.x + 2; x++) {
      this.tileLibrary.add(
        new Tile(
          new THREE.Vector3(x, position.y + 2, z),
          Math.floor(Math.random() * 2) + 14,
          this.getSurfacetexture(),
          -1,
          -1
        )
      );
    }

    //slope east
    for (let y = position.y - 1; y <= position.y + 1; y++) {
      this.tileLibrary.add(
        new Tile(
          new THREE.Vector3(position.x + 3, y, z),
          Math.floor(Math.random() * 4) + 0,
          this.getSurfacetexture(),
          -1,
          -1,
          16
        )
      );
    }

    //NE slope corner
    this.tileLibrary.add(
      new Tile(
        new THREE.Vector3(position.x + 3, position.y + 2, z),
        Math.floor(Math.random() * 2) + 8,
        this.getSurfacetexture(),
        -1,
        -1,
        16
      )
    );

    //SW corner
    this.tileLibrary.add(
      new Tile(
        new THREE.Vector3(position.x - 2, position.y - 2, z),
        Math.floor(Math.random() * 2) + 6,
        this.getSurfacetexture(),
        -1,
        -1,
        17
      )
    );

    //slope south
    for (let x = position.x - 1; x <= position.x + 2; x++) {
      this.tileLibrary.add(
        new Tile(
          new THREE.Vector3(x, position.y - 2, z),
          Math.floor(Math.random() * 4) + 0,
          this.getSurfacetexture(),
          -1,
          -1,
          17
        )
      );
    }
  }

  createBoxHill(z = 1, position = new THREE.Vector2(0, 0, 0)) {
    for (let x = -3; x <= 3; x++) {
      this.tileLibrary.add(
        new Tile(
          new THREE.Vector3(x, 0, z),
          Math.floor(Math.random() * 4) + 0,
          this.getSurfacetexture(),
          48,
          80
        )
      );
    }

    for (let x = -4; x <= 4; x++) {
      for (let y = 0; y <= 5; y++) {
        this.tileLibrary.add(
          new Tile(
            new THREE.Vector3(x, y, z + 1),
            -1,
            Math.floor(Math.random() * 7) + 245,
            -1,
            -1
          )
        );

        if (Math.random() > 0.8) {
          this.tileLibrary.add(
            new Tile(
              new THREE.Vector3(x, y, z + 1),
              -1,
              Math.floor(Math.random() * 13) + 240,
              -1,
              -1
            )
          );
        }
      }
    }

    for (let x = -3; x <= 3; x++) {
      for (let y = 1; y <= 4; y++) {
        this.tileLibrary.add(
          new Tile(
            new THREE.Vector3(x, y, z),
            Math.floor(Math.random() * 4) + 0,
            this.getSurfacetexture(),
            -1,
            -1
          )
        );
      }
    }

    this.tileLibrary.add(
      new Tile(
        new THREE.Vector3(-4, 0, z),
        Math.floor(Math.random() * 1) + 12,
        this.getSurfacetexture(),
        48,
        80
      )
    );

    //west border
    for (let y = 1; y <= 4; y++) {
      this.tileLibrary.add(
        new Tile(
          new THREE.Vector3(-4, y, z),
          Math.floor(Math.random() * 2) + 12,
          this.getSurfacetexture(),
          -1,
          -1
        )
      );
    }

    //NW corner
    this.tileLibrary.add(
      new Tile(
        new THREE.Vector3(-4, 5, z),
        Math.floor(Math.random() * 2) + 10,
        this.getSurfacetexture(),
        -1,
        -1
      )
    );

    //north border
    for (let x = -3; x <= 3; x++) {
      this.tileLibrary.add(
        new Tile(
          new THREE.Vector3(x, 5, z),
          Math.floor(Math.random() * 2) + 14,
          this.getSurfacetexture(),
          -1,
          -1
        )
      );
    }

    //NE corner
    this.tileLibrary.add(
      new Tile(
        new THREE.Vector3(4, 5, z),
        Math.floor(Math.random() * 2) + 14,
        this.getSurfacetexture(),
        54,
        80
      )
    );

    this.tileLibrary.add(
      new Tile(
        new THREE.Vector3(4, 0, z),
        Math.floor(Math.random() * 4) + 0,
        this.getSurfacetexture(),
        52,
        80
      )
    );

    for (let y = 1; y <= 4; y++) {
      this.tileLibrary.add(
        new Tile(
          new THREE.Vector3(4, y, z),
          Math.floor(Math.random() * 4) + 0,
          this.getSurfacetexture(),
          54,
          80
        )
      );
    }
  }
}

export default TerrainTester;
