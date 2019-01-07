import * as THREE from "three";

class GameCamera {
  constructor() {
    this.implementation = null;
    this.scrollingUp = false;
    this.scrollingLeft = false;
    this.scrollingDown = false;
    this.scrollingRight = false;
    this.scrollingSpeed = 0.02;
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
      .add(new THREE.Vector3(-50, 50, -50));
  }

  getRenderRadius() {}

  getRenderArea() {
    const radius = 50;
    const position = this.getLookAtPosition();

    return {
      x1: this.floorToTens(position.x) - radius,
      y1: this.floorToTens(position.y) - radius,
      x2: this.floorToTens(position.x) + radius,
      y2: this.floorToTens(position.y) + radius
    };
  }

  floorToTens(number) {
    return Math.floor(number / 10) * 10;
  }
}

export default GameCamera;
