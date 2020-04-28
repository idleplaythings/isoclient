import * as THREE from "three";

class GameScene {
  constructor(gameCamera) {
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.stats = null;
    this.gameCamera = gameCamera;

    this.pointLight = null;

    window.scene = this;

    this.create();
  }

  create() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0, 46 / 255, 61 / 255);
    this.gameCamera.init(this.scene);
  }

  init(element) {
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.context.getExtension("GL_OES_standard_derivatives");
    this.renderer.autoClear = false;
    //this.renderer.sortObjects = false;
    element.appendChild(this.renderer.domElement);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
    this.directionalLight.position.set(50, -15, 7);
    this.directionalLight.target.position.set(0, 0, 0);
    this.scene.add(this.directionalLight);
    this.scene.add(this.directionalLight.target);

    this.directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.0);
    this.directionalLight2.position.set(50, -15, 15);
    this.directionalLight2.target.position.set(0, 0, 0);
    this.scene.add(this.directionalLight2);
    this.scene.add(this.directionalLight2.target);

    this.pointLight = new THREE.PointLight(0xffffff, 1.0, 100);
    this.pointLight.position.set(512, 512, 5);
    //this.scene.add(this.pointLight);

    //this.scene.add(new THREE.AmbientLight(0xffffff, 0.01));

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({
      //transparent: true,
      //opacity: 0.25,
      color: 0x00ff00,
      wireframe: true,
    });
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.position.set(512, 512, 0.5);
    this.cube.renderOrder = 3;
    this.scene.add(this.cube);

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

    //this.camera.position.x += 0.05;
    //this.camera.position.y -= 0.05;
    //this.cube.position.y += 0.01;

    this.pointLight.position.x += 0.01;
    //this.directionalLight.position.y -= 0.01;

    this.renderer.clear();
    this.renderer.render(this.scene, this.gameCamera.getCamera());
  }
}

export default GameScene;
