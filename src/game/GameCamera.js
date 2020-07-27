import * as THREE from "three";
import { RenderArea } from "./tile";
import { getChunkPosition } from "../model/tile/Chunk";
import { UiStateMessages } from "../ui/UiState";

const CAMERA_OFFSET = new THREE.Vector3(25, -25, 50);

class GameCamera {
  constructor(uiStateDispatch) {
    this.uiStateDispatch = uiStateDispatch;

    this.implementation = null;
    this.scrollingUp = false;
    this.scrollingLeft = false;
    this.scrollingDown = false;
    this.scrollingRight = false;
    this.scrollingSpeed = 0.02;
    this.zoom = 1.5;

    this.scene = null;

    window.gameCamera = this;
  }

  moveTo(position) {
    this.implementation.position.x = position.x;
    this.implementation.position.y = position.y;
  }

  init(scene) {
    this.scene = scene;

    const d = 120;
    this.implementation = new THREE.OrthographicCamera(
      (this.zoom * window.innerWidth) / -d,
      (this.zoom * window.innerWidth) / d,
      (this.zoom * window.innerHeight) / d,
      (this.zoom * window.innerHeight) / -d,
      -500,
      500
    );

    this.implementation.position.set(
      CAMERA_OFFSET.x,
      CAMERA_OFFSET.y,
      CAMERA_OFFSET.z
    );
    //this.camera.position.set(0, 0, 0);
    this.implementation.lookAt(0, 0, 0);
    this.implementation.rotation.z += (50.77 * Math.PI) / 180;

    this.implementation.position.set(
      512 + CAMERA_OFFSET.x,
      512 + CAMERA_OFFSET.y,
      50
    );
  }

  getCamera() {
    return this.implementation;
  }

  onKeyDown(event) {
    switch (event.key) {
      case "w":
        this.scrollingUp = true;
        return;
      case "a":
        this.scrollingLeft = true;
        return;
      case "s":
        this.scrollingDown = true;
        return;
      case "d":
        this.scrollingRight = true;
        return;
      default:
        return;
    }
  }

  onKeyUp(event) {
    switch (event.key) {
      case "w":
        this.scrollingUp = false;
        return;
      case "a":
        this.scrollingLeft = false;
        return;
      case "s":
        this.scrollingDown = false;
        return;
      case "d":
        this.scrollingRight = false;
        return;
      default:
        return;
    }
  }

  render(delta) {
    if (
      !this.implementation ||
      (!this.scrollingUp &&
        !this.scrollingLeft &&
        !this.scrollingDown &&
        !this.scrollingRight)
    ) {
      return;
    }

    this.uiStateDispatch({ type: UiStateMessages.CLOSE_CONTEXT_MENU });

    const vector = new THREE.Vector3(0, 0, 0);
    if (this.scrollingRight) {
      vector.x += 1;
      vector.y += 1;
    }

    if (this.scrollingLeft) {
      vector.x -= 1;
      vector.y -= 1;
    }

    if (this.scrollingUp) {
      vector.x -= 1;
      vector.y += 1;
    }

    if (this.scrollingDown) {
      vector.x += 1;
      vector.y -= 1;
    }

    const speed = this.scrollingSpeed * delta;
    vector.normalize().multiplyScalar(speed);

    this.implementation.position.x += vector.x;
    this.implementation.position.y += vector.y;
  }

  getLookAtPosition() {
    return this.implementation.position
      .clone()
      .add(CAMERA_OFFSET.clone().multiplyScalar(-1));
  }

  getRenderArea(chunkSize, renderSize = 8) {
    const chunkPosition = getChunkPosition(this.getLookAtPosition(), chunkSize);

    const corner = {
      x: chunkPosition.x - (renderSize / 2) * chunkSize,
      y: chunkPosition.y + (renderSize / 2) * chunkSize,
    };

    return new RenderArea(corner, renderSize, chunkSize);
  }

  floorToTens(number) {
    return Math.floor(number / 10) * 10;
  }

  onResize() {
    const d = 120;

    this.implementation.left = (this.zoom * window.innerWidth) / -d;
    this.implementation.right = (this.zoom * window.innerWidth) / d;
    this.implementation.top = (this.zoom * window.innerHeight) / d;
    this.implementation.bottom = (this.zoom * window.innerHeight) / -d;
    this.implementation.updateProjectionMatrix();
    this.implementation.updateMatrixWorld();
  }
}

export default GameCamera;
