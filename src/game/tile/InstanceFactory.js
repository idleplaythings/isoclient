import * as THREE from "three";
import CubeTileFragmentShader from "./shaders/CubeTileFragmentShader";
import CubeTileVertexShader from "./shaders/CubeTileVertexShader";
import GLTFLoader from "three-gltf-loader";
import TileContainer from "./TileContainer";

let loadedCube = null;
let numberCreated = 0;

class InstanceFactory {
  constructor(scene) {
    this.scene = scene;
    this.loader = new GLTFLoader();
    this.ready = false;

    this.init();

    const texture = new THREE.TextureLoader().load("img/spritesheet.png");
    const noise = new THREE.TextureLoader().load("img/noise.png");
    noise.wrapS = noise.wrapT = THREE.RepeatWrapping;
    const noise2 = new THREE.TextureLoader().load("img/noise2.png");
    noise2.wrapS = noise2.wrapT = THREE.RepeatWrapping;
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
        map: { value: texture },
        noiseMap1: { value: noise },
        noiseMap2: { value: noise2},
        time: { type: "f", value: 0.0 }
      },
      blending: THREE.NormalBlending,
      opacity: 1,
      side: THREE.DoubleSide,
      //wireframe: true,
      alphaTest: 0.5,
      //depthWrite: false,
      //depthTest: false,
      transparent: true,
      vertexShader: CubeTileVertexShader,
      fragmentShader: CubeTileFragmentShader
    });

    this.start = Date.now() / 3000;
    this.updateLoop();
  }

  updateLoop() {
    const now = Date.now();
    const sineAmplitude = 1.0;
    const sineFrequency = 200;

    const sine =
      sineAmplitude * 0.5 * Math.sin(now / sineFrequency) + sineAmplitude;

    this.material.uniforms.time.value = Date.now() / 3000 - this.start;

    requestAnimationFrame(this.updateLoop.bind(this));
  }

  async init() {
    if (!loadedCube) {
      loadedCube = await this.loadCube();
    }

    this.ready = true;
  }

  create(size = 2000) {
    return this.makeInstanced(loadedCube, size);
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
      textureNumber1Attribute,
      textureNumber2Attribute,
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
      textureNumbers.push(-1, -1, -1, -1);
      brushNumbers.push(-1, -1, -1, -1);
      types.push(0, 1, 0);
    }

    offsetAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(offsets),
      3
    ).setDynamic(true);

    opacityAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(opacitys),
      1
    ).setDynamic(true);

    textureNumber1Attribute = new THREE.InstancedBufferAttribute(
      new Float32Array(textureNumbers),
      4
    ).setDynamic(true);

    textureNumber2Attribute = new THREE.InstancedBufferAttribute(
      new Float32Array(brushNumbers),
      4
    ).setDynamic(true);

    typeAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(types),
      3
    ).setDynamic(true);

    geometry.addAttribute("offset", offsetAttribute);
    geometry.addAttribute("opacity", opacityAttribute);
    geometry.addAttribute("textureNumber1", textureNumber1Attribute);
    geometry.addAttribute("textureNumber2", textureNumber2Attribute);
    geometry.addAttribute("type", typeAttribute);

    const mesh = new THREE.Mesh(geometry, this.material);
    mesh.frustumCulled = false;

    this.scene.add(mesh);

    numberCreated++;

    return new TileContainer(
      offsetAttribute,
      opacityAttribute,
      textureNumber1Attribute,
      textureNumber2Attribute,
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
