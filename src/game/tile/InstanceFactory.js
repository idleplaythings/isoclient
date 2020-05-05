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
    const textureNormal = new THREE.TextureLoader().load(
      "img/spritesheetNormal.png"
    );
    const wallTexture = new THREE.TextureLoader().load(
      "img/wallSpritesheet.png"
    );
    const texture2 = new THREE.TextureLoader().load("img/spritesheet2x2.png");
    const texture2Normal = new THREE.TextureLoader().load(
      "img/spritesheet2x2Normal.png"
    );
    const wallNormalTexture = new THREE.TextureLoader().load(
      "img/wallNormalSpritesheet.png"
    );
    //noise.wrapS = noise.wrapT = THREE.RepeatWrapping;
    //const noise2 = new THREE.TextureLoader().load("img/noise2.png");
    //noise2.wrapS = noise2.wrapT = THREE.RepeatWrapping;
    //texture.minFilter = THREE.LinearMipMapNearestFilter;

    this.uniforms = {
      map: { value: texture },
      mapNormal: { value: textureNormal },
      map2: { value: texture2 },
      map2Normal: { type: "t", value: texture2Normal },
      wallMap: { value: wallTexture },
      wallNormalMap: { value: wallNormalTexture },
      time: { type: "f", value: 0.0 },
      directionalLightPosition: {
        type: "v3",
        value: this.scene.directionalLight.position.clone().normalize(),
      },
      directionalLightColor: {
        type: "v3",
        value: this.scene.directionalLight.color,
      },
      directionalLightIntensity: {
        type: "f",
        value: this.scene.directionalLight.intensity,
      },
      ambientLightColor: {
        type: "v3",
        value: this.scene.ambientLight.color,
      },
      ambientLightIntensity: {
        type: "f",
        value: this.scene.ambientLight.intensity,
      },
    };

    this.material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      blending: THREE.NormalBlending,
      opacity: 1,
      side: THREE.DoubleSide,
      //wireframe: true,
      alphaTest: 0.5,
      depthWrite: false,
      //depthTest: false,
      transparent: true,
      vertexShader: CubeTileVertexShader,
      fragmentShader: CubeTileFragmentShader,
    });
  }

  render() {
    if (!this.ready) {
      return;
    }

    this.uniforms.directionalLightPosition.value = this.scene.directionalLight.position
      .clone()
      .normalize();
    this.uniforms.directionalLightColor.value = this.scene.directionalLight.color;
    this.uniforms.directionalLightIntensity.value = this.scene.directionalLight.intensity;
    this.uniforms.ambientLightColor.value = this.scene.ambientLight.color;
    this.uniforms.ambientLightIntensity.value = this.scene.ambientLight.intensity;
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
      typeAttribute,
      textureVariantAttribute;

    const geometry = new THREE.InstancedBufferGeometry();
    geometry.index = original.index;
    geometry.attributes.position = original.attributes.position;
    geometry.attributes.uv = original.attributes.uv;

    const offsets = [];
    const opacitys = [];
    const textureNumbers = [];
    const brushNumbers = [];
    const types = [];
    const textureVariant = [];

    for (let i = 0; i < amount; i++) {
      offsets.push(0, 0, 0.5);
      opacitys.push(0);
      textureNumbers.push(-1, -1, -1, -1);
      brushNumbers.push(-1, -1, -1, -1);
      types.push(0, 1, 0);
      textureVariant.push(0);
    }

    offsetAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(offsets),
      3
    ).setUsage(THREE.DynamicDrawUsage);

    opacityAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(opacitys),
      1
    ).setUsage(THREE.DynamicDrawUsage);

    textureNumber1Attribute = new THREE.InstancedBufferAttribute(
      new Float32Array(textureNumbers),
      4
    ).setUsage(THREE.DynamicDrawUsage);

    textureNumber2Attribute = new THREE.InstancedBufferAttribute(
      new Float32Array(brushNumbers),
      4
    ).setUsage(THREE.DynamicDrawUsage);

    typeAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(types),
      3
    ).setUsage(THREE.DynamicDrawUsage);

    textureVariantAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(textureVariant),
      1
    ).setUsage(THREE.DynamicDrawUsage);

    geometry.setAttribute("offset", offsetAttribute);
    geometry.setAttribute("opacity", opacityAttribute);
    geometry.setAttribute("textureNumber1", textureNumber1Attribute);
    geometry.setAttribute("textureNumber2", textureNumber2Attribute);
    geometry.setAttribute("type", typeAttribute);
    geometry.setAttribute("textureVariant", textureVariantAttribute);

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
      textureVariantAttribute,
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
        (gltf) => {
          resolve(gltf);
        },
        (xhr) => {},
        (error) => {
          console.error("An error happened", error);
        }
      );
    });
  }
}

export default InstanceFactory;
