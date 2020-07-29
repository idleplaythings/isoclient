import ClientMobile from "./ClientMobile";
import { isAdjacent } from "../../model/util/isAdjacent.mjs";

class ControllableMobile extends ClientMobile {
  constructor(gameScene, mobileLibrary) {
    super(gameScene);
    this.mobileLibrary = mobileLibrary;
    this.actions = [];
  }

  cancelActionQueue() {
    this.actions.forEach((action) => action.cancel());
    this.actions = [];
  }

  addAction(action) {
    this.actions.push(action);
  }

  executeAction() {
    if (!this.actions[0]) {
      return;
    }

    this.actions[0].execute();
  }

  executeActionIfFree() {
    if (this.actions.length !== 1) {
      return;
    }

    this.actions[0].execute();
  }

  actionDone() {
    console.log("action done");

    this.actions.splice(0, 1);

    if (!this.actions[0]) {
      return;
    }

    this.actions[0].execute();
  }

  actionCancelled() {
    console.log("action cancelled");
    this.cancelActionQueue();
  }

  movementRequestFailed(position) {
    if (this.actions[0] && this.actions[0].movementRequestFailed) {
      this.actions[0].movementRequestFailed(position);
    }
  }

  movementFailed(position) {
    super.movementFailed(position);
    if (this.actions[0] && this.actions[0].movementFailed) {
      this.actions[0].movementFailed(position);
    }
  }

  setNextMovement(nextPosition, nextPositionTime) {
    super.setNextMovement(nextPosition, nextPositionTime);
    if (this.actions[0] && this.actions[0].setNextMovement) {
      this.actions[0].setNextMovement(nextPosition, nextPositionTime);
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
