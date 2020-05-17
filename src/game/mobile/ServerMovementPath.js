import Vector from "../../model/util/Vector.mjs";

class ServerMovementPath {
  constructor(mobile) {
    this.mobile = mobile;
    this.steps = [];

    this.nextGamePositionChange = null;
  }

  addStep(position, time) {
    this.steps = this.steps.filter((step) => step.time < time);
    this.steps.push(new ServerMovementStep(position, time));
    if (
      this.nextGamePositionChange === null ||
      this.nextGamePositionChange > time
    ) {
      this.nextGamePositionChange = time;
    }
  }

  getNextMovementStepChangeTime() {
    const step = this.steps.find((s) => s.time > this.nextGamePositionChange);

    return step ? step.time : null;
  }

  getNewGamePosition(now) {
    let step = null;

    for (let i = 0; i < this.steps.length; i++) {
      const nextStep = this.steps[i];

      if (now >= nextStep.time) {
        step = nextStep;
      } else {
        break;
      }
    }

    this.steps = this.steps.filter((s) => s.time < now - 2000);
    return step ? step.position : null;
  }

  getNewWorldPositionAndGamePosition({ now, delta }) {
    if (this.steps.length === 0) {
      return [null, null];
    }

    let gamePosition = null;

    if (now > this.nextGamePositionChange) {
      gamePosition = this.getNewGamePosition(now);
      this.nextGamePositionChange = this.getNextMovementStepChangeTime();
    }

    return [gamePosition, gamePosition];
  }
}

class ServerMovementStep {
  constructor(position, time) {
    this.position = new Vector(position);
    this.time = time;
  }
}

export default ServerMovementPath;
