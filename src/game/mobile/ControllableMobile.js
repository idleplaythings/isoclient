import * as THREE from "three";
import Vector from "../../model/util/Vector.mjs";

class ControllableMobile {
  constructor(gameScene) {
    this.gameScene = gameScene;

    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.8, 1.8),
      new THREE.MeshBasicMaterial({
        transparent: false,
        //opacity: 0.25,
        color: 0x006600,
        //depthTest: true,
        //depthWrite: true,
        //wireframe: true,
      })
    );

    this.mesh.visible = false;
    this.gameScene.add(this.mesh);
    this.mesh.name = "mobile";
    this.mesh.userData.mobile = this;

    this.gamePosition = new Vector(0, 0, 0);
    this.movementSpeed = 500;

    this.movementPath = null;
    this.nextMovementTime = null;
    this.movementStarted = null;
    this.currentMovementSpeed = null;
    this.nextMovementPosition = null;
  }

  render({ now }) {
    if (!this.nextMovementPosition) {
      return;
    }

    const movementDone =
      (now - this.movementStarted) / this.currentMovementSpeed;

    if (movementDone < 1) {
      const position = this.nextMovementPosition
        .sub(this.gamePosition)
        .multiplyScalar(movementDone)
        .add(this.gamePosition);
      this.setPosition(position);
    } else {
      this.setPositionAndGamePosition(this.nextMovementPosition);
      if (this.movementPath.length > 0) {
        this.movementStarted = now;
        this.currentMovementSpeed = this.getNextMovementSpeed();
        this.nextMovementTime = now + this.currentMovementSpeed;
        this.nextMovementPosition = new Vector(this.movementPath.shift());
      } else {
        this.movementPath = null;
        this.nextMovementTime = null;
        this.movementStarted = null;
        this.currentMovementSpeed = null;
        this.nextMovementPosition = null;
      }
    }
  }

  setMovementPath(path) {
    console.log("set movement path", path);
    this.movementPath = path;
    this.movementStarted = Date.now();
    this.currentMovementSpeed = this.getNextMovementSpeed();
    this.nextMovementTime = Date.now() + this.currentMovementSpeed;
    this.nextMovementPosition = new Vector(this.movementPath.shift());
  }

  getNextMovementSpeed() {
    if (
      this.movementPath[0].x !== this.x &&
      this.movementPath[0].y !== this.y
    ) {
      return this.movementSpeed * 1.41421;
    }

    return this.movementSpeed;
  }

  isSelectable() {
    return true;
  }

  setSelected(selected = true) {
    if (!selected) {
      this.mesh.material.color.setHex(0x006600);
    } else {
      this.mesh.material.color.setHex(0xffffff);
    }
  }

  getGamePosition() {
    return this.gamePosition;
  }

  setGamePosition(position) {
    this.gamePosition = new Vector(position);
  }

  setPositionAndGamePosition(position) {
    this.setGamePosition(position);
    this.setPosition(position);
  }

  setPosition(position) {
    this.mesh.visible = true;
    this.mesh.position.set(position.x, position.y, position.z + 1);
  }

  destroy() {
    this.gameScene.remove(this.mesh);
  }
}

export default ControllableMobile;
