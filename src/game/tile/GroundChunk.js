import Chunk from "../../model/tile/Chunk";
import * as THREE from "three";

class GroundChunk extends Chunk {
  constructor(position, size, scene, imageManipulator) {
    super(position, size);
    this.forRender = [];
    this.scene = scene;
    this.tiles = [];

    this.capacity = 0;
    this.hibernating = false;

    this.imageManipulator = imageManipulator;

    this.heightImageData = null;
    this.propData = null;

    this.material = new THREE.MeshStandardMaterial({
      normalMap: new THREE.DataTexture(null, 0, 0),
      normalMapType: THREE.TangentSpaceNormalMap,
      //color: new THREE.Color(0, 0, 0.5, 1),
      map: new THREE.TextureLoader().load(
        "img/whitepixel.png"
      ) /* new THREE.DataTexture(
        null,
        0,
        0
      )*/,
    });
    const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    //this.material.uniforms = this.uniforms;

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
    this.hibernating = true;
  }

  wakeUp() {
    this.hibernating = false;
    this.scene.add(this.mesh);
    return this;
  }

  addData(propData, heightImageData) {
    if (this.hibernating) {
      throw new Error("This chunk is hibernating");
    }

    this.heightImageData = heightImageData;
    this.propData = propData;
  }

  addTiles(tiles) {
    if (this.hibernating) {
      throw new Error("This chunk is hibernating");
    }

    this.tiles = tiles;
  }

  addTile(tile) {
    if (this.hibernating) {
      throw new Error("This chunk is hibernating");
    }

    this.tiles.push(tile);
  }

  removeTiles(tiles) {
    tiles.forEach(this.removeTile);
  }

  removeTile(tile) {
    //TODO: remove tile
  }

  render(now) {
    if (this.hibernating) {
      return;
    }

    if (this.heightImageData && this.imageManipulator.isFree()) {
      const {
        normalTexture,
        groundTexture,
      } = this.imageManipulator.renderGround(
        this.size,
        this.heightImageData,
        this.propData
      );

      this.material.normalMap = normalTexture;
      this.material.map = groundTexture;

      this.propData = null;
      this.heightImageData = null;
    }

    //TODO, build images

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
