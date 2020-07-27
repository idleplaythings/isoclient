import Vector from "../../../model/util/Vector.mjs";
import MovementPathStep from "../MovementPathStep";
import MobileAction from "./MobileAction";
import { isAdjacent } from "../../../model/util/isAdjacent.mjs";

class WorkTileMobileAction extends MobileAction {
  constructor(position) {
    super();
    this.position = position;
  }

  clone() {
    const newAction = new WorkTileMobileAction(this.position);
    return super.clone(newAction);
  }

  execute() {
    if (this.executing) {
      return;
    }

    this.gameServerConnector.requestWorkTile(this.position);
  }
}

export default WorkTileMobileAction;
