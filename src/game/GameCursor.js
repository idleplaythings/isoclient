import * as THREE from "three";

class GameCursor {
  constructor(gameScene) {
    this.gameScene = gameScene;

    this.cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 2),
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.25,
        color: 0x0099ff,
        //depthTest: true,
        //depthWrite: true,
        //wireframe: true,
      })
    );
    this.cube.position.set(512, 512, 1);

    this.cube.visible = false;
    this.gameScene.add(this.cube);
  }

  onMouseMove(worldPosition) {
    this.cube.position.set(
      worldPosition.tile.x,
      worldPosition.tile.y,
      worldPosition.tile.z + 1
    );
    this.cube.visible = true;
  }
}

export default GameCursor;
