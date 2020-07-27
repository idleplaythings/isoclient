class MobileAction {
  constructor() {
    this.executing = false;
    this.cancelled = false;
    this.mobile = null;
  }

  cloneFor(mobile) {
    const action = this.clone();
    action.setMobile(mobile);
    return action;
  }

  clone(newAction) {
    newAction.populate(
      this.mobileLibrary,
      this.tileLibrary,
      this.gameServerConnector
    );

    return newAction;
  }

  setMobile(mobile) {
    this.mobile = mobile;
  }

  cancel() {
    this.cancelled = true;
  }

  populate(mobileLibrary, tileLibrary, gameServerConnector) {
    this.mobileLibrary = mobileLibrary;
    this.tileLibrary = tileLibrary;
    this.gameServerConnector = gameServerConnector;
  }

  execute() {}
}

export default MobileAction;
