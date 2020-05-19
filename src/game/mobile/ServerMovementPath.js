import Vector from "../../model/util/Vector.mjs";

class ServerMovementPath {
  constructor(mobile) {
    this.mobile = mobile;
    this.step = null;
    this.nextStep = null;
    this.nextGamePositionChange = null;
  }

  getNextMovementStepPosition() {
    return this.step ? this.step.position : null;
  }
  getNextMovementStepTime() {
    return this.step ? this.step.time : null;
  }

  addStep(position, time) {
    const step = new ServerMovementStep(position, time);
    if (!this.step || this.step.moved || step.time < this.step.time) {
      this.step = step;
    } else if (!step.equals(this.step)) {
      this.nextStep = step;
    }
  }

  getNewWorldPositionAndGamePosition({ now, delta }, currentWorldPosition) {
    if (!this.step) {
      return [null, null];
    }

    let gamePosition = null;
    let worldPosition = null;

    if (!this.step.moved && now >= this.step.time) {
      gamePosition = this.step.position;
      this.step.moved = true;

      if (this.nextStep) {
        this.step = this.nextStep;
        this.nextStep = null;
      }
    }

    const targetTime = this.step.displayTime;
    const startTime = now - delta;
    const duration = targetTime - startTime;
    const percentDone = delta / duration;
    const eta = targetTime > now ? targetTime - now : 0;
    const distance = currentWorldPosition.distanceTo(this.step.position);

    if (eta === 0) {
      if (this.step.moved && !this.nextStep) {
        worldPosition = this.step.position;
        this.step = null;
      }
    } else {
      worldPosition = currentWorldPosition.add(
        this.step.position
          .sub(currentWorldPosition)
          .normalize()
          .multiplyScalar(distance * percentDone)
      );
    }

    return [gamePosition, worldPosition];
  }
}

class ServerMovementStep {
  constructor(position, time) {
    this.position = new Vector(position);
    this.time = time;
    this.displayTime = time + 250;
    this.moved = false;
  }

  equals(step) {
    return this.position.equals(step.position);
  }
}

export default ServerMovementPath;
