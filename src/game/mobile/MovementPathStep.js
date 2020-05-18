import Vector from "../../model/util/Vector.mjs";

class MovementPathStep {
  constructor(data) {
    this.position = new Vector(data);
    this.requested = false;
    this.received = false;
  }

  equals(other) {
    if (other instanceof Vector) {
      return this.position.equals(other);
    } else if (other instanceof MovementPathStep) {
      return this.position.equals(other.position);
    } else {
      return this.position.equals(new Vector(other));
    }
  }

  setRequested() {
    this.requested = true;
  }

  setReceived() {
    this.received = true;
  }
}

export default MovementPathStep;
