import Vector from "../../model/util/Vector.mjs";
import ClientMobile from "./ClientMobile";
import { isAdjacent } from "../../model/util/isAdjacent.mjs";
import MovementPathStep from "./MovementPathStep";

class ControllableMobile extends ClientMobile {
  constructor(gameScene, mobileLibrary) {
    super(gameScene);
    this.mobileLibrary = mobileLibrary;

    this.movementPath = null;
    this.lastRequested = null;
  }

  requestMovement(position) {
    this.lastRequested = new Vector(position);
    this.mobileLibrary.requestMove(this, position);
  }

  prunePathUntilAdjacent(position) {
    const toDelete = [];
    let found = false;

    for (let i = this.movementPath.length - 1; i >= 0; i--) {
      const step = this.movementPath[i];
      if (step.equals(position)) {
        toDelete.push(step);
      } else if (isAdjacent(step.position, position)) {
        found = true;
      } else if (found) {
        toDelete.push(step);
      }
    }

    this.movementPath = this.movementPath.filter(
      (step) => !toDelete.includes(step)
    );

    return found;
  }

  movementRequestFailed(position) {
    console.log("movement request failed", position);
    this.lastRequested = null;
  }

  movementFailed(position) {
    super.movementFailed(position);
    this.movementPath = null;
    this.lastRequested = null;
  }

  setNextMovement(nextPosition, nextPositionTime) {
    super.setNextMovement(nextPosition, nextPositionTime);

    if (this.lastRequested && this.lastRequested.equals(nextPosition)) {
      this.lastRequested = null;
    }

    if (!this.movementPath) {
      return;
    }

    this.prunePathUntilAdjacent(nextPosition);

    if (this.movementPath.length === 0) {
      return;
    }

    this.requestMovement(this.movementPath[0].position);
    this.movementPath.shift();

    if (this.movementPath.length === 0) {
      this.movementPath = null;
    }
  }

  getLastRequestedOrLastServerMove() {
    if (this.lastRequested) {
      return this.lastRequested;
    }

    const nextStep = this.serverMovementPath.getNextMovementStepPosition();
    if (nextStep) {
      return nextStep;
    }

    return this.getPosition();
  }

  getPositionForPathfinding() {
    return this.getLastRequestedOrLastServerMove();
  }

  setMovementPath(path) {
    if (path.length === 0) {
      return;
    }

    this.movementPath = path.map((step) => new MovementPathStep(step));

    const nextPosition = this.getLastRequestedOrLastServerMove();
    if (nextPosition && this.movementPath[0].equals(nextPosition)) {
      return;
    }

    const found = this.prunePathUntilAdjacent(nextPosition);

    if (!found) {
      this.mobileLibrary.findMobilePath(
        this,
        this.movementPath[this.movementPath.length - 1]
      );
      this.movementPath = null;
    } else {
      this.requestMovement(this.movementPath[0].position);
    }
  }

  isSelectable() {
    return true;
  }

  getColor() {
    return 0x006600;
  }

  setSelected(selected = true) {
    if (!selected) {
      this.mesh.material.color.setHex(this.getColor());
    } else {
      this.mesh.material.color.setHex(0xffffff);
    }
  }
}

export default ControllableMobile;
