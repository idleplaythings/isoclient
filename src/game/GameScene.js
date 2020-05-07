import * as THREE from "three";
import WaterVertexShader from "./tile/shaders/WaterVertexShader";
import WaterFragmentShader from "./tile/shaders/WaterFragmentShader";

const noise = new THREE.TextureLoader().load("img/noise.png");
noise.wrapS = noise.wrapT = THREE.RepeatWrapping;
const noise2 = new THREE.TextureLoader().load("img/noise2.png");
noise2.wrapS = noise2.wrapT = THREE.RepeatWrapping;

export const WATERMATERIAL = new THREE.ShaderMaterial({
  vertexShader: WaterVertexShader,
  fragmentShader: WaterFragmentShader,
  uniforms: {
    time: { type: "f", value: 0 },
    noise1: { type: "t", value: noise },
    noise2: { type: "t", value: noise2 },
  },
  transparent: true,
  blending: THREE.AdditiveBlending,
});

const waterCreadted = Date.now();

class GameScene {
  constructor(gameCamera) {
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.stats = null;
    this.gameCamera = gameCamera;

    this.pointLight = null;

    this.directionalLight = new THREE.DirectionalLight(
      new THREE.Color(1, 1, 1),
      1.2
    );
    this.directionalLight.position.set(1, 1, 1).normalize();
    this.directionalLight.target.position.set(0, 0, 0);

    this.ambientLight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 0.1);

    this.directionalLightStep = 0.01;

    this.create();
  }

  create() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0, 46 / 255, 61 / 255);
    this.gameCamera.init(this.scene);
  }

  init(element) {
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      stencil: false,
      antialias: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.getContext().getExtension("GL_OES_standard_derivatives");
    this.renderer.autoClear = false;
    //this.renderer.sortObjects = false;
    element.appendChild(this.renderer.domElement);

    this.scene.add(this.directionalLight);
    this.scene.add(this.directionalLight.target);

    this.pointLight = new THREE.PointLight(0xffffff, 1.0, 100);
    this.pointLight.position.set(512, 512, 5);
    //this.scene.add(this.pointLight);

    this.scene.add(this.ambientLight);

    this.cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.25,
        color: 0x00ff00,
        //wireframe: true,
      })
    );
    this.cube.position.set(511, 513, 2.5);
    //this.cube.renderOrder = 3;
    //this.scene.add(this.cube);

    /*
    const waterGeometry = new THREE.PlaneGeometry(60000, 60000, 1, 1);
    const waterMaterial = new THREE.MeshBasicMaterial({
      //transparent: true,
      //opacity: 0.25,
      color: 0x0000ff,
      wireframe: false
    });

    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.position.set(0, 0, 0);
    this.scene.add(water);
    */

    /*
    const sphereRadius = 3;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereBufferGeometry(
      sphereRadius,
      sphereWidthDivisions,
      sphereHeightDivisions
    );
    const sphereMat = new THREE.MeshPhongMaterial({ color: "#CA8" });
    const mesh = new THREE.Mesh(sphereGeo, sphereMat);
    mesh.position.set(512, 512, 0);
    this.scene.add(mesh);
    */

    /*
    var material = new THREE.MeshStandardMaterial({ color: 0x00cc00 });

    //create a triangular geometry
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-1, -1, 0));
    geometry.vertices.push(new THREE.Vector3(1, 1, 0));
    geometry.vertices.push(new THREE.Vector3(1, -1, 0));
    geometry.vertices.push(new THREE.Vector3(-1, 1, 0));

    //create a new face using vertices 0, 1, 2
    var normal = new THREE.Vector3(0, 0, 1); //optional
    var color = new THREE.Color(0xffaa00); //optional
    var materialIndex = 0; //optional
    var face = new THREE.Face3(0, 2, 1, normal, color, materialIndex);

    //add the face to the geometry's faces array
    geometry.faces.push(face);
    geometry.faces.push(new THREE.Face3(3, 0, 1, normal, color, materialIndex));

    //the face normals and vertex normals can be calculated automatically if not supplied above
    //geometry.computeFaceNormals();
    //geometry.computeVertexNormals();

    console.log(geometry);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(512, 512, 3);
    this.scene.add(mesh);
    */
    /*
    const factory = new GroundTileGeometryFactory(4);

    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      wireframe: false,
      map: new THREE.TextureLoader().load("img/test.png"),
    });

    const geometry = factory.create();

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(512, 512, 2);
    //this.scene.add(mesh);
    */
  }

  add(element) {
    this.scene.add(element);
  }

  remove(element) {
    this.scene.remove(element);
  }

  render() {
    if (!this.renderer) {
      return;
    }

    WATERMATERIAL.uniforms.time.value = Date.now() - waterCreadted;

    //this.camera.position.x += 0.05;
    //this.camera.position.y -= 0.05;
    //this.cube.position.x += 0.01;

    //this.directionalLight.position.y += 0.1;

    /*
    this.directionalLight.position.x += this.directionalLightStep;

    if (this.directionalLight.position.x > 2) {
      this.directionalLightStep = Math.abs(this.directionalLightStep) * -1;
    } else if (this.directionalLight.position.x < -2) {
      this.directionalLightStep = Math.abs(this.directionalLightStep);
    }
    */

    this.renderer.clear();
    this.renderer.render(this.scene, this.gameCamera.getCamera());
  }

  onResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

export default GameScene;
