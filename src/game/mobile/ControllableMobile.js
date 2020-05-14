import * as THREE from "three";
import Vector from "../../model/util/Vector.mjs";
import PlayerMobile from "../../model/mobile/PlayerMobile.mjs";

class ControllableMobile extends PlayerMobile {
  constructor(gameScene) {
    super(null, null);
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

  render({ now }) {
    if (!this.nextPosition) {
      return;
    }

    const movementDone =
      (now - this.movementStarted) / this.currentMovementSpeed;

    if (movementDone < 1) {
      const position = this.nextPosition
        .sub(this.mesh.position)
        .multiplyScalar(movementDone)
        .add(this.mesh.position);
      this.setWorldPosition(position);
    } else {
      this.setPositionAndWorldPosition(this.nextPosition);
      if (this.movementPath.length > 0) {
        this.movementStarted = now;
        this.currentMovementSpeed = this.getNextMovementSpeed();
        this.nextPositionTime = now + this.currentMovementSpeed;
        this.nextPosition = new Vector(this.movementPath.shift());
      } else {
        this.movementPath = null;
        this.nextPositionTime = null;
        this.movementStarted = null;
        this.currentMovementSpeed = null;
        this.nextPosition = null;
      }
    }
  }

  setMovementPath(path) {
    if (path.length === 0) {
      return;
    }

    if (this.nextPosition) {
      this.movementPath = path;
      return;
    }

    console.log("set movement path", path);
    this.movementPath = path;
    this.movementStarted = Date.now();
    this.currentMovementSpeed = this.getNextMovementSpeed();
    this.nextPositionTime = Date.now() + this.currentMovementSpeed;
    this.nextPosition = new Vector(this.movementPath.shift());
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

export default ControllableMobile;
