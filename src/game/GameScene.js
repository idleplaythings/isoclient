import * as THREE from "three";

class GameScene {
  constructor(gameCamera) {
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.zoom = 1.0;
    this.stats = null;
    this.gameCamera = gameCamera;

    this.create();
  }

  create() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0, 0, 0);

    const d = 150;
    this.camera = new THREE.OrthographicCamera(
      (this.zoom * window.innerWidth) / -d,
      (this.zoom * window.innerWidth) / d,
      (this.zoom * window.innerHeight) / d,
      (this.zoom * window.innerHeight) / -d,
      -500,
      500
    );

    this.camera.position.set(25, -25, 50); // all components equal
    //this.camera.rotation.z = (90 * Math.PI) / 180;
    this.camera.lookAt(0, 0, 0);
    this.camera.rotation.z += (50.77 * Math.PI) / 180;
    //this.createGround();
    this.gameCamera.init(this.camera);
  }

  init(element) {
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.autoClear = false;
    this.renderer.sortObjects = false;
    element.appendChild(this.renderer.domElement);

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true
    });
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.position.set(0, 0, 0.5);
    //this.scene.add(this.cube);

    this.stats = new window.Stats();
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);
  }

  createGround() {
    const texture = new THREE.TextureLoader().load("img/grass02.png");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(99, 99);
    const geometry = new THREE.PlaneGeometry(99, 99, 99, 99);
    const material = new THREE.MeshBasicMaterial({
      map: texture
    });
    const ground = new THREE.Mesh(geometry, material);
    this.scene.add(ground);
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

    this.stats.begin();

    //this.camera.position.x += 0.05;
    //this.camera.position.y -= 0.05;
    //this.cube.position.y += 0.01;
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);

    this.stats.end();
  }
}

export default GameScene;
