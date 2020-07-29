import MobileAction from "./MobileAction";

class WorkPropMobileAction extends MobileAction {
  constructor(position, propType) {
    super();
    this.position = position;
    this.propType = propType;
  }

  clone() {
    const newAction = new WorkPropMobileAction(this.position, this.propType);
    return super.clone(newAction);
  }

  execute() {
    console.log("execute work prop");
    if (this.executing) {
      return;
    }

    this.gameServerConnector.sendWorkPropRequest(
      this.mobile,
      this.position,
      this.propType
    );
  }
}

export default WorkPropMobileAction;
