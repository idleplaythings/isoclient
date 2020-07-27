import Vector from "../../../model/util/Vector.mjs";
import MovementPathStep from "../MovementPathStep";
import MobileAction from "./MobileAction";
import { isAdjacent } from "../../../model/util/isAdjacent.mjs";

class MoveToMobileAction extends MobileAction {
  constructor(position) {
    super();
    this.position = position;

    this.movementPath = null;
    this.lastRequested = null;
  }

  clone() {
    const newAction = new MoveToMobileAction(this.position);
    return super.clone(newAction);
  }

  execute() {
    if (this.executing) {
      return;
    }

    this.mobileLibrary.selectedMobiles.forEach((mobile) =>
      this.findMobilePath(mobile, this.position)
    );
  }

  movementRequestFailed(position) {
    console.log("movement request failed", position);
    this.lastRequested = null;
  }

  movementFailed(position) {
    this.movementPath = null;
    this.lastRequested = null;
  }

  setNextMovement(nextPosition, nextPositionTime) {
    if (this.cancelled) {
      return;
    }

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

    const nextStep = this.mobile.serverMovementPath.getNextMovementStepPosition();
    if (nextStep) {
      return nextStep;
    }

    return this.mobile.getPosition();
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

  async findMobilePath(mobile, position) {
    const path = await this.tileLibrary.findPath(
      this.getPositionForPathfinding(),
      position
    );

    this.setMovementPath(path);
  }

  requestMovement(position) {
    this.lastRequested = new Vector(position);
    this.gameServerConnector.sendMoveRequest(this.mobile, position);
  }
}

export default MoveToMobileAction;
