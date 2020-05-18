import Vector from "../../model/util/Vector.mjs";
import ClientMobile from "./ClientMobile";
import { isAdjacent } from "../../model/util/isAdjacent.mjs";
import MovementPathStep from "./MovementPathStep";

class ControllableMobile extends ClientMobile {
  constructor(gameScene, mobileLibrary) {
    super(gameScene);
    this.mobileLibrary = mobileLibrary;

    this.movementPath = null;
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
  }

  setNextMovement(nextPosition, nextPositionTime) {
    super.setNextMovement(nextPosition, nextPositionTime);

    this.prunePathUntilAdjacent(nextPosition);

    if (this.movementPath.length === 0) {
      return;
    }

    this.mobileLibrary.requestMove(this, this.movementPath[0].position);
    this.movementPath.shift();
  }

  setMovementPath(path) {
    if (path.length === 0) {
      return;
    }

    console.log("new movement path", path);
    this.movementPath = path.map((step) => new MovementPathStep(step));

    const nextStep = this.serverMovementPath.getNextMovementPosition();
    if (nextStep === null) {
      this.mobileLibrary.requestMove(this, this.movementPath[0].position);
    } else if (this.movementPath[0].equals(nextStep)) {
      return;
    } else {
      //TODO: Cancel only if current position is farther than next step
      this.mobileLibrary.requestMove(this, null);
      this.mobileLibrary.requestMove(this, this.movementPath[0].position);
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
