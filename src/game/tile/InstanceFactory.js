import * as THREE from "three";
import CubeTileFragmentShader from "./shaders/CubeTileFragmentShader";
import CubeTileVertexShader from "./shaders/CubeTileVertexShader";
import GLTFLoader from "three-gltf-loader";
import TileContainer from "./TileContainer";

let loadedCube = null;
let numberCreated = 0;

class InstanceFactory {
  constructor(scene, size) {
    this.scene = scene;
    this.loader = new GLTFLoader();
    this.ready = this.init();
    this.size = size || 2000;

    const texture = new THREE.TextureLoader().load("img/spritesheet.png");
    //texture.minFilter = THREE.LinearMipMapNearestFilter;

    /*
    THREE.NearestFilter
THREE.NearestMipMapNearestFilter
THREE.NearestMipMapLinearFilter
THREE.LinearFilter
THREE.LinearMipMapNearestFilter
THREE.LinearMipMapLinearFilter
*/
    this.material = new THREE.RawShaderMaterial({
      uniforms: {
        map: { value: texture }
      },
      blending: THREE.NormalBlending,
      opacity: 1,
      side: THREE.DoubleSide,
      //wireframe: true,
      alphaTest: 0.5,
      depthWrite: false,
      //depthTest: false,
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

  create() {
    console.log("create container");
    return this.makeInstanced(loadedCube, this.size);
  }

  async loadCube() {
    if (loadedCube) {
      return loadedCube;
    }

    const cube = await this.load("img/halfCubeNonIsometric.glb");
    const cubeGeometry = cube.scene.children[0].geometry;
    cubeGeometry.rotateY((90 * Math.PI) / 180);
    cubeGeometry.scale(0.5, 0.5, 0.5);

    loadedCube = cubeGeometry;
    return loadedCube;
  }

  makeInstanced(original, amount) {
    original = original.clone();

    let offsetAttribute,
      opacityAttribute,
      textureNumberAttribute,
      brushNumberAttribute,
      typeAttribute;

    const geometry = new THREE.InstancedBufferGeometry();
    geometry.index = original.index;
    geometry.attributes.position = original.attributes.position;
    geometry.attributes.uv = original.attributes.uv;

    const offsets = [];
    const opacitys = [];
    const textureNumbers = [];
    const brushNumbers = [];
    const types = [];

    for (let i = 0; i < amount; i++) {
      offsets.push(0, 0, 0.5);
      opacitys.push(0);
      textureNumbers.push(0, 0, 0, 0);
      brushNumbers.push(0, 0, 0, 0);
      types.push(0);
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
      4
    ).setDynamic(true);

    brushNumberAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(textureNumbers),
      4
    ).setDynamic(true);

    typeAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(types),
      1
    ).setDynamic(true);

    geometry.addAttribute("offset", offsetAttribute);
    geometry.addAttribute("opacity", opacityAttribute);
    geometry.addAttribute("textureNumber", textureNumberAttribute);
    geometry.addAttribute("brushNumber", brushNumberAttribute);
    geometry.addAttribute("type", typeAttribute);

    const mesh = new THREE.Mesh(geometry, this.material);
    mesh.frustumCulled = false;

    this.scene.add(mesh);

    numberCreated++;

    return new TileContainer(
      offsetAttribute,
      opacityAttribute,
      textureNumberAttribute,
      brushNumberAttribute,
      typeAttribute,
      amount,
      mesh,
      this.scene,
      numberCreated
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

export default InstanceFactory;