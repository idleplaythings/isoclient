import * as THREE from "three";
import Vector from "../../model/util/Vector.mjs";
import PlayerMobile from "../../model/mobile/PlayerMobile.mjs";

class UncontrollableMobile extends PlayerMobile {
  constructor(gameScene) {
    super(null, null);
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

    this.movementSpeed = 500;

    this.movementPath = null;
    this.movementStarted = null;
    this.currentMovementSpeed = null;

    this.nextPosition = null;
    this.nextPositionTime = null;
  }

  deserialize(data) {
    super.deserialize(data);

    this.setWorldPosition(this.position);

    return this;
  }

  render({ now }) {}

  isSelectable() {
    return false;
  }

  getPositionOrNextMovementPosition() {
    if (this.nextPosition) {
      console.log("return next Position", this.nextPosition);
      return this.nextPosition;
    } else {
      console.log("return getPosition", this.getPosition());
      return this.getPosition();
    }
  }

  setPositionAndWorldPosition(position) {
    this.setWorldPosition(position);
    this.setPosition(position);
  }

  getWorldPosition() {
    return new Vector(this.mesh.position);
  }

  setWorldPosition(position) {
    this.mesh.visible = true;
    this.mesh.position.set(position.x, position.y, position.z + 1);
  }

  destroy() {
    this.gameScene.remove(this.mesh);
  }
}

export default UncontrollableMobile;
