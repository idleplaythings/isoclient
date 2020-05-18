import Vector from "../../model/util/Vector.mjs";

class ServerMovementPath {
  constructor(mobile) {
    this.mobile = mobile;
    this.steps = [];

    this.nextGamePositionChange = null;
  }

  getNextMovementPosition() {
    if (this.steps.length === 0 || this.nextGamePositionChange === null) {
      return null;
    }

    return this.steps
      .filter((step) => step.time === this.nextGamePositionChange)
      .map(({ position }) => position)
      .shift();
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
    const step = this.steps.find(
      (s) => !s.used && s.time > this.nextGamePositionChange
    );

    return step ? step.time : null;
  }

  getNewGameStep(now) {
    let step = null;

    for (let i = 0; i < this.steps.length; i++) {
      const nextStep = this.steps[i];

      if (nextStep.used) {
        continue;
      } else if (now >= nextStep.time) {
        step = nextStep;
      } else {
        break;
      }
    }

    this.steps = this.steps.filter((s) => s.time > now - 2000);
    return step;
  }

  getNewWorldPositionAndGamePosition({ now }) {
    if (this.steps.length === 0) {
      return [null, null];
    }

    let gamePosition = null;

    if (
      this.nextGamePositionChange !== null &&
      now > this.nextGamePositionChange
    ) {
      const step = this.getNewGameStep(now);
      step.used = true;
      gamePosition = step.position;
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
