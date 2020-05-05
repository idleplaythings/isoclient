import Chunk from "../../../model/tile/Chunk";
import * as THREE from "three";
import { Vector3 } from "three";
import { WATERMATERIAL } from "../../GameScene";

const WHITEPIXEL = new THREE.TextureLoader().load("img/whitepixel.png");

class GroundChunk extends Chunk {
  constructor(position, size, scene, imageManipulator, geometry) {
    super(position, size);
    this.forRender = [];
    this.scene = scene;
    this.tiles = [];

    this.capacity = 0;
    this.hibernating = false;

    this.imageManipulator = imageManipulator;

    this.propData = null;

    this.material = new THREE.MeshStandardMaterial({
      normalMap: new THREE.DataTexture(null, 0, 0),
      normalMapType: THREE.TangentSpaceNormalMap,
      map: WHITEPIXEL,
      wireframe: false,
    });
    this.geometry = geometry; //new THREE.PlaneGeometry(size, size, size * 2, size * 2);
    //this.material.uniforms = this.uniforms;

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    //this.mesh.scale.set(this.size, this.size, 1);
    this.mesh.position.set(
      this.position.x + this.size / 2 - 0.5,
      this.position.y - this.size / 2 + 0.5,
      this.position.z
    );

    this.water = new THREE.Mesh(
      new THREE.PlaneGeometry(size, size, 1, 1),
      WATERMATERIAL
    );

    this.water.position.set(
      this.position.x + this.size / 2 - 0.5,
      this.position.y - this.size / 2 + 0.5,
      1.5
    );
  }

  setPosition(position) {
    position = new THREE.Vector3(position.x, position.y, 0);
    this.position = position;
    this.water.position.set(
      this.position.x + this.size / 2 - 0.5,
      this.position.y - this.size / 2 + 0.5,
      1.5
    );
    this.mesh.position.set(
      this.position.x + this.size / 2 - 0.5,
      this.position.y - this.size / 2 + 0.5,
      this.position.z
    );
  }

  hibernate() {
    this.scene.remove(this.mesh);
    this.scene.remove(this.water);
    this.hibernating = true;
  }

  wakeUp() {
    this.hibernating = false;
    this.scene.add(this.mesh);
    this.scene.add(this.water);
    return this;
  }

  addData({ propData, vertices }) {
    if (this.hibernating) {
      throw new Error("This chunk is hibernating");
    }

    vertices = vertices.map(
      (position) => new Vector3(position.x, position.y, position.z)
    );

    this.geometry.vertices = vertices;
    //this.geometry.computeFaceNormals();
    this.geometry.computeVertexNormals(false);

    this.geometry.verticesNeedUpdate = true;
    this.geometry.elementsNeedUpdate = true;
    this.geometry.normalsNeedUpdate = true;

    //console.log(this.geometry);
    //console.log(this.geometry.vertices);

    //this.geometry.vertices.forEach((v) => v.setZ(Math.random() * 5));
    //this.geometry.verticesNeedUpdate = true;

    //this.geometry.vertices[0].setZ(3);
    //this.geometry.verticesNeedUpdate = true;

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

    if (this.propData && this.imageManipulator.isFree()) {
      const {
        normalTexture,
        groundTexture,
      } = this.imageManipulator.renderGround(this.size, this.propData);

      this.material.normalMap = normalTexture;
      this.material.map = groundTexture;

      this.propData = null;
    }

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
