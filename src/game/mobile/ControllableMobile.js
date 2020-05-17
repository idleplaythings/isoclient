import Vector from "../../model/util/Vector.mjs";
import ClientMobile from "./ClientMobile";

class ControllableMobile extends ClientMobile {
  constructor(gameScene, mobileLibrary) {
    super(gameScene);
    this.mobileLibrary = mobileLibrary;

    this.movementPath = null;
  }

  setMovementPath(path) {
    if (path.length === 0) {
      return;
    }

    console.log("set movement path", path);

    this.movementPath = path;
    this.mobileLibrary.requestMove(this, this.movementPath[0]);
  }

  render(payload) {
    super.render(payload);

    //TODO: Request next move instantly after cancellation deadline has been reached
    //Cancellation deadline is nextPositionTime - movementSpeed / 2
    if (
      this.movementPath &&
      this.movementPath.length !== 0 &&
      this.getPosition().equals(new Vector(this.movementPath[0]))
    ) {
      this.movementPath.shift();

      if (this.movementPath.length === 0) {
        return;
      }

      this.mobileLibrary.requestMove(this, this.movementPath[0]);
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
