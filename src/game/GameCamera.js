import * as THREE from "three";
import { RenderArea } from "./tile";
import { getChunkPosition } from "../model/tile/Chunk";

class GameCamera {
  constructor() {
    this.implementation = null;
    this.scrollingUp = false;
    this.scrollingLeft = false;
    this.scrollingDown = false;
    this.scrollingRight = false;
    this.scrollingSpeed = 0.02;

    window.gameCamera = this;
  }

  moveTo(position) {
    this.implementation.position.x = position.x;
    this.implementation.position.y = position.y;
  }

  init(implementation) {
    this.implementation = implementation;
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
      .add(new THREE.Vector3(0, 0, -50));
  }

  getRenderArea(chunkSize, renderSize = 4) {
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
}

export default GameCamera;
