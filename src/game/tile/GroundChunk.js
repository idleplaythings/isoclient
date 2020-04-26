import Chunk from "../../model/tile/Chunk";
import * as THREE from "three";
import GroundVertexShader from "./shaders/GroundVertexShader";
import GroundFragmentShader from "./shaders/GroundFragmentShader";

class GroundChunk extends Chunk {
  constructor(position, size, scene) {
    super(position, size);
    this.forRender = [];
    this.changed = true;
    this.scene = scene;
    this.tiles = [];

    this.capacity = 0;
    this.hibernating = false;

    this.uniforms = {
      heightMap: {
        type: "t",
        value: new THREE.DataTexture(null, 0, 0),
      },
      size: {
        type: "f",
        value: this.size,
      },
      /*
      texture: {
        type: "t",
        value: new THREE.DataTexture(null, 0, 0),
      },
      overlayColor: { type: "v3", value: this.color },
      opacity: { type: "f", value: 1.0 },
      textureNumber: { type: "f", value: this.textureNumber },
      */
    };

    this.material = new THREE.ShaderMaterial({
      vertexShader: GroundVertexShader,
      fragmentShader: GroundFragmentShader,
      transparent: true,
      depthWrite: true,
      depthTest: true,
      blending: THREE.NormalBlending,
    });

    const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    this.material.uniforms = this.uniforms;

    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.mesh.scale.set(this.size, this.size, 1);
  }

  setPosition(position) {
    position = new THREE.Vector3(position.x, position.y, 0);
    this.position = position;
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
  }

  hibernate() {
    this.scene.remove(this.mesh);
    this.changed = false;
    this.hibernating = true;
  }

  wakeUp() {
    this.hibernating = false;
    this.scene.add(this.mesh);
    return this;
  }

  addHeightData(heightImageData) {
    if (this.hibernating) {
      throw new Error("This chunk is hibernating");
    }

    const texture = new THREE.Texture(
      new ImageData(heightImageData, this.size * 2)
    );
    texture.needsUpdate = true;
    //texture.minFilter = THREE.NearestFilter;
    //texture.magFilter = THREE.NearestFilter;

    this.uniforms.heightMap.value = texture;
  }

  addTiles(tiles) {
    if (this.hibernating) {
      throw new Error("This chunk is hibernating");
    }

    this.tiles = tiles;
    this.changed = true;
  }

  addTile(tile) {
    if (this.hibernating) {
      throw new Error("This chunk is hibernating");
    }

    this.tiles.push(tile);
    this.changed = true;
  }

  removeTiles(tiles) {
    tiles.forEach(this.removeTile);
  }

  removeTile(tile) {
    //TODO: remove tile
    this.changed = true;
  }

  render(now) {
    if (!this.changed || this.hibernating) {
      return;
    }

    //TODO, build images

    this.changed = false;
    return this.forRender;
  }

  drawHeight() {
    /*
    this.tiles.forEach(([x, y, height]) => {
      y = Math.abs(y);
      const [r, g, b, a] = getColorIndicesForCoord(x, y, this.size);

      this.heightImageData[r] = height * 10;
      this.heightImageData[g] = 0;
      this.heightImageData[b] = 0;
      this.heightImageData[a] = 255;
    });

    const texture = new THREE.Texture(
      new ImageData(this.heightImageData, this.size)
    );
    texture.needsUpdate = true;
    //texture.minFilter = THREE.NearestFilter;
    //texture.magFilter = THREE.NearestFilter;

    this.uniforms.heightMap.value = texture;
    */
  }
}

export default GroundChunk;
