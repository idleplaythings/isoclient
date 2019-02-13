import * as THREE from "three";

import TileGroundFragmentShader from "./shaders/TileGroundFragmentShader";
import TileGroundVertexShader from "./shaders/TileGroundVertexShader";

const defaultOpacity = [];

const getDefaultOpacity = size => {
  if (defaultOpacity.length > 0) {
    return defaultOpacity;
  }

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      if (x === size - 1 || x === 0 || y === 0 || y === size - 1) {
        defaultOpacity.push(0);
      } else {
        defaultOpacity.push(1);
      }
    }
  }

  return defaultOpacity;
};

class TileGround {
  constructor(scene, size, material) {
    this.scene = scene;
    this.size = size;
    console.log("ground size", size);
    this.opacityAttribute = new THREE.BufferAttribute(
      new Float32Array(getDefaultOpacity(this.size + 1)),
      1
    );

    this.geometry = new THREE.PlaneBufferGeometry(size, size, size, size);
    this.geometry.attributes.position.setDynamic(true);

    console.log(this.geometry);

    this.material = new THREE.ShaderMaterial({
      blending: THREE.NormalBlending,
      opacity: 1,
      side: THREE.DoubleSide,
      wireframe: true,
      alphaTest: 0.5,
      //depthWrite: false,
      //depthTest: false,
      transparent: true,
      vertexShader: TileGroundVertexShader,
      fragmentShader: TileGroundFragmentShader
    });

    this.geometry.addAttribute("opacity", this.opacityAttribute);

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(0, 0, 10000);
    this.scene.add(this.mesh);
  }

  setPosition(position) {
    this.mesh.position.set(position.x, position.y, 0);
  }

  setHeights(heights) {
    heights.forEach((height, index) => {
      this.geometry.attributes.position.setZ(index, height);
    });

    this.geometry.attributes.position.needsUpdate = true;
  }
}

export default TileGround;
