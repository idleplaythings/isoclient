import * as THREE from "three";
import Vector from "../../model/util/Vector";
import ServerMovementPath from "./ServerMovementPath";

class ClientMobile {
  constructor(gameScene) {
    this.id = null;
    this.position = null;
    this.movementSpeed = 500;
    this.gameScene = gameScene;

    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.8, 1.8),
      new THREE.MeshBasicMaterial({
        transparent: false,
        //opacity: 0.25,
        color: 0x660000,
        //depthTest: true,
        //depthWrite: true,
        //wireframe: true,
      })
    );

    this.mesh.visible = false;
    this.gameScene.add(this.mesh);
    this.mesh.name = "mobile";
    this.mesh.userData.mobile = this;

    this.movementStarted = null;
    this.currentMovementSpeed = null;

    this.mesh.material.color.setHex(this.getColor());

    this.serverMovementPath = new ServerMovementPath(this);
  }

  isSelectable() {
    return false;
  }

  getColor() {
    return 0x666600;
  }

  setPositionAndWorldPosition(position) {
    this.setWorldPosition(position);
    this.setPosition(position);
  }

  getWorldPosition() {
    return new Vector(
      this.mesh.position.x,
      this.mesh.position.y,
      this.mesh.position.z - 1
    );
  }

  setWorldPosition(position) {
    this.mesh.visible = true;
    this.mesh.position.set(position.x, position.y, position.z + 1);
  }

  destroy() {
    this.gameScene.remove(this.mesh);
  }

  render(payload) {
    const [
      gamePosition,
      worldPosition,
    ] = this.serverMovementPath.getNewWorldPositionAndGamePosition(
      payload,
      this.getWorldPosition()
    );

    if (gamePosition) {
      this.setPosition(gamePosition);
    }

    if (worldPosition) {
      this.setWorldPosition(worldPosition);
    }
  }

  movementFailed(position) {
    console.log("movement failed", position);
    this.serverMovementPath.addStep(position, Date.now() + 200);
  }

  setNextMovement(nextPosition, nextPositionTime) {
    console.log("movement step", nextPosition);
    this.serverMovementPath.addStep(nextPosition, nextPositionTime);
  }

  setPosition(position) {
    this.position = new Vector(position);
    return this;
  }

  getPosition() {
    return this.position;
  }

  serialize() {
    return {
      id: this.id,
      position: this.position,
    };
  }

  deserialize(data = {}) {
    this.id = data.id;
    this.position = data.position ? new Vector(data.position) : new Vector();
    this.setWorldPosition(this.position);

    return this;
  }
}

export default ClientMobile;
