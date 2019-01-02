import * as THREE from "three";
import CubeTileFragmentShader from "./shaders/CubeTileFragmentShader";
import CubeTileVertexShader from "./shaders/CubeTileVertexShader";
import GLTFLoader from "three-gltf-loader";
import TileContainer from "./TileContainer";

let loadedCube = null;

class TileService {
  constructor(scene) {
    this.scene = scene;
    this.loader = new GLTFLoader();
    this.ready = this.init();
    this.creating = false;
    this.containers = [];

    this.material = new THREE.RawShaderMaterial({
      uniforms: {
        map: { value: new THREE.TextureLoader().load("img/spritesheet.png") }
      },
      //wireframe: true,
      depthWrite: false,
      transparent: true,
      vertexShader: CubeTileVertexShader,
      fragmentShader: CubeTileFragmentShader
    });
  }

  async init() {
    if (!loadedCube) {
      loadedCube = await this.loadCube();
    }

    return true;
  }

  async add(tile) {
    await this.ready;
    if (!this.hasFree()) {
      this.create();

      this.add(tile);
      return;
    }

    this.containers[this.containers.length - 1].add(tile);
    this.sortContainers();
  }

  hasFree() {
    return (
      this.containers.length > 0 &&
      this.containers[this.containers.length - 1].hasFree()
    );
  }

  sortContainers() {
    this.containers.sort((a, b) => a.free.length > b.free.length);
  }

  create() {
    console.log("create contaier");
    this.containers.push(this.makeInstanced(loadedCube, 1000));
    this.creating = false;
    return true;
  }

  async loadCube() {
    if (loadedCube) {
      return loadedCube;
    }

    const cube = await this.load("img/halfcubeUvReversed.glb");
    const cubeGeometry = cube.scene.children[0].geometry;
    cubeGeometry.rotateY((90 * Math.PI) / 180);
    cubeGeometry.scale(0.5, 0.5, 0.5);

    loadedCube = cubeGeometry;
    return loadedCube;
  }

  makeInstanced(original, amount) {
    original = original.clone();

    let offsetAttribute, opacityAttribute, textureNumberAttribute;

    const geometry = new THREE.InstancedBufferGeometry();
    geometry.index = original.index;
    geometry.attributes.position = original.attributes.position;
    geometry.attributes.uv = original.attributes.uv;

    const offsets = [];
    const opacitys = [];
    const textureNumbers = [];

    for (let i = 0; i < amount; i++) {
      offsets.push(0, 0, 0.5);
      opacitys.push(0);
      textureNumbers.push(0);
    }

    offsetAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(offsets),
      3
    ).setDynamic(true);

    opacityAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(opacitys),
      1
    ).setDynamic(true);

    textureNumberAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(textureNumbers),
      1
    ).setDynamic(true);

    geometry.addAttribute("offset", offsetAttribute);
    geometry.addAttribute("opacity", opacityAttribute);
    geometry.addAttribute("textureNumber", textureNumberAttribute);

    const mesh = new THREE.Mesh(geometry, this.material);
    mesh.frustumCulled = false;

    this.scene.add(mesh);
    return new TileContainer(
      offsetAttribute,
      opacityAttribute,
      textureNumberAttribute,
      amount,
      mesh,
      this.scene
    );
  }

  async load(path) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        path,
        gltf => {
          resolve(gltf);
        },
        xhr => {},
        error => {
          console.error("An error happened", error);
        }
      );
    });
  }
}

export default TileService;
