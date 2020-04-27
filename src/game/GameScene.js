import * as THREE from "three";

class GameScene {
  constructor(gameCamera) {
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.zoom = 1;
    this.stats = null;
    this.gameCamera = gameCamera;

    this.pointLight = null;

    window.scene = this;

    this.create();
  }

  create() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0, 46 / 255, 61 / 255);

    const d = 120;
    this.camera = new THREE.OrthographicCamera(
      (this.zoom * window.innerWidth) / -d,
      (this.zoom * window.innerWidth) / d,
      (this.zoom * window.innerHeight) / d,
      (this.zoom * window.innerHeight) / -d,
      -500,
      500
    );

    //this.camera.position.set(25, -25, 50);
    this.camera.position.set(0, 0, 0);
    this.camera.lookAt(0, 0, 0);
    //this.camera.rotation.z += (50.77 * Math.PI) / 180;

    this.camera.position.set(512, 512, 50);

    this.gameCamera.init(this.camera);
  }

  init(element) {
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.context.getExtension("GL_OES_standard_derivatives");
    this.renderer.autoClear = false;
    //this.renderer.sortObjects = false;
    element.appendChild(this.renderer.domElement);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(1.5, 1, 1).normalize();
    this.scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight2.position.set(1, 1, 1).normalize();
    this.scene.add(directionalLight2);

    this.pointLight = new THREE.PointLight(0xffff88, 1.0, 10);
    this.pointLight.position.set(512, 512, 5);
    this.scene.add(this.pointLight);

    //this.scene.add(new THREE.AmbientLight(0x606060));

    var geometry = new THREE.BoxGeometry(1, 1, 2);
    var material = new THREE.MeshBasicMaterial({
      //transparent: true,
      //opacity: 0.25,
      color: 0x00ff00,
      wireframe: false,
    });
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.position.set(512, 512, 4);
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
    this.cube.position.y += 0.01;

    this.pointLight.position.x -= 0.01;

    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
  }
}

export default GameScene;
