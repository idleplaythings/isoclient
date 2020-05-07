import * as THREE from "three";
import Vector from "../../model/util/Vector.mjs";

const raycaster = new THREE.Raycaster();

class CoornidateConverter {
  constructor(gameScene, gameCamera, groundChunkSize) {
    this.gameScene = gameScene;
    this.gameCamera = gameCamera;
    this.groundChunkSize = groundChunkSize;
  }

  fromViewPortToGame(pos) {
    var result = {
      x: 0,
      y: 0,
      z: 0,
    };

    const mobiles = [];

    raycaster.setFromCamera(
      { x: pos.xR, y: pos.yR },
      this.gameCamera.getCamera()
    );

    const intersects = raycaster.intersectObjects(
      this.gameScene.scene.children,
      true
    );

    intersects.forEach(function(intersected) {
      if (intersected.object.name === "mobile") {
        mobiles.push(intersected.object.userData.mobile);
      }

      if (intersected.object.name === "ground") {
        result.x = intersected.point.x + 0.5;
        result.y = intersected.point.y + 0.5;
        result.z = intersected.point.z;
      }
    });

    return {
      world: new Vector(result),
      tile: new Vector(
        Math.floor(result.x),
        Math.floor(result.y),
        Math.floor(result.z)
      ),
      mobiles,
    };
  }
}

export default CoornidateConverter;
