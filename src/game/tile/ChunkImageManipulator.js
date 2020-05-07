import * as THREE from "three";
import NormalMapGeneratorVertexShader from "./shaders/NormalMapGeneratorVertexShader";
import NormalMapGeneratorFragmentShader from "./shaders/NormalMapGeneratorFragmentShader";
import SimpleUvVertexShader from "./shaders/SimpleUvVertexShader";
import ResizeFragmentShader from "./shaders/ResizeFragmentShader";
import TileChunkCropFragmentShader from "./shaders/TileChunkCropFragmentShader";
import GroundFragmentShader from "./shaders/GroundFragmentShader";
import NormalMapCombineFragmentShader from "./shaders/NormalMapCombineFragmentShader";
//import SmoothNormalMapFragmentShader from "./shaders/SmoothNormalMapFragmentShader";
import SmoothHeightMapFragmentShader from "./shaders/SmoothHeightMapFragmentShader";

const DEBUG = true;
const TILEBORDERS = true;

const TEXTURE_GROUND = new THREE.TextureLoader().load(
  "img/groundTileTextures.png"
);

const TEXTURE_GROUND_NORMAL = new THREE.TextureLoader().load(
  "img/groundTileTexturesNormal.png"
);

const TEXTURE_BRUSHES = new THREE.TextureLoader().load("img/brushes.png");

const HEIGHT_TO_NORMAL_MATERIAL = new THREE.ShaderMaterial({
  vertexShader: NormalMapGeneratorVertexShader,
  fragmentShader: NormalMapGeneratorFragmentShader,
  transparent: false,
  depthWrite: false,
  depthTest: false,
});

const HEIGHT_TO_NORMAL_MATERIAL_uniforms = {
  heightMap: {
    type: "t",
    value: null,
  },
  borders: {
    type: "i",
    value: 0,
  },
};

HEIGHT_TO_NORMAL_MATERIAL.uniforms = HEIGHT_TO_NORMAL_MATERIAL_uniforms;

const RESIZE_MATERIAL = new THREE.ShaderMaterial({
  vertexShader: SimpleUvVertexShader,
  fragmentShader: ResizeFragmentShader,
  transparent: false,
  depthWrite: false,
  depthTest: false,
});

const RESIZE_MATERIAL_uniforms = {
  map: {
    type: "t",
    value: null,
  },
  borders: {
    type: "i",
    value: 0,
  },
};

RESIZE_MATERIAL.uniforms = RESIZE_MATERIAL_uniforms;

const CROP_MATERIAL = new THREE.ShaderMaterial({
  vertexShader: SimpleUvVertexShader,
  fragmentShader: TileChunkCropFragmentShader,
  transparent: false,
  depthWrite: false,
  depthTest: false,
});

const CROP_MATERIAL_uniforms = {
  map: {
    type: "t",
    value: null,
  },
  size: {
    type: "i",
    value: 0,
  },
  borders: {
    type: "i",
    value: 0,
  },
};

CROP_MATERIAL.uniforms = CROP_MATERIAL_uniforms;

const GROUND_MATERIAL = new THREE.ShaderMaterial({
  vertexShader: SimpleUvVertexShader,
  fragmentShader: GroundFragmentShader,
  transparent: false,
  depthWrite: false,
  depthTest: false,
});

const GROUND_MATERIAL_uniforms = {
  groundTexture: {
    type: "t",
    value: TEXTURE_GROUND,
  },
  propMap: {
    type: "t",
    value: null,
  },
  size: {
    type: "f",
    value: 0,
  },
  tileBorders: {
    type: "i",
    value: DEBUG || TILEBORDERS ? 1 : 0,
  },
  borders: {
    type: "i",
    value: DEBUG ? 1 : 0,
  },
  brushMap: {
    type: "t",
    value: TEXTURE_BRUSHES,
  },
  normalMode: {
    type: "i",
    value: 0,
  },
};

GROUND_MATERIAL.uniforms = GROUND_MATERIAL_uniforms;

const GROUND_MATERIAL_NORMAL = new THREE.ShaderMaterial({
  vertexShader: SimpleUvVertexShader,
  fragmentShader: GroundFragmentShader,
  transparent: false,
  depthWrite: false,
  depthTest: false,
});

const GROUND_MATERIAL_NORMAL_uniforms = {
  groundTexture: {
    type: "t",
    value: TEXTURE_GROUND_NORMAL,
  },
  propMap: {
    type: "t",
    value: null,
  },
  size: {
    type: "f",
    value: 0,
  },
  tileBorders: {
    type: "i",
    value: 0,
  },
  brushMap: {
    type: "t",
    value: TEXTURE_BRUSHES,
  },
  normalMode: {
    type: "i",
    value: 1,
  },
};

GROUND_MATERIAL_NORMAL.uniforms = GROUND_MATERIAL_NORMAL_uniforms;

const NORMAL_MAP_COMBINE = new THREE.ShaderMaterial({
  vertexShader: SimpleUvVertexShader,
  fragmentShader: NormalMapCombineFragmentShader,
  transparent: false,
  depthWrite: false,
  depthTest: false,
});

const NORMAL_MAP_COMBINE_uniforms = {
  mapA: {
    type: "t",
    value: null,
  },
  mapB: {
    type: "t",
    value: null,
  },
};

NORMAL_MAP_COMBINE.uniforms = NORMAL_MAP_COMBINE_uniforms;

const SMOOTH_NORMALMAP_MATERIAL = new THREE.ShaderMaterial({
  vertexShader: SimpleUvVertexShader,
  fragmentShader: SmoothHeightMapFragmentShader,
  transparent: false,
  depthWrite: false,
  depthTest: false,
});

const SMOOTH_NORMALMAP_MATERIAL_uniforms = {
  map: {
    type: "t",
    value: null,
  },
  pixelSize: {
    type: "f",
    value: 0,
  },
  tileSize: {
    type: "f",
    value: 0,
  },
};

SMOOTH_NORMALMAP_MATERIAL.uniforms = SMOOTH_NORMALMAP_MATERIAL_uniforms;

const getRenderTargetCameraAndMesh = (
  size,
  pixelSize,
  material,
  minFilter = THREE.NearestFilter,
  magFilter = THREE.NearestFilter
) => {
  const renderTarget = new THREE.WebGLRenderTarget(pixelSize, pixelSize, {
    minFilter,
    magFilter,
    //format: THREE.RGBFormat,
    depthBuffer: false,
    stencilBuffer: false,
  });

  const camera = new THREE.OrthographicCamera(
    size / -2,
    size / 2,
    size / 2,
    size / -2,
    -1000,
    1000
  );

  camera.position.set(0, 0, 50);
  camera.lookAt(0, 0, 0);

  const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 0, 0);
  mesh.scale.set(size, size, 1);

  return { renderTarget, camera, mesh };
};

class ChunkImageManipulator {
  constructor(gameScene) {
    this.gameScene = gameScene;
    this.renderScene = new THREE.Scene();
    this.isUsed = false;
  }

  isFree() {
    return !this.used;
  }

  setFree() {
    this.used = false;
  }

  renderGround(size, propImageData) {
    this.used = true;

    const propMap = new THREE.Texture(new ImageData(propImageData, size + 2));
    propMap.minFilter = THREE.NearestFilter;
    propMap.magFilter = THREE.NearestFilter;
    propMap.needsUpdate = true;

    const groundTexture = this.renderGroundChunkDiffuseMap(size, propMap);
    const groundNormalMap = this.renderGroundChunkNormalMap(size, propMap);
    /*
    const slopeTexture = this.renderGroundChunkSlopeNormalMap(
      size,
      heightImageData
    );

    const normalTexture = this.combineNormals(
      slopeTexture,
      groundNormalMap,
      size
    );
    */

    return { groundTexture, normalTexture: groundNormalMap };
  }

  renderToTarget(mesh, camera, renderTarget) {
    this.renderScene.add(mesh);
    this.gameScene.renderer.clear();
    this.gameScene.renderer.setRenderTarget(renderTarget);
    this.gameScene.renderer.render(this.renderScene, camera);
    this.gameScene.renderer.setRenderTarget(null);
    this.renderScene.remove(mesh);
  }

  combineNormals(a, b, size) {
    const pixelSize = size * 64;

    const combine = (mapA, mapB) => {
      const { renderTarget, camera, mesh } = getRenderTargetCameraAndMesh(
        size,
        pixelSize,
        NORMAL_MAP_COMBINE,
        THREE.LinearFilter,
        THREE.LinearFilter
      );

      mesh.material.uniforms.mapA.value = mapA;
      mesh.material.uniforms.mapB.value = mapB;

      this.renderToTarget(mesh, camera, renderTarget);

      return renderTarget.texture;
    };

    return combine(a, b);
  }

  renderGroundChunkNormalMap(size, propMap) {
    const pixelSize = size * 64;

    const makeGroundTexture = () => {
      const { renderTarget, camera, mesh } = getRenderTargetCameraAndMesh(
        size,
        pixelSize,
        GROUND_MATERIAL_NORMAL,
        THREE.LinearFilter,
        THREE.LinearFilter
      );

      mesh.material.uniforms.propMap.value = propMap;
      mesh.material.uniforms.size.value = size;

      this.renderToTarget(mesh, camera, renderTarget);

      return renderTarget.texture;
    };

    return makeGroundTexture();
  }

  renderGroundChunkDiffuseMap(size, propMap) {
    const pixelSize = size * 64;

    const makeGroundTexture = () => {
      const { renderTarget, camera, mesh } = getRenderTargetCameraAndMesh(
        size,
        pixelSize,
        GROUND_MATERIAL,
        THREE.LinearFilter,
        THREE.LinearFilter
      );

      mesh.material.uniforms.propMap.value = propMap;
      mesh.material.uniforms.size.value = size;

      this.renderToTarget(mesh, camera, renderTarget);

      return renderTarget.texture;
    };

    return makeGroundTexture();
  }

  renderGroundChunkSlopeNormalMap(size, heightImageData) {
    const heightMap = new THREE.Texture(
      new ImageData(heightImageData, size + 2)
    );
    heightMap.minFilter = THREE.LinearFilter;
    heightMap.magFilter = THREE.LinearFilter;
    heightMap.needsUpdate = true;

    const makeNormalMap = (map, scale = 4) => {
      const { renderTarget, camera, mesh } = getRenderTargetCameraAndMesh(
        size + 2,
        (size + 2) * scale,
        HEIGHT_TO_NORMAL_MATERIAL,
        THREE.LinearFilter,
        THREE.LinearFilter
      );

      mesh.material.uniforms.heightMap.value = map;

      this.renderToTarget(mesh, camera, renderTarget);

      return renderTarget.texture;
    };

    const resize = (map, scale = 2) => {
      const { renderTarget, camera, mesh } = getRenderTargetCameraAndMesh(
        size + 2,
        (size + 2) * scale,
        RESIZE_MATERIAL,
        THREE.LinearFilter,
        THREE.LinearFilter
      );

      mesh.material.uniforms.map.value = map;

      this.renderToTarget(mesh, camera, renderTarget);
      return renderTarget.texture;
    };

    const crop = (map) => {
      const { renderTarget, camera, mesh } = getRenderTargetCameraAndMesh(
        size,
        size * 32,
        CROP_MATERIAL,
        THREE.LinearFilter,
        THREE.LinearFilter
      );

      mesh.material.uniforms.map.value = map;
      mesh.material.uniforms.size.value = size;

      this.renderToTarget(mesh, camera, renderTarget);

      return renderTarget.texture;
    };

    let resizedHeightMap = resize(heightMap, 4);
    const normalMap = makeNormalMap(resizedHeightMap, 2);
    const cropped = crop(normalMap);
    return cropped;
  }
}

export default ChunkImageManipulator;
